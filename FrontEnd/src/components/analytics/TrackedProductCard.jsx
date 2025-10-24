import React from 'react';
import { useClickTracking } from '../../hooks/useAnalytics';

const TrackedProductCard = ({ 
  product, 
  children, 
  className = '',
  ...props 
}) => {
  const handleProductClick = useClickTracking('product_click', {
    product_id: product.id,
    product_name: product.name,
    product_price: product.price,
    product_category: product.category
  });

  const handleAddToCartClick = useClickTracking('add_to_cart', {
    product_id: product.id,
    product_name: product.name,
    product_price: product.price,
    product_category: product.category
  });

  return (
    <div 
      className={className}
      onClick={handleProductClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default TrackedProductCard;
