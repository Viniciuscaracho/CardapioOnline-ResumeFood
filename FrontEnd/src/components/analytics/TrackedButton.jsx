import React from 'react';
import { useClickTracking } from '../../hooks/useAnalytics';

const TrackedButton = ({ 
  children, 
  onClick, 
  elementName, 
  properties = {}, 
  className = '',
  ...props 
}) => {
  const handleClick = useClickTracking(elementName, properties);

  const handleButtonClick = (event) => {
    // Track the click
    handleClick(event);
    
    // Call original onClick if provided
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button 
      className={className}
      onClick={handleButtonClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default TrackedButton;
