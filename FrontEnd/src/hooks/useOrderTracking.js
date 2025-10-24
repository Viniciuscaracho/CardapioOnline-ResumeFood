import { useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

export const useOrderTracking = () => {
  const { trackConversion, trackEvent } = useAnalytics();

  const trackOrderCreated = useCallback((order) => {
    trackConversion('order_created', {
      order_id: order.id,
      order_value: order.total_amount,
      currency: 'BRL',
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_email: order.customer_email,
      items_count: order.order_items?.length || 0,
      items: order.order_items?.map(item => ({
        product_id: item.product_id,
        product_name: item.product?.name,
        quantity: item.quantity,
        unit_price: item.unit_price
      }))
    });
  }, [trackConversion]);

  const trackOrderCompleted = useCallback((order) => {
    trackConversion('order_completed', {
      order_id: order.id,
      order_value: order.total_amount,
      currency: 'BRL',
      customer_name: order.customer_name,
      items_count: order.order_items?.length || 0
    });
  }, [trackConversion]);

  const trackAddToCart = useCallback((product, quantity = 1) => {
    trackEvent('click', 'add_to_cart', {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      product_category: product.category,
      quantity: quantity,
      cart_value: product.price * quantity
    });
  }, [trackEvent]);

  const trackRemoveFromCart = useCallback((product, quantity = 1) => {
    trackEvent('click', 'remove_from_cart', {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      product_category: product.category,
      quantity: quantity
    });
  }, [trackEvent]);

  const trackCheckoutStarted = useCallback((cartItems, totalValue) => {
    trackEvent('conversion', 'checkout_started', {
      items_count: cartItems.length,
      total_value: totalValue,
      currency: 'BRL',
      items: cartItems.map(item => ({
        product_id: item.product_id,
        product_name: item.product?.name,
        quantity: item.quantity,
        unit_price: item.unit_price
      }))
    });
  }, [trackEvent]);

  const trackCheckoutCompleted = useCallback((order) => {
    trackConversion('checkout_completed', {
      order_id: order.id,
      order_value: order.total_amount,
      currency: 'BRL',
      items_count: order.order_items?.length || 0
    });
  }, [trackConversion]);

  const trackSearch = useCallback((searchTerm, resultsCount) => {
    trackEvent('user_action', 'search', {
      search_term: searchTerm,
      results_count: resultsCount,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackFilter = useCallback((filterType, filterValue) => {
    trackEvent('user_action', 'filter_products', {
      filter_type: filterType,
      filter_value: filterValue,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackSort = useCallback((sortBy, sortOrder) => {
    trackEvent('user_action', 'sort_products', {
      sort_by: sortBy,
      sort_order: sortOrder,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  return {
    trackOrderCreated,
    trackOrderCompleted,
    trackAddToCart,
    trackRemoveFromCart,
    trackCheckoutStarted,
    trackCheckoutCompleted,
    trackSearch,
    trackFilter,
    trackSort
  };
};
