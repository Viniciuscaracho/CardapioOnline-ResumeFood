# AWS X-Ray configuration for distributed tracing
if Rails.env.production?
  require 'aws-xray-sdk'
  
  # Configure X-Ray
  XRay.recorder.configure(
    service: 'cheiro-verde-api',
    daemon_address: ENV['XRAY_DAEMON_ADDRESS'] || '127.0.0.1:2000',
    sampling: {
      rules: [
        {
          description: 'Default sampling rule',
          service_name: 'cheiro-verde-api',
          http_method: '*',
          url_path: '*',
          fixed_target: 1,
          rate: 0.1
        }
      ]
    }
  )
  
  # Add X-Ray middleware
  Rails.application.config.middleware.use XRay::Rack::Middleware
  
  # Configure X-Ray for HTTP requests
  XRay.recorder.configure(
    service: 'cheiro-verde-api',
    daemon_address: ENV['XRAY_DAEMON_ADDRESS'] || '127.0.0.1:2000'
  )
  
  # Patch HTTP client for external API calls
  require 'aws-xray-sdk/patches/net_http'
  require 'aws-xray-sdk/patches/aws_sdk'
  
  Rails.logger.info "AWS X-Ray tracing enabled for service: cheiro-verde-api"
else
  Rails.logger.info "AWS X-Ray tracing disabled in #{Rails.env} environment"
end
