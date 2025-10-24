class FailureLog < ApplicationRecord
  # Status possíveis
  STATUSES = %w[pending auto_recovery_attempted manual_intervention_required resolved].freeze
  
  # Validações
  validates :service, presence: true
  validates :message_body, presence: true
  validates :error_message, presence: true
  validates :occurred_at, presence: true
  validates :status, inclusion: { in: STATUSES }
  
  # Scopes
  scope :pending, -> { where(status: 'pending') }
  scope :resolved, -> { where(status: 'resolved') }
  scope :by_service, ->(service) { where(service: service) }
  scope :by_order, ->(order_id) { where(order_id: order_id) }
  scope :recent, ->(days = 7) { where(occurred_at: days.days.ago..Time.current) }
  
  # Métodos de instância
  def resolved?
    status == 'resolved'
  end
  
  def pending?
    status == 'pending'
  end
  
  def auto_recovery_attempted?
    status == 'auto_recovery_attempted'
  end
  
  def manual_intervention_required?
    status == 'manual_intervention_required'
  end
  
  def resolve!(resolution_notes = nil)
    update!(
      status: 'resolved',
      resolved_at: Time.current,
      resolution_notes: resolution_notes
    )
  end
  
  def attempt_auto_recovery
    update!(status: 'auto_recovery_attempted')
  end
  
  def require_manual_intervention
    update!(status: 'manual_intervention_required')
  end
  
  # Métodos de classe
  def self.failure_rate(service = nil, days = 7)
    scope = recent(days)
    scope = scope.by_service(service) if service
    
    total = scope.count
    return 0 if total == 0
    
    resolved = scope.resolved.count
    ((total - resolved).to_f / total * 100).round(2)
  end
  
  def self.top_failing_services(days = 7)
    recent(days)
      .group(:service)
      .group('status')
      .count
      .group_by { |k, v| k[0] }
      .transform_values { |v| v.to_h { |k, count| [k[1], count] } }
  end
  
  def self.auto_recoverable_failures
    where(status: 'pending')
      .where("error_message ILIKE ? OR error_message ILIKE ? OR error_message ILIKE ?", 
             '%Temporary network error%', 
             '%Rate limit exceeded%', 
             '%Service temporarily unavailable%')
  end
  
  def self.manual_intervention_required
    where(status: 'manual_intervention_required')
  end
  
  def self.cleanup_old_logs(days = 30)
    where('occurred_at < ?', days.days.ago)
      .where(status: 'resolved')
      .delete_all
  end
end
