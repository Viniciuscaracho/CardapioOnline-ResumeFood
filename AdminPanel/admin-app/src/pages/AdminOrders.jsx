import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '../components/ui/card'
import { BadgeCheck, Clock, XCircle, Truck, CheckCircle, Eye } from 'lucide-react'
import NotificationModal from '../components/NotificationModal'
import { useNotifications } from '../contexts/NotificationContext'
import { useLocation } from 'react-router-dom'

const statusColors = {
  pending: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  delivering: 'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-700',
}

const statusLabels = {
  confirmed: 'Confirmado',
  pending: 'Pendente',
  cancelled: 'Cancelado',
  delivering: 'Entregando',
  completed: 'Finalizado',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)
  const { setOnOrderStatusChange } = useNotifications()
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const location = useLocation();

  // Função para buscar pedidos - agora declarada antes do useEffect
  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:3000/api/orders')
      if (!response.ok) throw new Error('Erro ao carregar pedidos')
      const data = await response.json()
      setOrders(data)
    } catch (err) {
      setError('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    setOnOrderStatusChange(() => fetchOrders)
    return () => setOnOrderStatusChange(null)
  }, [])

  useEffect(() => {
    fetchOrders();
  }, [location.pathname]);

  // Função para mostrar toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type }), 3000)
  }

  // Função para alterar status diretamente
  const updateOrderStatus = async (orderId, status) => {
    setUpdating(true)
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: { status } })
      })
      if (!response.ok) throw new Error('Erro ao atualizar pedido')
      fetchOrders()
      showToast('Status do pedido atualizado com sucesso!', 'success')
    } catch (err) {
      showToast('Erro ao atualizar pedido', 'error')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="text-center py-20">Carregando pedidos...</div>
  }
  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(order => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg">{order.customer_name}</span>
                <span className={`text-xs px-2 py-1 rounded ${statusColors[order.status]}`}>{statusLabels[order.status] || order.status}</span>
              </div>
              <div className="text-gray-500 mb-4">R$ {parseFloat(order.total_amount).toFixed(2)}</div>
              <div className="flex gap-2">
                <button className="p-2 rounded hover:bg-gray-100 relative group" onClick={() => setSelectedOrder(order)}>
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">Ver Detalhes</span>
                </button>
                <button
                  className="p-2 rounded hover:bg-gray-100 relative group"
                  onClick={() => updateOrderStatus(order.id, 'confirmed')}
                  disabled={updating}
                >
                  <BadgeCheck className="w-4 h-4 text-green-600" />
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">Confirmar</span>
                </button>
                <button
                  className="p-2 rounded hover:bg-gray-100 relative group"
                  onClick={() => updateOrderStatus(order.id, 'pending')}
                  disabled={updating}
                >
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">Pendente</span>
                </button>
                <button
                  className="p-2 rounded hover:bg-gray-100 relative group"
                  onClick={() => updateOrderStatus(order.id, 'delivering')}
                  disabled={updating}
                >
                  <Truck className="w-4 h-4 text-blue-700" />
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">Entregando</span>
                </button>
                <button
                  className="p-2 rounded hover:bg-gray-100 relative group"
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                  disabled={updating}
                >
                  <CheckCircle className="w-4 h-4 text-gray-700" />
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">Finalizar</span>
                </button>
                <button
                  className="p-2 rounded hover:bg-gray-100 relative group"
                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  disabled={updating}
                >
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">Cancelar</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Toast visual */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.message}
        </div>
      )}
      {/* Modal de detalhes do pedido - renderizado fora da grid */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition" onClick={() => setSelectedOrder(null)} aria-label="Fechar">
              <XCircle size={28} />
            </button>
            <h2 className="text-xl font-bold mb-2">Detalhes do Pedido</h2>
            <div className="mb-2"><span className="font-semibold">Cliente:</span> {selectedOrder.customer_name}</div>
            <div className="mb-2"><span className="font-semibold">Endereço:</span> {selectedOrder.address || <span className="text-gray-400">(não informado)</span>}</div>
            <div className="mb-2"><span className="font-semibold">Telefone:</span> {selectedOrder.customer_phone}</div>
            <div className="mb-2"><span className="font-semibold">Status:</span> {statusLabels[selectedOrder.status] || selectedOrder.status}</div>
            <div className="mb-2"><span className="font-semibold">Total:</span> <span className="text-green-700 font-bold">R$ {parseFloat(selectedOrder.total_amount).toFixed(2)}</span></div>
            {selectedOrder.notes && (
              <div className="mb-2"><span className="font-semibold">Observações:</span> <span className="text-yellow-900">{selectedOrder.notes}</span></div>
            )}
            <div className="mt-4 mb-2 font-semibold">Itens do Pedido:</div>
            <ul className="mb-2 space-y-1">
              {selectedOrder.order_items && selectedOrder.order_items.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span>R$ {parseFloat(item.unit_price).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
} 