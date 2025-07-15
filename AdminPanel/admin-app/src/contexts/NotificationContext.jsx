import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

const NotificationContext = createContext()

export function useNotifications() {
  return useContext(NotificationContext)
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [modalOrder, setModalOrder] = useState(null)
  const [timer, setTimer] = useState(0)
  const timerRef = useRef(null)
  const lastOrderIdRef = useRef(null)
  const [onOrderStatusChange, setOnOrderStatusChange] = useState(null)

  // Polling para detectar novos pedidos
  useEffect(() => {
    let isMounted = true
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/orders')
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          const latest = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
          if (lastOrderIdRef.current !== latest.id && latest.status === 'pending') {
            lastOrderIdRef.current = latest.id
            addNotification({ type: 'new_order', order: latest })
          }
        }
      } catch {}
    }
    const interval = setInterval(fetchOrders, 5000)
    return () => { isMounted = false; clearInterval(interval) }
  }, [])

  // Timer para o modal
  useEffect(() => {
    if (modalOrder) {
      setTimer(40)
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            closeModal()
            return 0
          }
          return t - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [modalOrder])

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev])
    if (notification.type === 'new_order') {
      setModalOrder(notification.order)
    }
  }

  const closeModal = () => setModalOrder(null)

  // Função para ser chamada pelo modal global ao alterar status
  const notifyOrderStatusChange = () => {
    if (onOrderStatusChange) onOrderStatusChange()
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, modalOrder, closeModal, timer, setOnOrderStatusChange, notifyOrderStatusChange }}>
      {children}
    </NotificationContext.Provider>
  )
} 