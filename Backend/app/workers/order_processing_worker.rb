class OrderProcessingWorker
  include Sidekiq::Worker
  
  sidekiq_options queue: :orders, retry: 5, backtrace: true
  
  def perform(order_id)
    order = Order.find(order_id)
    
    Rails.logger.info "🔄 Processing order: #{order.id}"
    
    # Processar pedido
    process_order_payment(order)
    send_order_confirmation(order)
    update_inventory(order)
    notify_kitchen(order)
    
    Rails.logger.info "✅ Order processed successfully: #{order.id}"
    
  rescue => e
    Rails.logger.error "❌ Error processing order #{order_id}: #{e.message}"
    raise e
  end
  
  private
  
  def process_order_payment(order)
    # Simular processamento de pagamento
    Rails.logger.info "💳 Processing payment for order: #{order.id}"
    sleep(1) # Simular tempo de processamento
    
    # Aqui você integraria com gateway de pagamento
    # payment_result = PaymentGateway.charge(order.total_amount, order.customer_email)
    
    order.update!(status: 'confirmed', confirmed_at: Time.current)
  end
  
  def send_order_confirmation(order)
    # Enviar email de confirmação
    Rails.logger.info "📧 Sending confirmation email for order: #{order.id}"
    
    # Aqui você integraria com serviço de email
    # OrderMailer.confirmation_email(order).deliver_now
  end
  
  def update_inventory(order)
    # Atualizar estoque
    Rails.logger.info "📦 Updating inventory for order: #{order.id}"
    
    order.order_items.each do |item|
      # Aqui você atualizaria o estoque
      # product = item.product
      # product.update!(stock: product.stock - item.quantity)
    end
  end
  
  def notify_kitchen(order)
    # Notificar cozinha
    Rails.logger.info "👨‍🍳 Notifying kitchen for order: #{order.id}"
    
    # Broadcast via ActionCable
    OrderNotificationsChannel.broadcast_new_order(order)
  end
end
