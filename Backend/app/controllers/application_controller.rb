class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session
  before_action :set_cors_headers

  def set_cors_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD'
    headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token'
  end

  def options
    head :ok
  end
end
