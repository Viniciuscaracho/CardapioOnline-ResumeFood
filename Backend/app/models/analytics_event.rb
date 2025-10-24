class AnalyticsEvent < ApplicationRecord
  belongs_to :user, optional: true
  
  # Serialize properties as JSON
  serialize :properties, JSON
  
  # Validations
  validates :event_type, presence: true
  validates :event_name, presence: true
  validates :session_id, presence: true
  
  # Scopes
  scope :by_event_type, ->(type) { where(event_type: type) }
  scope :by_user, ->(user_id) { where(user_id: user_id) }
  scope :by_session, ->(session_id) { where(session_id: session_id) }
  scope :recent, ->(days = 30) { where(created_at: days.days.ago..Time.current) }
  scope :page_views, -> { where(event_type: 'page_view') }
  scope :clicks, -> { where(event_type: 'click') }
  scope :conversions, -> { where(event_type: 'conversion') }
  
  # Class methods
  def self.track_event(event_type, event_name, properties = {}, options = {})
    create!(
      event_type: event_type,
      event_name: event_name,
      properties: properties,
      user_id: options[:user_id],
      session_id: options[:session_id],
      ip_address: options[:ip_address],
      user_agent: options[:user_agent],
      page_url: options[:page_url],
      referrer: options[:referrer],
      latitude: options[:latitude],
      longitude: options[:longitude],
      device_type: options[:device_type],
      browser: options[:browser],
      os: options[:os],
      country: options[:country],
      city: options[:city]
    )
  end
  
  # Instance methods
  def parsed_properties
    properties.is_a?(String) ? JSON.parse(properties) : properties
  end
  
  def is_page_view?
    event_type == 'page_view'
  end
  
  def is_click?
    event_type == 'click'
  end
  
  def is_conversion?
    event_type == 'conversion'
  end
end
