class EmailWorker
  include Sidekiq::Worker
  
  sidekiq_options queue: :emails, retry: 3, backtrace: true
  
  def perform(email_type, recipient_email, data = {})
    Rails.logger.info "📧 Sending #{email_type} email to: #{recipient_email}"
    
    case email_type
    when 'order_confirmation'
      send_order_confirmation(recipient_email, data)
    when 'order_ready'
      send_order_ready(recipient_email, data)
    when 'order_delivered'
      send_order_delivered(recipient_email, data)
    when 'marketing'
      send_marketing_email(recipient_email, data)
    else
      Rails.logger.warn "Unknown email type: #{email_type}"
    end
    
    Rails.logger.info "✅ Email sent successfully: #{email_type}"
    
  rescue => e
    Rails.logger.error "❌ Error sending email: #{e.message}"
    raise e
  end
  
  private
  
  def send_order_confirmation(email, data)
    # Simular envio de email de confirmação
    Rails.logger.info "📧 Sending order confirmation to: #{email}"
    sleep(0.5) # Simular tempo de envio
  end
  
  def send_order_ready(email, data)
    # Simular envio de email de pedido pronto
    Rails.logger.info "🍕 Sending order ready notification to: #{email}"
    sleep(0.5)
  end
  
  def send_order_delivered(email, data)
    # Simular envio de email de pedido entregue
    Rails.logger.info "🚚 Sending order delivered notification to: #{email}"
    sleep(0.5)
  end
  
  def send_marketing_email(email, data)
    # Simular envio de email marketing
    Rails.logger.info "📢 Sending marketing email to: #{email}"
    sleep(0.5)
  end
end
