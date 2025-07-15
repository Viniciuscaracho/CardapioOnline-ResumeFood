class Admin::OrdersController < AdminController
  before_action :set_order, only: [:show, :edit, :update, :destroy]

  def index
    @orders = Order.all.order(created_at: :desc)
  end

  def show
  end

  def edit
  end

  def update
    if @order.update(order_params)
      redirect_to admin_orders_path, notice: 'Pedido atualizado com sucesso!'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @order.destroy
    redirect_to admin_orders_path, notice: 'Pedido removido com sucesso!'
  end

  private

  def set_order
    @order = Order.find(params[:id])
  end

  def order_params
    params.require(:order).permit(:customer_name, :customer_phone, :customer_email, :address, :notes, :status, :total_amount)
  end
end 