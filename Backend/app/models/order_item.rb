class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :product
  
  # Validações básicas
  validates :quantity, presence: true, numericality: { greater_than: 0 }
  validates :unit_price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  
  # Campos: product_id, order_id, quantity, unit_price
end 