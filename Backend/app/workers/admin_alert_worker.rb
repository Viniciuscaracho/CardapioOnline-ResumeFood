class AdminAlertWorker
  include Sidekiq::Worker
  
  sidekiq_options queue: :admin_alerts, retry: 3, backtrace: true
  
  def perform(alert_type, data = {})
    Rails.logger.info "🚨 Processing admin alert: #{alert_type}"
    
    case alert_type
    when 'dlq_manual_intervention'
      handle_dlq_alert(data)
    when 'high_failure_rate'
      handle_failure_rate_alert(data)
    when 'queue_backlog'
      handle_backlog_alert(data)
    when 'payment_failures'
      handle_payment_alert(data)
    when 'inventory_issues'
      handle_inventory_alert(data)
    else
      Rails.logger.warn "Unknown alert type: #{alert_type}"
    end
    
    Rails.logger.info "✅ Admin alert processed: #{alert_type}"
    
  rescue => e
    Rails.logger.error "❌ Error processing admin alert: #{e.message}"
    raise e
  end
  
  private
  
  def handle_dlq_alert(data)
    Rails.logger.error "🚨 DLQ Manual Intervention Required"
    Rails.logger.error "Order ID: #{data['order_id']}"
    Rails.logger.error "Action: #{data['action']}"
    Rails.logger.error "Error: #{data['error_message']}"
    
    # Enviar notificação para administradores
    send_admin_notification('DLQ Alert', {
      title: 'Manual Intervention Required',
      message: "Order #{data['order_id']} requires manual intervention",
      order_id: data['order_id'],
      action: data['action'],
      error: data['error_message'],
      priority: 'high'
    })
    
    # Criar ticket de suporte
    create_support_ticket(data)
  end
  
  def handle_failure_rate_alert(data)
    Rails.logger.error "🚨 High Failure Rate Detected"
    Rails.logger.error "Failure Rate: #{data['failure_rate']}%"
    Rails.logger.error "Queue: #{data['queue_name']}"
    
    # Enviar notificação para administradores
    send_admin_notification('High Failure Rate', {
      title: 'High Failure Rate Alert',
      message: "Queue #{data['queue_name']} has #{data['failure_rate']}% failure rate",
      queue_name: data['queue_name'],
      failure_rate: data['failure_rate'],
      priority: 'high'
    })
  end
  
  def handle_backlog_alert(data)
    Rails.logger.error "🚨 Queue Backlog Alert"
    Rails.logger.error "Queue: #{data['queue_name']}"
    Rails.logger.error "Backlog Size: #{data['backlog_size']}"
    
    # Enviar notificação para administradores
    send_admin_notification('Queue Backlog', {
      title: 'Queue Backlog Alert',
      message: "Queue #{data['queue_name']} has #{data['backlog_size']} pending jobs",
      queue_name: data['queue_name'],
      backlog_size: data['backlog_size'],
      priority: 'medium'
    })
  end
  
  def handle_payment_alert(data)
    Rails.logger.error "🚨 Payment Failures Alert"
    Rails.logger.error "Payment Failures: #{data['failure_count']}"
    Rails.logger.error "Time Period: #{data['time_period']}"
    
    # Enviar notificação para administradores
    send_admin_notification('Payment Failures', {
      title: 'Payment Failures Alert',
      message: "#{data['failure_count']} payment failures in #{data['time_period']}",
      failure_count: data['failure_count'],
      time_period: data['time_period'],
      priority: 'high'
    })
  end
  
  def handle_inventory_alert(data)
    Rails.logger.error "🚨 Inventory Issues Alert"
    Rails.logger.error "Product: #{data['product_id']}"
    Rails.logger.error "Issue: #{data['issue_type']}"
    
    # Enviar notificação para administradores
    send_admin_notification('Inventory Issues', {
      title: 'Inventory Issues Alert',
      message: "Product #{data['product_id']} has #{data['issue_type']}",
      product_id: data['product_id'],
      issue_type: data['issue_type'],
      priority: 'medium'
    })
  end
  
  def send_admin_notification(title, data)
    # Enviar notificação para administradores via ActionCable
    AdminNotificationsChannel.broadcast_alert(title, data)
    
    # Enviar email para administradores
    AdminEmailWorker.perform_async('admin_alert', {
      title: title,
      data: data,
      timestamp: Time.current
    })
  end
  
  def create_support_ticket(data)
    # Criar ticket de suporte
    SupportTicket.create!(
      title: "DLQ Manual Intervention - Order #{data['order_id']}",
      description: "Order #{data['order_id']} requires manual intervention due to: #{data['error_message']}",
      priority: 'high',
      status: 'open',
      order_id: data['order_id'],
      error_message: data['error_message']
    )
    
    Rails.logger.info "🎫 Support ticket created for order: #{data['order_id']}"
  end
end
