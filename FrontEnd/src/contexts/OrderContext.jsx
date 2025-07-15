import { createContext, useContext, useState, useEffect } from 'react'

const OrderContext = createContext()

const API_BASE_URL = 'http://localhost:3000/api'

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Carregar pedidos do backend quando o componente montar
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/orders`)
      if (!response.ok) {
        throw new Error('Erro ao carregar pedidos')
      }
      const data = await response.json()
      // A API retorna { orders: [...], pagination: {...} }
      const ordersArray = data.orders || data
      setOrders(Array.isArray(ordersArray) ? ordersArray : [])
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createOrder = async (cart, customerInfo = {}) => {
    try {
      console.log('=== DEBUG: Iniciando criação de pedido ===')
      console.log('Cart:', cart)
      console.log('Cart length:', cart.length)
      console.log('CustomerInfo:', customerInfo)
      
      // Verificar se o carrinho não está vazio
      if (!cart || cart.length === 0) {
        throw new Error('Carrinho vazio! Adicione produtos antes de finalizar o pedido.')
      }
      
      // Fazer uma cópia do carrinho para evitar modificações
      const cartCopy = [...cart]
      console.log('Cart copy:', cartCopy)
      console.log('Cart copy length:', cartCopy.length)
      
      // Verificar se cada item tem os campos necessários
      cartCopy.forEach((item, index) => {
        console.log(`Item ${index}:`, item)
        if (!item.id) {
          throw new Error(`Item ${index} não tem ID`)
        }
        if (!item.quantity || item.quantity <= 0) {
          throw new Error(`Item ${index} tem quantidade inválida: ${item.quantity}`)
        }
      })
      
      // Preparar dados do pedido para a API
      const orderData = {
        order: {
          customer_name: customerInfo.name || 'Cliente',
          customer_phone: customerInfo.phone || '',
          customer_email: customerInfo.email || '',
          address: customerInfo.address || '',
          notes: customerInfo.notes || '',
          status: 'pending'
        },
        order_items: cartCopy.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      }

      console.log('Enviando dados do pedido:', orderData)
      console.log('URL da API:', `${API_BASE_URL}/orders`)

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        console.log('Response not ok, tentando ler erro...')
        let errorText = ''
        try {
          const errorData = await response.json()
          console.error('Erro da API (JSON):', errorData)
          errorText = errorData.errors?.join(', ') || 'Erro ao criar pedido'
        } catch (parseError) {
          console.error('Erro ao fazer parse do erro:', parseError)
          errorText = await response.text()
          console.error('Erro da API (texto):', errorText)
        }
        throw new Error(errorText)
      }

      const newOrder = await response.json()
      console.log('Pedido criado com sucesso:', newOrder)
      
      // Atualizar o estado local com o novo pedido
      setOrders(prevOrders => {
        // Garantir que prevOrders seja sempre um array
        const currentOrders = Array.isArray(prevOrders) ? prevOrders : []
        return [newOrder, ...currentOrders]
      })
      
      return newOrder
    } catch (err) {
      console.error('Erro ao criar pedido:', err)
      throw err
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: { status: newStatus }
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar status do pedido')
      }

      const updatedOrder = await response.json()
      
      // Atualizar o estado local
      setOrders(prevOrders => {
        const currentOrders = Array.isArray(prevOrders) ? prevOrders : []
        return currentOrders.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      })

      return updatedOrder
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      throw err
    }
  }

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status)
  }

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId)
  }

  const refreshOrders = () => {
    fetchOrders()
  }

  const value = {
    orders,
    loading,
    error,
    createOrder,
    updateOrderStatus,
    getOrdersByStatus,
    getOrderById,
    refreshOrders
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
} 