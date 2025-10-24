class NotificationWorker
  include Sidekiq::Worker
  
  sidekiq_options queue: :notifications, retry: 3, backtrace: true
  
  def perform(notification_type, user_id, data = {})
    user = User.find(user_id)
    
    Rails.logger.info "🔔 Sending #{notification_type} notification to user: #{user.id}"
    
    case notification_type
    when 'order_status_update'
      send_order_status_notification(user, data)
    when 'promotion'
      send_promotion_notification(user, data)
    when 'system_announcement'
      send_system_announcement(user, data)
    else
      Rails.logger.warn "Unknown notification type: #{notification_type}"
    end
    
    Rails.logger.info "✅ Notification sent successfully: #{notification_type}"
    
  rescue => e
    Rails.logger.error "❌ Error sending notification: #{e.message}"
    raise e
  end
  
  private
  
  def send_order_status_notification(user, data)
    # Enviar notificação de status do pedido
    Rails.logger.info "📱 Sending order status notification to user: #{user.id}"
    
    # Aqui você integraria com serviço de push notifications
    # PushNotificationService.send(user.device_token, data[:message])
  end
  
  def send_promotion_notification(user, data)
    # Enviar notificação de promoção
    Rails.logger.info "🎉 Sending promotion notification to user: #{user.id}"
    
    # Aqui você integraria com serviço de push notifications
    # PushNotificationService.send(user.device_token, data[:message])
  end
  
  def send_system_announcement(user, data)
    # Enviar anúncio do sistema
    Rails.logger.info "📢 Sending system announcement to user: #{user.id}"
    
    # Aqui você integraria com serviço de push notifications
    # PushNotificationService.send(user.device_token, data[:message])
  end
end
