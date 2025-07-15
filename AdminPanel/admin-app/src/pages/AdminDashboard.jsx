import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '../components/ui/card'
import { ShoppingCart, Package, Clock } from 'lucide-react'

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch('http://localhost:3000/api/products').then(res => res.json()),
      fetch('http://localhost:3000/api/orders').then(res => res.json())
    ])
      .then(([productsData, ordersData]) => {
        setProducts(productsData)
        setOrders(ordersData)
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao carregar dados')
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-8">Carregando...</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>

  const totalProducts = products.length
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const recentOrders = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
  const recentProducts = [...products].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Package className="w-8 h-8 text-green-700" />
            <div>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <div className="text-gray-600">Produtos</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <ShoppingCart className="w-8 h-8 text-blue-700" />
            <div>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <div className="text-gray-600">Pedidos</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Clock className="w-8 h-8 text-orange-700" />
            <div>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <div className="text-gray-600">Pendentes</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="font-bold mb-2">Pedidos Recentes</div>
            <ul className="divide-y">
              {recentOrders.map(order => (
                <li key={order.id} className="py-2 flex justify-between">
                  <span>{order.customer_name || 'Cliente'}</span>
                  <span className="font-semibold">R$ {order.total_amount?.toFixed(2) ?? '-'}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="font-bold mb-2">Produtos Recentes</div>
            <ul className="divide-y">
              {recentProducts.map(product => (
                <li key={product.id} className="py-2 flex justify-between">
                  <span>{product.name}</span>
                  <span className="font-semibold">R$ {Number(product.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 