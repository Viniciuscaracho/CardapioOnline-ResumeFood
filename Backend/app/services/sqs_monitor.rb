class SqsMonitor
  include Sidekiq::Worker
  
  sidekiq_options queue: :monitoring, retry: 3, backtrace: true
  
  # Executar monitoramento a cada 5 minutos
  def self.schedule_monitoring
    perform_in(5.minutes)
  end
  
  def perform
    Rails.logger.info "🔍 Starting SQS monitoring"
    
    # Monitorar todas as filas
    SqsService::QUEUES.each do |queue_name, config|
      monitor_queue(queue_name)
    end
    
    # Verificar DLQs
    check_dlq_health
    
    # Verificar taxa de falha
    check_failure_rates
    
    # Agendar próximo monitoramento
    SqsMonitor.schedule_monitoring
    
    Rails.logger.info "✅ SQS monitoring completed"
    
  rescue => e
    Rails.logger.error "❌ Error in SQS monitoring: #{e.message}"
    raise e
  end
  
  private
  
  def monitor_queue(queue_name)
    stats = SqsService.get_queue_stats(queue_name)
    
    Rails.logger.info "📊 Queue #{queue_name} stats:"
    Rails.logger.info "  - Messages: #{stats[:approximate_number_of_messages]}"
    Rails.logger.info "  - In flight: #{stats[:approximate_number_of_messages_not_visible]}"
    Rails.logger.info "  - Delayed: #{stats[:approximate_number_of_messages_delayed]}"
    
    # Alertas baseados em métricas
    check_queue_alerts(queue_name, stats)
  end
  
  def check_queue_alerts(queue_name, stats)
    # Alerta de backlog
    if stats[:approximate_number_of_messages] > 1000
      send_alert('queue_backlog', {
        queue_name: queue_name,
        backlog_size: stats[:approximate_number_of_messages],
        priority: 'high'
      })
    end
    
    # Alerta de mensagens em processamento
    if stats[:approximate_number_of_messages_not_visible] > 100
      send_alert('queue_processing_delay', {
        queue_name: queue_name,
        in_flight_messages: stats[:approximate_number_of_messages_not_visible],
        priority: 'medium'
      })
    end
    
    # Alerta de mensagens atrasadas
    if stats[:approximate_number_of_messages_delayed] > 50
      send_alert('queue_delayed_messages', {
        queue_name: queue_name,
        delayed_messages: stats[:approximate_number_of_messages_delayed],
        priority: 'medium'
      })
    end
  end
  
  def check_dlq_health
    SqsService::QUEUES.each do |queue_name, config|
      dlq_stats = SqsService.get_queue_stats("#{queue_name}_dlq")
      
      if dlq_stats[:approximate_number_of_messages] > 0
        Rails.logger.error "💀 DLQ #{queue_name} has #{dlq_stats[:approximate_number_of_messages]} messages"
        
        # Enviar alerta para DLQ
        send_alert('dlq_messages', {
          queue_name: queue_name,
          dlq_messages: dlq_stats[:approximate_number_of_messages],
          priority: 'high'
        })
        
        # Tentar recuperação automática
        attempt_dlq_recovery(queue_name, dlq_stats[:approximate_number_of_messages])
      end
    end
  end
  
  def check_failure_rates
    # Verificar taxa de falha por serviço
    FailureLog.recent(1.hour).group(:service).count.each do |service, count|
      if count > 10 # Mais de 10 falhas por hora
        send_alert('high_failure_rate', {
          service: service,
          failure_count: count,
          time_period: '1 hour',
          priority: 'high'
        })
      end
    end
    
    # Verificar falhas de pagamento
    payment_failures = FailureLog.recent(1.hour)
                                 .where("error_message ILIKE ?", '%payment%')
                                 .count
    
    if payment_failures > 5
      send_alert('payment_failures', {
        failure_count: payment_failures,
        time_period: '1 hour',
        priority: 'high'
      })
    end
  end
  
  def attempt_dlq_recovery(queue_name, message_count)
    Rails.logger.info "🔄 Attempting DLQ recovery for #{queue_name}"
    
    # Verificar se há mensagens recuperáveis
    recoverable_count = FailureLog.auto_recoverable_failures
                                 .by_service("sqs_#{queue_name}_worker")
                                 .count
    
    if recoverable_count > 0
      Rails.logger.info "🔄 Found #{recoverable_count} recoverable failures"
      
      # Tentar recuperação automática
      FailureLog.auto_recoverable_failures
                .by_service("sqs_#{queue_name}_worker")
                .limit(10)
                .each do |failure_log|
        attempt_message_recovery(failure_log)
      end
    else
      Rails.logger.warn "⚠️ No recoverable failures found in DLQ #{queue_name}"
    end
  end
  
  def attempt_message_recovery(failure_log)
    Rails.logger.info "🔄 Attempting recovery for failure log #{failure_log.id}"
    
    begin
      # Parse message
      data = JSON.parse(failure_log.message_body)
      
      # Tentar reprocessar
      case failure_log.service
      when 'sqs_orders_worker'
        SqsOrderWorker.perform_async(failure_log.message_body)
      when 'sqs_emails_worker'
        EmailWorker.perform_async(data['email_type'], data['recipient_email'], data['data'])
      when 'sqs_notifications_worker'
        NotificationWorker.perform_async(data['notification_type'], data['user_id'], data['data'])
      when 'sqs_analytics_worker'
        KinesisAnalyticsWorker.perform_async(data['analytics_event_id'])
      end
      
      # Marcar como recuperado
      failure_log.attempt_auto_recovery
      
      Rails.logger.info "✅ Recovery attempted for failure log #{failure_log.id}"
      
    rescue => e
      Rails.logger.error "❌ Recovery failed for failure log #{failure_log.id}: #{e.message}"
      
      # Marcar como requerendo intervenção manual
      failure_log.require_manual_intervention
    end
  end
  
  def send_alert(alert_type, data)
    Rails.logger.error "🚨 Alert: #{alert_type} - #{data}"
    
    # Enviar alerta para administradores
    AdminAlertWorker.perform_async(alert_type, data)
    
    # Enviar notificação via ActionCable
    AdminNotificationsChannel.broadcast_alert(alert_type, data)
  end
end
