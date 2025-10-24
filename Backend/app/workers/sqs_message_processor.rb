class SqsMessageProcessor
  include Sidekiq::Worker
  
  sidekiq_options queue: :sqs_processor, retry: 3, backtrace: true
  
  def perform(queue_name, message_body, receipt_handle)
    Rails.logger.info "🔄 Processing SQS message from #{queue_name}"
    
    # Parse message
    data = JSON.parse(message_body)
    
    # Processar baseado no tipo de fila
    case queue_name.to_sym
    when :orders
      process_order_message(data)
    when :emails
      process_email_message(data)
    when :notifications
      process_notification_message(data)
    when :analytics
      process_analytics_message(data)
    else
      Rails.logger.warn "Unknown queue type: #{queue_name}"
    end
    
    # Deletar mensagem após processamento bem-sucedido
    SqsService.delete_message(queue_name, receipt_handle)
    
    Rails.logger.info "✅ SQS message processed successfully from #{queue_name}"
    
  rescue => e
    Rails.logger.error "❌ Error processing SQS message: #{e.message}"
    
    # Enviar para DLQ se necessário
    handle_processing_error(queue_name, message_body, e)
    
    raise e
  end
  
  private
  
  def process_order_message(data)
    Rails.logger.info "📦 Processing order message: #{data['order_id']}"
    
    # Enfileirar worker específico
    SqsOrderWorker.perform_async(message_body)
  end
  
  def process_email_message(data)
    Rails.logger.info "📧 Processing email message: #{data['email_type']}"
    
    # Enfileirar worker de email
    EmailWorker.perform_async(
      data['email_type'],
      data['recipient_email'],
      data['data'] || {}
    )
  end
  
  def process_notification_message(data)
    Rails.logger.info "🔔 Processing notification message: #{data['notification_type']}"
    
    # Enfileirar worker de notificação
    NotificationWorker.perform_async(
      data['notification_type'],
      data['user_id'],
      data['data'] || {}
    )
  end
  
  def process_analytics_message(data)
    Rails.logger.info "📊 Processing analytics message: #{data['event_type']}"
    
    # Enfileirar worker de analytics
    KinesisAnalyticsWorker.perform_async(data['analytics_event_id'])
  end
  
  def handle_processing_error(queue_name, message_body, error)
    # Verificar se deve enviar para DLQ
    if should_send_to_dlq?(error)
      Rails.logger.error "💀 Sending message to DLQ: #{error.message}"
      
      # Enviar para DLQ
      SqsDlqWorker.perform_async(message_body, error.message)
    else
      # Retry com backoff
      retry_with_backoff(queue_name, message_body, error)
    end
  end
  
  def should_send_to_dlq?(error)
    # Erros que devem ir para DLQ
    dlq_errors = [
      'PaymentGatewayError',
      'InventoryError',
      'NotificationError',
      'ValidationError',
      'BusinessLogicError'
    ]
    
    dlq_errors.any? { |error_type| error.message.include?(error_type) }
  end
  
  def retry_with_backoff(queue_name, message_body, error)
    # Implementar retry com backoff exponencial
    retry_count = get_retry_count(message_body)
    
    if retry_count < 3
      delay = 2 ** retry_count * 60 # 1min, 2min, 4min
      
      Rails.logger.info "🔄 Retrying message in #{delay} seconds (attempt #{retry_count + 1})"
      
      SqsMessageProcessor.perform_in(delay, queue_name, message_body, nil)
    else
      Rails.logger.error "💀 Max retries exceeded, sending to DLQ"
      SqsDlqWorker.perform_async(message_body, error.message)
    end
  end
  
  def get_retry_count(message_body)
    data = JSON.parse(message_body)
    data['retry_count'] || 0
  end
end
