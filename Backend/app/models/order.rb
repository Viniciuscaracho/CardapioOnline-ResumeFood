class Order < ApplicationRecord
  # Campos: customer_name, customer_phone, customer_email, address, notes, status, total_amount
  # Novos campos: confirmed_at, ready_at, out_for_delivery_at
  has_many :order_items, dependent: :destroy

  # Validações básicas
  validates :customer_name, presence: true
  validates :customer_phone, presence: true
  validates :customer_email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP, allow_blank: true }
  validates :status, inclusion: { in: %w[pending confirmed ready out_for_delivery delivering completed cancelled] }

  # Callback para atualizar timestamps quando o status mudar
  before_save :update_status_timestamps, if: :status_changed?

  def total_amount
    order_items.sum { |item| item.unit_price.to_f * item.quantity }
  end

  def update_total_amount!
    update!(total_amount: total_amount)
  end

  private

  def update_status_timestamps
    case status
    when 'confirmed'
      self.confirmed_at = Time.current
    when 'ready'
      self.ready_at = Time.current
    when 'out_for_delivery'
      self.out_for_delivery_at = Time.current
    when 'completed'
      self.completed_at = Time.current
    end
  end
end 