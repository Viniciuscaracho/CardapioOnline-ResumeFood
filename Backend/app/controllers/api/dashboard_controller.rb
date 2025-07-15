class Api::DashboardController < ApplicationController
  skip_before_action :verify_authenticity_token
  
  def stats
    # Calcular receita total
    total_revenue = Order.where(status: ['confirmed', 'delivered']).sum(:total_amount)
    
    # Contar usuários ativos (simulado por enquanto)
    active_users = User.count
    
    # Buscar pedidos recentes
    recent_orders = Order.order(created_at: :desc).limit(4).map do |order|
      {
        id: order.id,
        customer: order.customer_name,
        amount: order.total_amount.to_f, # Converter para float
        status: translate_status(order.status),
        date: order.created_at.strftime('%Y-%m-%d')
      }
    end

    render json: {
      stats: {
        total_products: Product.count,
        total_orders: Order.count,
        total_revenue: total_revenue.to_f, # Converter para float
        active_users: active_users
      },
      recent_orders: recent_orders
    }
  end

  private

  def translate_status(status)
    case status
    when 'pending'
      'Pendente'
    when 'confirmed'
      'Confirmado'
    when 'preparing'
      'Em preparo'
    when 'ready'
      'Pronto'
    when 'delivered'
      'Entregue'
    else
      status
    end
  end
end 