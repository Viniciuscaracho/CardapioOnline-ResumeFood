class SqsDlqWorker
  include Sidekiq::Worker
  
  sidekiq_options queue: :sqs_dlq, retry: 1, backtrace: true
  
  def perform(message_body, error_message)
    Rails.logger.error "💀 Processing DLQ message: #{error_message}"
    
    # Parse message
    data = JSON.parse(message_body)
    
    # Registrar falha
    log_failure(data, error_message)
    
    # Tentar recuperação automática
    if can_auto_recover?(data, error_message)
      attempt_recovery(data, error_message)
    else
      # Requer intervenção manual
      notify_manual_intervention(data, error_message)
    end
    
    Rails.logger.info "✅ DLQ message processed: #{data['order_id']}"
    
  rescue => e
    Rails.logger.error "❌ Error processing DLQ message: #{e.message}"
    raise e
  end
  
  private
  
  def log_failure(data, error_message)
    # Registrar falha no banco de dados
    FailureLog.create!(
      service: 'sqs_order_worker',
      message_body: message_body,
      error_message: error_message,
      order_id: data['order_id'],
      action: data['action'],
      occurred_at: Time.current,
      status: 'pending'
    )
    
    Rails.logger.error "📝 Failure logged: Order #{data['order_id']} - #{error_message}"
  end
  
  def can_auto_recover?(data, error_message)
    # Casos que podem ser recuperados automaticamente
    recoverable_errors = [
      'Temporary network error',
      'Rate limit exceeded',
      'Service temporarily unavailable',
      'Timeout error'
    ]
    
    recoverable_errors.any? { |error| error_message.include?(error) }
  end
  
  def attempt_recovery(data, error_message)
    Rails.logger.info "🔄 Attempting auto-recovery for order: #{data['order_id']}"
    
    # Estratégias de recuperação
    case error_message
    when /Temporary network error/
      # Retry com backoff
      SqsOrderWorker.perform_in(5.minutes, data.to_json)
    when /Rate limit exceeded/
      # Retry com delay maior
      SqsOrderWorker.perform_in(30.minutes, data.to_json)
    when /Service temporarily unavailable/
      # Retry com delay exponencial
      SqsOrderWorker.perform_in(1.hour, data.to_json)
    when /Timeout error/
      # Retry imediato
      SqsOrderWorker.perform_async(data.to_json)
    end
    
    # Atualizar status do log
    failure_log = FailureLog.find_by(order_id: data['order_id'], status: 'pending')
    failure_log&.update!(status: 'auto_recovery_attempted')
    
    Rails.logger.info "🔄 Auto-recovery scheduled for order: #{data['order_id']}"
  end
  
  def notify_manual_intervention(data, error_message)
    Rails.logger.error "🚨 Manual intervention required for order: #{data['order_id']}"
    
    # Enviar alerta para administradores
    AdminAlertWorker.perform_async('dlq_manual_intervention', {
      order_id: data['order_id'],
      action: data['action'],
      error_message: error_message,
      occurred_at: Time.current
    })
    
    # Atualizar status do log
    failure_log = FailureLog.find_by(order_id: data['order_id'], status: 'pending')
    failure_log&.update!(status: 'manual_intervention_required')
    
    # Enviar email para suporte
    SupportEmailWorker.perform_async('dlq_alert', {
      order_id: data['order_id'],
      error_message: error_message,
      message_body: data.to_json
    })
  end
end
