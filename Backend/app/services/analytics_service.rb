class AnalyticsService
  include Sidekiq::Worker
  
  # Event types constants
  EVENT_TYPES = {
    page_view: 'page_view',
    click: 'click',
    conversion: 'conversion',
    user_action: 'user_action',
    api_call: 'api_call',
    error: 'error',
    performance: 'performance'
  }.freeze
  
  # Event names constants
  EVENT_NAMES = {
    # Page views
    home_page: 'home_page',
    product_page: 'product_page',
    cart_page: 'cart_page',
    checkout_page: 'checkout_page',
    admin_dashboard: 'admin_dashboard',
    
    # Clicks
    add_to_cart: 'add_to_cart',
    remove_from_cart: 'remove_from_cart',
    checkout_button: 'checkout_button',
    product_click: 'product_click',
    category_click: 'category_click',
    
    # Conversions
    order_created: 'order_created',
    order_completed: 'order_completed',
    user_registered: 'user_registered',
    user_logged_in: 'user_logged_in',
    
    # User actions
    search: 'search',
    filter_products: 'filter_products',
    sort_products: 'sort_products',
    
    # API calls
    api_request: 'api_request',
    api_response: 'api_response',
    
    # Errors
    validation_error: 'validation_error',
    server_error: 'server_error',
    not_found_error: 'not_found_error'
  }.freeze
  
  def self.track_event(event_type, event_name, properties = {}, options = {})
    # Extract request information if available
    request_info = extract_request_info(options[:request])
    
    # Create analytics event
    analytics_event = AnalyticsEvent.track_event(
      event_type,
      event_name,
      properties,
      {
        user_id: options[:user_id] || request_info[:user_id],
        session_id: options[:session_id] || request_info[:session_id],
        ip_address: options[:ip_address] || request_info[:ip_address],
        user_agent: options[:user_agent] || request_info[:user_agent],
        page_url: options[:page_url] || request_info[:page_url],
        referrer: options[:referrer] || request_info[:referrer],
        latitude: options[:latitude],
        longitude: options[:longitude],
        device_type: options[:device_type] || request_info[:device_type],
        browser: options[:browser] || request_info[:browser],
        os: options[:os] || request_info[:os],
        country: options[:country],
        city: options[:city]
      }
    )
    
    # Send to Kinesis asynchronously
    send_to_kinesis_async(analytics_event) if Rails.env.production?
    
    analytics_event
  end
  
  def self.track_page_view(page_name, properties = {}, options = {})
    track_event(
      EVENT_TYPES[:page_view],
      page_name,
      properties.merge(
        timestamp: Time.current.iso8601,
        page_title: options[:page_title],
        page_path: options[:page_path]
      ),
      options
    )
  end
  
  def self.track_click(element_name, properties = {}, options = {})
    track_event(
      EVENT_TYPES[:click],
      element_name,
      properties.merge(
        timestamp: Time.current.iso8601,
        element_id: options[:element_id],
        element_class: options[:element_class],
        element_text: options[:element_text]
      ),
      options
    )
  end
  
  def self.track_conversion(conversion_name, properties = {}, options = {})
    track_event(
      EVENT_TYPES[:conversion],
      conversion_name,
      properties.merge(
        timestamp: Time.current.iso8601,
        conversion_value: options[:conversion_value],
        currency: options[:currency] || 'BRL'
      ),
      options
    )
  end
  
  def self.track_user_action(action_name, properties = {}, options = {})
    track_event(
      EVENT_TYPES[:user_action],
      action_name,
      properties.merge(
        timestamp: Time.current.iso8601
      ),
      options
    )
  end
  
  def self.track_api_call(endpoint, method, properties = {}, options = {})
    track_event(
      EVENT_TYPES[:api_call],
      'api_request',
      properties.merge(
        timestamp: Time.current.iso8601,
        endpoint: endpoint,
        method: method,
        response_time: options[:response_time],
        status_code: options[:status_code]
      ),
      options
    )
  end
  
  def self.track_error(error_name, properties = {}, options = {})
    track_event(
      EVENT_TYPES[:error],
      error_name,
      properties.merge(
        timestamp: Time.current.iso8601,
        error_message: options[:error_message],
        error_class: options[:error_class],
        stack_trace: options[:stack_trace]
      ),
      options
    )
  end
  
  private
  
  def self.extract_request_info(request)
    return {} unless request
    
    {
      user_id: request.env['warden']&.user&.id,
      session_id: request.session.id,
      ip_address: request.remote_ip,
      user_agent: request.user_agent,
      page_url: request.url,
      referrer: request.referer,
      device_type: detect_device_type(request.user_agent),
      browser: detect_browser(request.user_agent),
      os: detect_os(request.user_agent)
    }
  end
  
  def self.detect_device_type(user_agent)
    return 'mobile' if user_agent&.match?(/Mobile|Android|iPhone|iPad/)
    return 'tablet' if user_agent&.match?(/iPad|Tablet/)
    'desktop'
  end
  
  def self.detect_browser(user_agent)
    return 'Chrome' if user_agent&.match?(/Chrome/)
    return 'Firefox' if user_agent&.match?(/Firefox/)
    return 'Safari' if user_agent&.match?(/Safari/)
    return 'Edge' if user_agent&.match?(/Edge/)
    'Unknown'
  end
  
  def self.detect_os(user_agent)
    return 'Windows' if user_agent&.match?(/Windows/)
    return 'macOS' if user_agent&.match?(/Mac OS X/)
    return 'Linux' if user_agent&.match?(/Linux/)
    return 'Android' if user_agent&.match?(/Android/)
    return 'iOS' if user_agent&.match?(/iPhone|iPad/)
    'Unknown'
  end
  
  def self.send_to_kinesis_async(analytics_event)
    # Queue job to send to Kinesis
    KinesisAnalyticsWorker.perform_async(analytics_event.id)
  end
end
