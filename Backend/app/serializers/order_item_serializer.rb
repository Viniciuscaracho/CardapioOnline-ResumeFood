class OrderItemSerializer < ActiveModel::Serializer
  attributes :id, :quantity, :unit_price, :product

  def product
    ProductSerializer.new(object.product).as_json
  end
end 