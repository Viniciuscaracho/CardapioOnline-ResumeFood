import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotificationToast({ order, onClose }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!order) return
    const timer = setTimeout(onClose, 8000)
    return () => clearTimeout(timer)
  }, [order, onClose])

  if (!order) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in">
      <div>
        <div className="font-bold">Novo pedido recebido!</div>
        <div className="text-sm">Cliente: {order.customer_name}</div>
      </div>
      <button
        className="ml-4 bg-white text-green-700 px-3 py-1 rounded font-semibold hover:bg-gray-100 transition"
        onClick={() => { onClose(); navigate('/admin/orders') }}
      >Ver Pedido</button>
      <button
        className="ml-2 text-white/70 hover:text-white text-lg"
        onClick={onClose}
        aria-label="Fechar"
      >×</button>
    </div>
  )
} 