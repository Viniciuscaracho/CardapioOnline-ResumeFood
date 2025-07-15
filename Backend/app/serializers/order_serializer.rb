class OrderSerializer < ActiveModel::Serializer
  attributes :id, :customer_name, :customer_phone, :customer_email, :address, :notes, :status, :created_at, :total_amount, :confirmed_at, :ready_at, :out_for_delivery_at
  has_many :order_items, serializer: OrderItemSerializer

  def total_amount
    object.total_amount.to_f
  end
end 