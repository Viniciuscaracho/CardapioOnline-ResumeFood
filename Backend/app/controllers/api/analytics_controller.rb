module Api
  class AnalyticsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :authenticate_user!, only: [:admin_stats]
    
    # Track frontend events
    def track
      event_type = params[:event_type]
      event_name = params[:event_name]
      properties = params[:properties] || {}
      
      # Extract additional info from request
      options = {
        user_id: current_user&.id,
        session_id: session.id,
        ip_address: request.remote_ip,
        user_agent: request.user_agent,
        page_url: params[:page_url],
        referrer: params[:referrer],
        latitude: params[:latitude]&.to_f,
        longitude: params[:longitude]&.to_f,
        device_type: params[:device_type],
        browser: params[:browser],
        os: params[:os],
        country: params[:country],
        city: params[:city]
      }
      
      # Track the event
      analytics_event = AnalyticsService.track_event(
        event_type,
        event_name,
        properties,
        options
      )
      
      render json: { 
        success: true, 
        event_id: analytics_event.id,
        message: 'Event tracked successfully' 
      }
    end
    
    # Track page views
    def track_page_view
      page_name = params[:page_name]
      properties = params[:properties] || {}
      
      options = {
        user_id: current_user&.id,
        session_id: session.id,
        ip_address: request.remote_ip,
        user_agent: request.user_agent,
        page_title: params[:page_title],
        page_path: params[:page_path],
        page_url: params[:page_url],
        referrer: params[:referrer]
      }
      
      analytics_event = AnalyticsService.track_page_view(
        page_name,
        properties,
        options
      )
      
      render json: { 
        success: true, 
        event_id: analytics_event.id,
        message: 'Page view tracked successfully' 
      }
    end
    
    # Track clicks
    def track_click
      element_name = params[:element_name]
      properties = params[:properties] || {}
      
      options = {
        user_id: current_user&.id,
        session_id: session.id,
        ip_address: request.remote_ip,
        user_agent: request.user_agent,
        element_id: params[:element_id],
        element_class: params[:element_class],
        element_text: params[:element_text],
        page_url: params[:page_url]
      }
      
      analytics_event = AnalyticsService.track_click(
        element_name,
        properties,
        options
      )
      
      render json: { 
        success: true, 
        event_id: analytics_event.id,
        message: 'Click tracked successfully' 
      }
    end
    
    # Track conversions
    def track_conversion
      conversion_name = params[:conversion_name]
      properties = params[:properties] || {}
      
      options = {
        user_id: current_user&.id,
        session_id: session.id,
        ip_address: request.remote_ip,
        user_agent: request.user_agent,
        conversion_value: params[:conversion_value]&.to_f,
        currency: params[:currency] || 'BRL',
        page_url: params[:page_url]
      }
      
      analytics_event = AnalyticsService.track_conversion(
        conversion_name,
        properties,
        options
      )
      
      render json: { 
        success: true, 
        event_id: analytics_event.id,
        message: 'Conversion tracked successfully' 
      }
    end
    
    # Get analytics stats (admin only)
    def admin_stats
      return render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user&.admin?
      
      days = params[:days]&.to_i || 30
      
      stats = {
        total_events: AnalyticsEvent.recent(days).count,
        page_views: AnalyticsEvent.page_views.recent(days).count,
        clicks: AnalyticsEvent.clicks.recent(days).count,
        conversions: AnalyticsEvent.conversions.recent(days).count,
        unique_users: AnalyticsEvent.recent(days).distinct.count(:user_id),
        unique_sessions: AnalyticsEvent.recent(days).distinct.count(:session_id),
        events_by_type: AnalyticsEvent.recent(days).group(:event_type).count,
        events_by_day: AnalyticsEvent.recent(days).group_by_day(:created_at).count,
        top_pages: AnalyticsEvent.page_views.recent(days).group(:event_name).count,
        top_clicked_elements: AnalyticsEvent.clicks.recent(days).group(:event_name).count,
        conversion_events: AnalyticsEvent.conversions.recent(days).group(:event_name).count
      }
      
      render json: stats
    end
    
    # Get user session events
    def session_events
      session_id = params[:session_id] || session.id
      limit = params[:limit]&.to_i || 100
      
      events = AnalyticsEvent.by_session(session_id)
                            .order(created_at: :desc)
                            .limit(limit)
      
      render json: events.as_json(
        only: [:id, :event_type, :event_name, :properties, :created_at]
      )
    end
    
    # Get user events (if authenticated)
    def user_events
      return render json: { error: 'Authentication required' }, status: :unauthorized unless current_user
      
      limit = params[:limit]&.to_i || 100
      
      events = AnalyticsEvent.by_user(current_user.id)
                            .order(created_at: :desc)
                            .limit(limit)
      
      render json: events.as_json(
        only: [:id, :event_type, :event_name, :properties, :created_at]
      )
    end
  end
end
