import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

const AnalyticsContext = createContext();

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [userId, setUserId] = useState(null);
  const analytics = useAnalytics();

  // Set up analytics when component mounts
  useEffect(() => {
    analytics.setEnabled(isEnabled);
    if (userId) {
      analytics.setUserId(userId);
    }
  }, [analytics, isEnabled, userId]);

  // Track page views automatically
  useEffect(() => {
    const handleRouteChange = () => {
      const pageName = window.location.pathname.replace('/', '') || 'home';
      analytics.trackPageView(pageName, {
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      });
    };

    // Track initial page view
    handleRouteChange();

    // Listen for route changes (for SPA)
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [analytics]);

  const value = {
    ...analytics,
    isEnabled,
    setIsEnabled,
    userId,
    setUserId
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
