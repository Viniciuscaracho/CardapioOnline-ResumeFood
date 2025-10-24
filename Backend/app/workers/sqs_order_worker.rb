class SqsOrderWorker
  include Sidekiq::Worker
  
  sidekiq_options queue: :sqs_orders, retry: 3, backtrace: true
  
  def perform(message_body)
    Rails.logger.info "🔄 Processing SQS order message: #{message_body}"
    
    # Parse message
    data = JSON.parse(message_body)
    order_id = data['order_id']
    action = data['action']
    
    case action
    when 'create'
      process_order_creation(order_id, data)
    when 'update_status'
      process_order_status_update(order_id, data)
    when 'cancel'
      process_order_cancellation(order_id, data)
    when 'payment'
      process_payment(order_id, data)
    else
      Rails.logger.warn "Unknown action: #{action}"
    end
    
    Rails.logger.info "✅ SQS order processed successfully: #{order_id}"
    
  rescue => e
    Rails.logger.error "❌ Error processing SQS order: #{e.message}"
    
    # Enviar para DLQ se necessário
    send_to_dlq(message_body, e.message) if should_send_to_dlq?(e)
    
    raise e
  end
  
  private
  
  def process_order_creation(order_id, data)
    order = Order.find(order_id)
    
    # Processar pagamento
    payment_result = process_payment_gateway(order, data['payment_data'])
    
    if payment_result[:success]
      # Atualizar status
      order.update!(status: 'confirmed', confirmed_at: Time.current)
      
      # Enviar confirmação
      send_order_confirmation(order)
      
      # Notificar cozinha
      notify_kitchen(order)
      
      # Atualizar estoque
      update_inventory(order)
    else
      # Falha no pagamento
      order.update!(status: 'payment_failed')
      send_payment_failure_notification(order, payment_result[:error])
    end
  end
  
  def process_order_status_update(order_id, data)
    order = Order.find(order_id)
    new_status = data['new_status']
    
    # Validar transição de status
    if valid_status_transition?(order.status, new_status)
      order.update!(status: new_status)
      
      # Enviar notificação baseada no status
      send_status_notification(order, new_status)
      
      # Ações específicas por status
      case new_status
      when 'ready'
        notify_delivery(order)
      when 'delivered'
        send_delivery_confirmation(order)
      when 'cancelled'
        process_cancellation(order)
      end
    else
      Rails.logger.warn "Invalid status transition: #{order.status} -> #{new_status}"
    end
  end
  
  def process_order_cancellation(order_id, data)
    order = Order.find(order_id)
    
    # Verificar se pode cancelar
    if order.can_cancel?
      order.update!(status: 'cancelled', cancelled_at: Time.current)
      
      # Reverter estoque
      revert_inventory(order)
      
      # Processar reembolso
      process_refund(order, data['refund_data'])
      
      # Enviar notificação
      send_cancellation_notification(order)
    else
      Rails.logger.warn "Order #{order_id} cannot be cancelled"
    end
  end
  
  def process_payment(order_id, data)
    order = Order.find(order_id)
    
    # Processar pagamento
    payment_result = process_payment_gateway(order, data['payment_data'])
    
    if payment_result[:success]
      order.update!(status: 'paid', paid_at: Time.current)
      send_payment_confirmation(order)
    else
      order.update!(status: 'payment_failed')
      send_payment_failure_notification(order, payment_result[:error])
    end
  end
  
  def process_payment_gateway(order, payment_data)
    # Simular processamento de pagamento
    Rails.logger.info "💳 Processing payment for order: #{order.id}"
    
    # Aqui você integraria com gateway real (Stripe, PagSeguro, etc.)
    # payment_result = PaymentGateway.charge(order.total_amount, payment_data)
    
    # Simular resultado
    {
      success: rand > 0.1, # 90% de sucesso
      transaction_id: SecureRandom.hex(10),
      error: rand > 0.9 ? 'Insufficient funds' : nil
    }
  end
  
  def valid_status_transition?(current_status, new_status)
    valid_transitions = {
      'pending' => ['confirmed', 'cancelled'],
      'confirmed' => ['preparing', 'cancelled'],
      'preparing' => ['ready', 'cancelled'],
      'ready' => ['out_for_delivery', 'cancelled'],
      'out_for_delivery' => ['delivered'],
      'delivered' => [],
      'cancelled' => [],
      'payment_failed' => ['confirmed', 'cancelled']
    }
    
    valid_transitions[current_status]&.include?(new_status) || false
  end
  
  def should_send_to_dlq?(error)
    # Enviar para DLQ em casos específicos
    dlq_errors = [
      'PaymentGatewayError',
      'InventoryError',
      'NotificationError'
    ]
    
    dlq_errors.any? { |error_type| error.message.include?(error_type) }
  end
  
  def send_to_dlq(message_body, error_message)
    Rails.logger.error "💀 Sending message to DLQ: #{error_message}"
    
    # Enviar para DLQ do SQS
    SqsDlqWorker.perform_async(message_body, error_message)
  end
  
  # Métodos auxiliares
  def send_order_confirmation(order)
    EmailWorker.perform_async('order_confirmation', order.customer_email, {
      order_id: order.id,
      customer_name: order.customer_name,
      total_amount: order.total_amount
    })
  end
  
  def notify_kitchen(order)
    OrderNotificationsChannel.broadcast_new_order(order)
  end
  
  def update_inventory(order)
    order.order_items.each do |item|
      # Atualizar estoque
      # item.product.update!(stock: item.product.stock - item.quantity)
    end
  end
  
  def send_status_notification(order, status)
    NotificationWorker.perform_async('order_status_update', order.user_id, {
      order_id: order.id,
      status: status,
      message: "Seu pedido está #{status.humanize.downcase}"
    })
  end
  
  def notify_delivery(order)
    # Notificar entregador
    DeliveryWorker.perform_async(order.id)
  end
  
  def send_delivery_confirmation(order)
    EmailWorker.perform_async('order_delivered', order.customer_email, {
      order_id: order.id,
      delivery_time: Time.current
    })
  end
  
  def process_cancellation(order)
    # Processar cancelamento
    revert_inventory(order)
    process_refund(order, {})
  end
  
  def revert_inventory(order)
    order.order_items.each do |item|
      # Reverter estoque
      # item.product.update!(stock: item.product.stock + item.quantity)
    end
  end
  
  def process_refund(order, refund_data)
    # Processar reembolso
    Rails.logger.info "💰 Processing refund for order: #{order.id}"
  end
  
  def send_payment_confirmation(order)
    EmailWorker.perform_async('payment_confirmation', order.customer_email, {
      order_id: order.id,
      amount: order.total_amount
    })
  end
  
  def send_payment_failure_notification(order, error)
    EmailWorker.perform_async('payment_failure', order.customer_email, {
      order_id: order.id,
      error: error
    })
  end
  
  def send_cancellation_notification(order)
    EmailWorker.perform_async('order_cancelled', order.customer_email, {
      order_id: order.id,
      reason: 'Cancelled by system'
    })
  end
end
