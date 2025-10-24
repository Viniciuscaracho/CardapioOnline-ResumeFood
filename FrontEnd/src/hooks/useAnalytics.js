import { useCallback, useEffect, useRef } from 'react';

// Analytics service for tracking user interactions
class AnalyticsService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    this.sessionId = this.generateSessionId();
    this.userId = null;
    this.isEnabled = true;
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  setUserId(userId) {
    this.userId = userId;
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  async trackEvent(eventType, eventName, properties = {}) {
    if (!this.isEnabled) return;

    try {
      const payload = {
        event_type: eventType,
        event_name: eventName,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          path: window.location.pathname,
          referrer: document.referrer,
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        user_id: this.userId,
        session_id: this.sessionId,
        page_url: window.location.href,
        referrer: document.referrer,
        device_type: this.detectDeviceType(),
        browser: this.detectBrowser(),
        os: this.detectOS()
      };

      const response = await fetch(`${this.baseUrl}/api/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn('Analytics tracking failed:', response.statusText);
      }
    } catch (error) {
      console.warn('Analytics tracking error:', error);
    }
  }

  async trackPageView(pageName, properties = {}) {
    if (!this.isEnabled) return;

    try {
      const payload = {
        page_name: pageName,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          path: window.location.pathname,
          title: document.title,
          referrer: document.referrer
        },
        user_id: this.userId,
        session_id: this.sessionId,
        page_title: document.title,
        page_path: window.location.pathname,
        page_url: window.location.href,
        referrer: document.referrer
      };

      const response = await fetch(`${this.baseUrl}/api/analytics/page_view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn('Page view tracking failed:', response.statusText);
      }
    } catch (error) {
      console.warn('Page view tracking error:', error);
    }
  }

  async trackClick(elementName, properties = {}) {
    if (!this.isEnabled) return;

    try {
      const payload = {
        element_name: elementName,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          path: window.location.pathname
        },
        user_id: this.userId,
        session_id: this.sessionId,
        page_url: window.location.href
      };

      const response = await fetch(`${this.baseUrl}/api/analytics/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn('Click tracking failed:', response.statusText);
      }
    } catch (error) {
      console.warn('Click tracking error:', error);
    }
  }

  async trackConversion(conversionName, properties = {}) {
    if (!this.isEnabled) return;

    try {
      const payload = {
        conversion_name: conversionName,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          path: window.location.pathname
        },
        user_id: this.userId,
        session_id: this.sessionId,
        page_url: window.location.href
      };

      const response = await fetch(`${this.baseUrl}/api/analytics/conversion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn('Conversion tracking failed:', response.statusText);
      }
    } catch (error) {
      console.warn('Conversion tracking error:', error);
    }
  }

  detectDeviceType() {
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return 'mobile';
    }
    if (/iPad|Tablet/.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }

  detectBrowser() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  detectOS() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS X')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    return 'Unknown';
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

// Custom hook for analytics
export const useAnalytics = () => {
  const analyticsRef = useRef(analyticsService);

  const trackEvent = useCallback((eventType, eventName, properties = {}) => {
    analyticsRef.current.trackEvent(eventType, eventName, properties);
  }, []);

  const trackPageView = useCallback((pageName, properties = {}) => {
    analyticsRef.current.trackPageView(pageName, properties);
  }, []);

  const trackClick = useCallback((elementName, properties = {}) => {
    analyticsRef.current.trackClick(elementName, properties);
  }, []);

  const trackConversion = useCallback((conversionName, properties = {}) => {
    analyticsRef.current.trackConversion(conversionName, properties);
  }, []);

  const setUserId = useCallback((userId) => {
    analyticsRef.current.setUserId(userId);
  }, []);

  const setEnabled = useCallback((enabled) => {
    analyticsRef.current.setEnabled(enabled);
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackClick,
    trackConversion,
    setUserId,
    setEnabled
  };
};

// Higher-order component for automatic page view tracking
export const withAnalytics = (WrappedComponent, pageName) => {
  return function AnalyticsWrapper(props) {
    const { trackPageView } = useAnalytics();

    useEffect(() => {
      trackPageView(pageName);
    }, [trackPageView]);

    return <WrappedComponent {...props} />;
  };
};

// Hook for automatic click tracking
export const useClickTracking = (elementName, properties = {}) => {
  const { trackClick } = useAnalytics();

  const handleClick = useCallback((event) => {
    trackClick(elementName, {
      ...properties,
      element_id: event.target.id,
      element_class: event.target.className,
      element_text: event.target.textContent?.trim(),
      x: event.clientX,
      y: event.clientY
    });
  }, [trackClick, elementName, properties]);

  return handleClick;
};

export default analyticsService;
