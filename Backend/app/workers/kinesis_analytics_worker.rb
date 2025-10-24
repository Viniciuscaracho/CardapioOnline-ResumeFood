class KinesisAnalyticsWorker
  include Sidekiq::Worker
  
  sidekiq_options queue: :analytics, retry: 3
  
  def perform(analytics_event_id)
    analytics_event = AnalyticsEvent.find(analytics_event_id)
    
    # Prepare data for Kinesis
    kinesis_data = {
      event_id: analytics_event.id,
      event_type: analytics_event.event_type,
      event_name: analytics_event.event_name,
      user_id: analytics_event.user_id,
      session_id: analytics_event.session_id,
      properties: analytics_event.parsed_properties,
      ip_address: analytics_event.ip_address,
      user_agent: analytics_event.user_agent,
      page_url: analytics_event.page_url,
      referrer: analytics_event.referrer,
      latitude: analytics_event.latitude,
      longitude: analytics_event.longitude,
      device_type: analytics_event.device_type,
      browser: analytics_event.browser,
      os: analytics_event.os,
      country: analytics_event.country,
      city: analytics_event.city,
      timestamp: analytics_event.created_at.iso8601,
      environment: Rails.env
    }
    
    # Send to Kinesis
    send_to_kinesis(kinesis_data)
    
  rescue => e
    Rails.logger.error "Failed to send analytics event to Kinesis: #{e.message}"
    raise e
  end
  
  private
  
  def send_to_kinesis(data)
    return unless Rails.env.production?
    
    # Configure AWS Kinesis client
    kinesis_client = Aws::Kinesis::Client.new(
      region: ENV['AWS_REGION'] || 'us-east-1',
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
    )
    
    stream_name = ENV['KINESIS_STREAM_NAME'] || 'analytics-events'
    
    # Send record to Kinesis
    kinesis_client.put_record(
      stream_name: stream_name,
      data: data.to_json,
      partition_key: data[:session_id] || SecureRandom.uuid
    )
    
    Rails.logger.info "Analytics event sent to Kinesis: #{data[:event_id]}"
    
  rescue Aws::Kinesis::Errors::ServiceError => e
    Rails.logger.error "Kinesis service error: #{e.message}"
    raise e
  rescue => e
    Rails.logger.error "Unexpected error sending to Kinesis: #{e.message}"
    raise e
  end
end
