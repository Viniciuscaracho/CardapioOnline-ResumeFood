class OrderNotificationsChannel < ApplicationCable::Channel
  def subscribed
    # Permitir que qualquer usuário se inscreva (clientes e admins)
    stream_from "order_notifications"
  end

  def unsubscribed
    # Cleanup quando o usuário desconectar
  end

  # Método para transmitir notificação de novo pedido
  def self.broadcast_new_order(order)
    Rails.logger.info "🔔 [ActionCable] broadcast_new_order called for order: #{order.id}"
    Rails.logger.info "🔔 [ActionCable] Order details: #{order.customer_name} - #{order.customer_phone}"
    Rails.logger.info "🔔 [ActionCable] Broadcasting to channel: order_notifications"
    Rails.logger.info "🔔 [ActionCable] ActionCable.server: #{ActionCable.server.inspect}"
    
    begin
      message = {
        type: "new_order",
        message: "Novo pedido recebido!",
        order: {
          id: order.id,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          customer_email: order.customer_email,
          address: order.address,
          total_amount: order.total_amount,
          created_at: order.created_at,
          status: order.status,
          order_items: order.order_items.map do |item|
            {
              id: item.id,
              product: {
                id: item.product.id,
                name: item.product.name,
                price: item.product.price
              },
              quantity: item.quantity,
              unit_price: item.unit_price,
              total_price: item.quantity * item.unit_price.to_f
            }
          end
        }
      }
      
      Rails.logger.info "🔔 [ActionCable] Message to broadcast: #{message.inspect}"
      
      ActionCable.server.broadcast("order_notifications", message)
      
      Rails.logger.info "✅ [ActionCable] Broadcast completed successfully"
    rescue => e
      Rails.logger.error "❌ [ActionCable] Broadcast failed: #{e.message}"
      Rails.logger.error "❌ [ActionCable] Error backtrace: #{e.backtrace.first(5).join(', ')}"
    end
  end

  # Método para transmitir atualização de status
  def self.broadcast_status_update(order)
    Rails.logger.info "[ActionCable] broadcast_status_update called for order: #{order.id}"
    ActionCable.server.broadcast(
      "order_notifications",
      {
        type: "order_status_update",
        message: "Status do pedido atualizado!",
        order: {
          id: order.id,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          customer_email: order.customer_email,
          address: order.address,
          total_amount: order.total_amount,
          created_at: order.created_at,
          status: order.status,
          order_items: order.order_items.map do |item|
            {
              id: item.id,
              product: {
                id: item.product.id,
                name: item.product.name,
                price: item.product.price
              },
              quantity: item.quantity,
              unit_price: item.unit_price
            }
          end
        },
        timestamp: Time.current.iso8601
      }
    )
  end
end
