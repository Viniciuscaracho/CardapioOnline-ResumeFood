import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotifications } from '../contexts/NotificationContext'
import { XCircle, Bell, List } from 'lucide-react'

export default function NotificationModal({ order, onConfirm, onCancel, onClose }) {
  const { timer, closeModal, notifyOrderStatusChange } = useNotifications()
  const [showItems, setShowItems] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  if (!order) return null

  // Função para atualizar status se não vier handler externo
  const handleStatus = async (status, handler) => {
    if (handler) return handler()
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: { status } })
      })
      if (!response.ok) throw new Error('Erro ao atualizar pedido')
      closeModal()
      if (notifyOrderStatusChange) notifyOrderStatusChange()
    } catch (err) {
      setError('Erro ao atualizar pedido')
      closeModal() // Garante que o modal fecha mesmo em caso de erro
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          onClick={onClose || closeModal}
          aria-label="Fechar"
        >
          <XCircle size={28} />
        </button>
        <div className="flex flex-col items-center gap-4">
          <Bell className="text-green-600" size={48} />
          <h2 className="text-2xl font-bold text-gray-800">Novo Pedido Recebido!</h2>
          <div className="absolute top-4 left-4 text-xs text-gray-500 font-bold">{timer}s</div>
          <p className="text-gray-600 text-center">
            Um novo pedido foi realizado. Confira os detalhes abaixo:
          </p>
          <div className="w-full text-left mt-2 mb-2">
            <div className="font-semibold text-gray-700">Cliente: <span className="font-normal">{order.customer_name}</span></div>
            {order.address && <div className="text-gray-500 text-sm">Endereço: {order.address}</div>}
            <div className="text-gray-500 text-sm">Telefone: {order.customer_phone}</div>
            <div className="text-gray-500 text-sm">Total: <span className="font-bold text-green-700">R$ {order.total_amount.toFixed(2)}</span></div>
          </div>
          {/* Botão para mostrar/esconder itens do pedido */}
          <button
            className="flex items-center gap-2 text-sm text-blue-700 hover:underline focus:outline-none mb-2"
            onClick={() => setShowItems((v) => !v)}
          >
            <List size={18} /> {showItems ? 'Ocultar Itens' : 'Ver Itens'}
          </button>
          {showItems && (
            <div className="w-full bg-gray-50 rounded-lg p-3 mb-2 border">
              <div className="font-semibold mb-1 text-gray-700">Itens do Pedido</div>
              <ul className="space-y-1">
                {order.order_items.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span>R$ {parseFloat(item.unit_price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Observações, se houver */}
          {order.notes && (
            <div className="w-full bg-yellow-50 rounded-lg p-3 mb-2 border border-yellow-200">
              <div className="font-semibold text-yellow-800">Observações</div>
              <div className="text-yellow-900 text-sm">{order.notes}</div>
            </div>
          )}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex gap-4 mt-4 w-full">
            <button
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition disabled:opacity-60"
              onClick={() => handleStatus('confirmed', onConfirm)}
              disabled={loading}
            >Confirmar</button>
            <button
              className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition disabled:opacity-60"
              onClick={() => handleStatus('cancelled', onCancel)}
              disabled={loading}
            >Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  )
} 