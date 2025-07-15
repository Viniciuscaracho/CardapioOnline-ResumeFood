import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const getCartItemQuantity = (itemId) => {
    const cartItem = cart.find(item => item.id === itemId)
    return cartItem ? cartItem.quantity : 0
  }

  const cartTotal = cart.reduce((total, item) => {
    const price = parseFloat(item.price) || 0
    return total + (price * item.quantity)
  }, 0)
  
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0)

  const clearCart = () => {
    console.log('=== DEBUG: clearCart chamado ===')
    console.log('Cart antes de limpar:', cart)
    setCart([])
  }

  const openCartModal = () => {
    setIsCartModalOpen(true)
  }

  const closeCartModal = () => {
    setIsCartModalOpen(false)
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartItemQuantity,
    cartTotal,
    cartItemCount,
    clearCart,
    isCartModalOpen,
    openCartModal,
    closeCartModal
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 