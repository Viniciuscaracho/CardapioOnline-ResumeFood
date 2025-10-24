class AnalyticsMiddleware
  def initialize(app)
    @app = app
  end
  
  def call(env)
    request = ActionDispatch::Request.new(env)
    
    # Start timing
    start_time = Time.current
    
    # Process request
    status, headers, response = @app.call(env)
    
    # Calculate response time
    response_time = ((Time.current - start_time) * 1000).round(2)
    
    # Track API calls
    if api_request?(request)
      track_api_request(request, status, response_time)
    end
    
    [status, headers, response]
  end
  
  private
  
  def api_request?(request)
    request.path.start_with?('/api/') && !request.path.include?('/analytics')
  end
  
  def track_api_request(request, status, response_time)
    # Extract user info if available
    user_id = extract_user_id(request)
    session_id = extract_session_id(request)
    
    # Track the API call
    AnalyticsService.track_api_call(
      request.path,
      request.method,
      {
        controller: extract_controller(request),
        action: extract_action(request),
        params: sanitize_params(request.params)
      },
      {
        user_id: user_id,
        session_id: session_id,
        ip_address: request.remote_ip,
        user_agent: request.user_agent,
        response_time: response_time,
        status_code: status
      }
    )
  rescue => e
    Rails.logger.error "Analytics middleware error: #{e.message}"
  end
  
  def extract_user_id(request)
    # Try to get user from session or JWT token
    if request.env['warden']&.user
      request.env['warden'].user.id
    elsif request.headers['Authorization']
      # Extract from JWT token if using JWT auth
      extract_user_from_jwt(request.headers['Authorization'])
    end
  end
  
  def extract_session_id(request)
    request.session.id
  end
  
  def extract_controller(request)
    request.path_parameters[:controller]
  end
  
  def extract_action(request)
    request.path_parameters[:action]
  end
  
  def extract_user_from_jwt(auth_header)
    # Implement JWT token parsing if needed
    # This is a placeholder - implement based on your JWT setup
    nil
  end
  
  def sanitize_params(params)
    # Remove sensitive information
    sanitized = params.except('password', 'password_confirmation', 'token', 'secret')
    
    # Limit size to prevent huge payloads
    if sanitized.to_json.size > 1000
      { 'params_size' => sanitized.to_json.size, 'truncated' => true }
    else
      sanitized
    end
  end
end
