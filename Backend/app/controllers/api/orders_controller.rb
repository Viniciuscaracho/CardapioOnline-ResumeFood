module Api
  class OrdersController < ApplicationController
    before_action :set_order, only: [:show, :update, :destroy]

    def index
      orders = Order.includes(:order_items).order(created_at: :desc)
      
      # Apply search filter if provided
      if params[:search].present?
        search_term = params[:search].strip
        orders = apply_search_filter(orders, search_term)
      end
      
      # Apply status filter if provided
      if params[:status].present? && params[:status] != 'all'
        orders = orders.where(status: params[:status])
      end
      
      render json: orders.as_json(
        include: {
          order_items: {
            include: {
              product: { only: [:id, :name, :price] }
            }
          }
        },
        methods: [:total_amount]
      )
    end

    def show
      render json: @order.as_json(
        include: {
          order_items: {
            include: {
              product: { only: [:id, :name, :price] }
            }
          }
        },
        methods: [:total_amount]
      )
    end

    def create
      # Processar order_items se enviado diretamente
      if params[:order_items].present?
        order_data = order_params.to_h
        order_items_data = params[:order_items]
        
        @order = Order.new(order_data)
        
        # Criar order_items manualmente
        order_items_data.each do |item_data|
          product = Product.find(item_data[:product_id])
          @order.order_items.build(
            product: product,
            quantity: item_data[:quantity],
            unit_price: product.price
          )
        end
      else
        @order = Order.new(order_params)
      end
      
      if @order.save
        # Broadcast notification for new order
        Rails.logger.info "🔔 [ActionCable] Broadcasting new order: #{@order.id}"
        Rails.logger.info "🔔 [ActionCable] Order details: #{@order.customer_name} - #{@order.customer_phone}"
        Rails.logger.info "🔔 [ActionCable] Order items count: #{@order.order_items.count}"
        Rails.logger.info "🔔 [ActionCable] ActionCable.server available: #{ActionCable.server.present?}"
        Rails.logger.info "🔔 [ActionCable] ActionCable.server class: #{ActionCable.server.class}"
        
        begin
          OrderNotificationsChannel.broadcast_new_order(@order)
          Rails.logger.info "🔔 [ActionCable] Broadcast method called successfully"
        rescue => e
          Rails.logger.error "❌ [ActionCable] Error in broadcast: #{e.message}"
          Rails.logger.error "❌ [ActionCable] Error backtrace: #{e.backtrace.first(5).join(', ')}"
        end
        
        render json: @order.as_json(
          include: {
            order_items: {
              include: :product
            }
          }
        ), status: :created
      else
        render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @order.update(order_params)
        # Broadcast notification for status update
        Rails.logger.info "[ActionCable] Broadcasting status update: #{@order.id}"
        OrderNotificationsChannel.broadcast_status_update(@order)
        
        render json: @order.as_json(
          include: {
            order_items: {
              include: {
                product: { only: [:id, :name, :price] }
              }
            }
          },
          methods: [:total_amount]
        )
      else
        render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @order.destroy
      head :no_content
    end

    def search
      email = params[:email]
      phone = params[:phone]
      
      if email.present?
        orders = Order.includes(:order_items)
                      .where("customer_email ILIKE ?", "%#{email}%")
                      .order(created_at: :desc)
      elsif phone.present?
        orders = Order.includes(:order_items)
                      .where("customer_phone ILIKE ?", "%#{phone}%")
                      .order(created_at: :desc)
      else
        orders = []
      end
      
      render json: orders.as_json(
        include: {
          order_items: {
            include: {
              product: { only: [:id, :name, :price] }
            }
          }
        },
        methods: [:total_amount]
      )
    end

    private

    def set_order
      @order = Order.includes(:order_items).find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Pedido não encontrado' }, status: :not_found
    end

    def order_params
      params.require(:order).permit(
        :customer_name, 
        :customer_phone, 
        :customer_email, 
        :customer_cpf,
        :address, 
        :notes, 
        :status,
        order_items_attributes: [:product_id, :quantity, :unit_price, :_destroy]
      )
    end

    def apply_search_filter(orders, search_term)
      # Normalize search term (remove spaces, dashes, parentheses)
      normalized_search = normalize_phone_number(search_term)
      
      # Check if search term looks like a phone number
      if phone_number?(search_term)
        # Search by normalized phone number
        normalized_phone_conditions = []
        normalized_phone_conditions << "REPLACE(REPLACE(REPLACE(REPLACE(customer_phone, ' ', ''), '-', ''), '(', ''), ')', '') ILIKE ?"
        normalized_phone_conditions << "%#{normalized_search}%"
        
        orders = orders.where(normalized_phone_conditions.join(' '), *normalized_phone_conditions[1..-1])
      else
        # Search by customer name, email, or order ID
        orders = orders.where(
          "customer_name ILIKE ? OR customer_email ILIKE ? OR CAST(id AS TEXT) = ?",
          "%#{search_term}%",
          "%#{search_term}%",
          search_term
        )
      end
      
      orders
    end

    def normalize_phone_number(phone)
      # Remove spaces, dashes, parentheses, and other common phone number formatting
      phone.gsub(/[\s\-\(\)]/, '')
    end

    def phone_number?(term)
      # Check if the term contains mostly digits and common phone number characters
      digits_only = term.gsub(/[\s\-\(\)]/, '')
      digits_only.length >= 8 && digits_only.match?(/^\d+$/)
    end
  end
end 