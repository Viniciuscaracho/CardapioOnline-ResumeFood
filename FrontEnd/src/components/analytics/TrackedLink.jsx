import React from 'react';
import { useClickTracking } from '../../hooks/useAnalytics';

const TrackedLink = ({ 
  children, 
  href, 
  elementName, 
  properties = {}, 
  className = '',
  ...props 
}) => {
  const handleClick = useClickTracking(elementName, properties);

  const handleLinkClick = (event) => {
    // Track the click
    handleClick(event);
  };

  return (
    <a 
      href={href}
      className={className}
      onClick={handleLinkClick}
      {...props}
    >
      {children}
    </a>
  );
};

export default TrackedLink;
