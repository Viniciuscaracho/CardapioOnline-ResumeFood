import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // Carregar carrinho do localStorage ao inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error)
        setCart([])
      }
    }
  }, [])

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item) => {
    setCart(prevCart => {
      // Criar ID único para itens com configurações personalizadas
      let itemId
      if (item.pizzaConfig) {
        // Para pizzas com configuração personalizada
        const flavorNames = item.pizzaConfig.flavors.map(f => f.name).sort()
        itemId = `${item.id}-${item.pizzaConfig.type}-${flavorNames.join('-')}`
      } else if (item.selectedFlavorNames) {
        // Para itens com sabores selecionados (compatibilidade)
        const flavorNames = item.selectedFlavorNames.sort()
        itemId = `${item.id}-${flavorNames.join('-')}`
      } else {
        // Para itens normais
        itemId = item.id
      }

      // Verificar se o item já existe no carrinho
      const existingItem = prevCart.find(cartItem => {
        if (item.pizzaConfig) {
          // Para pizzas com configuração personalizada
          if (cartItem.pizzaConfig) {
            const cartFlavorNames = cartItem.pizzaConfig.flavors.map(f => f.name).sort()
            const newFlavorNames = item.pizzaConfig.flavors.map(f => f.name).sort()
            return cartItem.id === item.id && 
                   cartItem.pizzaConfig.type === item.pizzaConfig.type &&
                   JSON.stringify(cartFlavorNames) === JSON.stringify(newFlavorNames)
          }
          return false
        } else if (item.selectedFlavorNames) {
          // Para itens com sabores selecionados (compatibilidade)
          if (cartItem.selectedFlavorNames) {
            const cartFlavorNames = cartItem.selectedFlavorNames.sort()
            const newFlavorNames = item.selectedFlavorNames.sort()
            return cartItem.id === item.id &&
                   JSON.stringify(cartFlavorNames) === JSON.stringify(newFlavorNames)
          }
          return false
        } else {
          // Para itens normais
          return cartItem.id === itemId
        }
      })

      if (existingItem) {
        // Atualizar quantidade do item existente
        return prevCart.map(cartItem => {
          if (item.pizzaConfig) {
            // Para pizzas com configuração personalizada
            if (cartItem.pizzaConfig) {
              const cartFlavorNames = cartItem.pizzaConfig.flavors.map(f => f.name).sort()
              const newFlavorNames = item.pizzaConfig.flavors.map(f => f.name).sort()
              if (cartItem.id === item.id && 
                  cartItem.pizzaConfig.type === item.pizzaConfig.type &&
                  JSON.stringify(cartFlavorNames) === JSON.stringify(newFlavorNames)) {
                return { ...cartItem, quantity: cartItem.quantity + 1 }
              }
            }
          } else if (item.selectedFlavorNames) {
            // Para itens com sabores selecionados (compatibilidade)
            if (cartItem.selectedFlavorNames) {
              const cartFlavorNames = cartItem.selectedFlavorNames.sort()
              const newFlavorNames = item.selectedFlavorNames.sort()
              if (cartItem.id === item.id &&
                  JSON.stringify(cartFlavorNames) === JSON.stringify(newFlavorNames)) {
                return { ...cartItem, quantity: cartItem.quantity + 1 }
              }
            }
          } else if (cartItem.id === itemId) {
            // Para itens normais
            return { ...cartItem, quantity: cartItem.quantity + 1 }
          }
          return cartItem
        })
      }

      // Adicionar novo item
      const newItem = {
        ...item,
        quantity: 1,
        uniqueId: itemId
      }
      return [...prevCart, newItem]
    })
  }

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => {
      const currentItemId = item.uniqueId || item.id
      return currentItemId !== itemId
    }))
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCart(prevCart => prevCart.map(item => {
      const currentItemId = item.uniqueId || item.id
      if (currentItemId === itemId) {
        return { ...item, quantity: newQuantity }
      }
      return item
    }))
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartItemQuantity = (itemId) => {
    const item = cart.find(item => {
      const currentItemId = item.uniqueId || item.id
      return currentItemId === itemId
    })
    return item ? item.quantity : 0
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price) || 0
      return total + (price * item.quantity)
    }, 0)
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemQuantity,
    getTotalItems,
    getTotalPrice
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