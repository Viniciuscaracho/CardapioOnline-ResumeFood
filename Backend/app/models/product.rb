class Product < ApplicationRecord
  # Campos esperados: name, description, price, category, image_url, available (boolean)
  has_many :order_items
  has_one_attached :image

  def image_url
    return nil unless image.attached?
    begin
      Rails.application.routes.url_helpers.url_for(image)
    rescue
      nil
    end
  end

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :category, presence: true
  validates :available, inclusion: { in: [true, false] }
end 