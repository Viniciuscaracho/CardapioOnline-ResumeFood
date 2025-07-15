import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Search, Clock, MapPin, Phone, Mail, Package, Truck, CheckCircle, RefreshCw, Check, X, Eye, AlertCircle, User } from 'lucide-react'
import CartModal from '../components/CartModal'
import { useCart } from '../contexts/CartContext'

// Função para gerenciar sessão do cliente
const getCustomerSession = () => {
  try {
    const session = localStorage.getItem('customerSession')
    return session ? JSON.parse(session) : null
  } catch (error) {
    console.error('Erro ao ler sessão do cliente:', error)
    return null
  }
}

const setCustomerSession = (customerData) => {
  try {
    localStorage.setItem('customerSession', JSON.stringify(customerData))
  } catch (error) {
    console.error('Erro ao salvar sessão do cliente:', error)
  }
}

const clearCustomerSession = () => {
  try {
    localStorage.removeItem('customerSession')
  } catch (error) {
    console.error('Erro ao limpar sessão do cliente:', error)
  }
}

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastSearchTerm, setLastSearchTerm] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState(null)
  const { isCartModalOpen, closeCartModal } = useCart()

  // Verificar se há sessão ativa ao carregar a página
  useEffect(() => {
    console.log('🔍 OrdersPage: Verificando sessão do cliente...')
    const session = getCustomerSession()
    console.log('🔍 OrdersPage: Sessão encontrada:', session)
    if (session && session.phone) {
      console.log('🔍 OrdersPage: Configurando cliente logado:', session)
      setCurrentCustomer(session)
      setSearchTerm(session.phone)
      searchOrders(session.phone)
    } else {
      console.log('🔍 OrdersPage: Nenhuma sessão encontrada')
    }
  }, [])

  // Função para buscar pedidos por email/telefone
  const searchOrders = async (searchValue) => {
    console.log('🔍 OrdersPage: searchOrders chamado com:', searchValue)
    
    if (!searchValue.trim()) {
      console.log('🔍 OrdersPage: searchValue vazio, limpando pedidos')
      setOrders([])
      setFilteredOrders([])
      setHasSearched(false)
      return
    }

    try {
      console.log('🔍 OrdersPage: Iniciando busca de pedidos...')
      setLoading(true)
      setError(null)
      
      const isEmail = searchValue.includes('@')
      const params = isEmail 
        ? `?email=${encodeURIComponent(searchValue.trim())}`
        : `?phone=${encodeURIComponent(searchValue.trim())}`
      
      const url = `http://localhost:3000/api/orders/search${params}`
      console.log('🔍 OrdersPage: URL da busca:', url)
      
      const response = await fetch(url)
      console.log('🔍 OrdersPage: Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('🔍 OrdersPage: API Response:', data)
        // Handle both array and object with orders property
        const ordersArray = Array.isArray(data) ? data : (data.orders || [])
        console.log('🔍 OrdersPage: Orders Array:', ordersArray)
        console.log('🔍 OrdersPage: Quantidade de pedidos encontrados:', ordersArray.length)
        
        setOrders(ordersArray)
        setFilteredOrders(ordersArray)
        setLastSearchTerm(searchValue.trim())
        setHasSearched(true)
        
        // Se encontrou pedidos, salvar sessão do cliente
        if (ordersArray.length > 0) {
          console.log('🔍 OrdersPage: Salvando sessão do cliente encontrado')
          const customerData = {
            name: ordersArray[0].customer_name,
            phone: ordersArray[0].customer_phone,
            email: ordersArray[0].customer_email,
            address: ordersArray[0].address
          }
          setCustomerSession(customerData)
          setCurrentCustomer(customerData)
        }
      } else if (response.status === 404) {
        console.log('🔍 OrdersPage: Nenhum pedido encontrado (404)')
        setOrders([])
        setFilteredOrders([])
        setLastSearchTerm(searchValue.trim())
        setHasSearched(true)
      } else {
        console.log('🔍 OrdersPage: Erro na resposta da API:', response.status)
        throw new Error('Erro ao buscar pedidos')
      }
    } catch (err) {
      console.error('🔍 OrdersPage: Erro ao buscar pedidos:', err)
      setError('Erro ao buscar pedidos')
      setOrders([])
      setFilteredOrders([])
      setHasSearched(true)
    } finally {
      setLoading(false)
    }
  }

  // Função para recarregar os últimos pedidos buscados
  const reloadOrders = () => {
    if (lastSearchTerm) {
      searchOrders(lastSearchTerm)
    }
  }

  // Função para abrir modal com detalhes do pedido
  const openOrderModal = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  // Função para fechar modal
  const closeOrderModal = () => {
    setSelectedOrder(null)
    setIsModalOpen(false)
  }

  // Função para limpar sessão e dados do cliente
  const clearSession = () => {
    clearCustomerSession()
    setCurrentCustomer(null)
    setOrders([])
    setFilteredOrders([])
    setSearchTerm('')
    setLastSearchTerm('')
    setHasSearched(false)
  }

  // Polling para atualizações a cada 10 segundos (apenas se há pedidos)
  useEffect(() => {
    if (Array.isArray(orders) && orders.length > 0) {
      const interval = setInterval(reloadOrders, 10000)
      return () => clearInterval(interval)
    }
  }, [orders.length, lastSearchTerm])

  // Filtrar pedidos baseado no termo de busca
  useEffect(() => {
    // Ensure orders is always an array
    const ordersArray = Array.isArray(orders) ? orders : []
    
    if (searchTerm.trim() === '') {
      setFilteredOrders(ordersArray)
    } else {
      const filtered = ordersArray.filter(order => 
        order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_phone?.includes(searchTerm)
      )
      setFilteredOrders(filtered)
    }
  }, [searchTerm, orders])

  const handleSearch = (e) => {
    e.preventDefault()
    searchOrders(searchTerm)
  }

  const handleCheckout = () => {
    closeCartModal()
    setIsCheckoutOpen(true)
  }



  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />
      case 'preparing':
        return <Package className="w-4 h-4 text-orange-600" />
      case 'ready':
        return <Truck className="w-4 h-4 text-purple-600" />
      case 'out_for_delivery':
        return <Truck className="w-4 h-4 text-indigo-600" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'cancelled':
        return <X className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendente'
      case 'confirmed':
        return 'Confirmado'
      case 'preparing':
        return 'Preparando'
      case 'ready':
        return 'Pronto'
      case 'out_for_delivery':
        return 'Em Entrega'
      case 'delivered':
        return 'Entregue'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'preparing':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'ready':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'out_for_delivery':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateOrderTotal = (order) => {
    if (order.total_amount) {
      return Number(order.total_amount)
    }
    
    if (order.order_items) {
      return order.order_items.reduce((total, item) => {
        return total + (Number(item.unit_price) * item.quantity)
      }, 0)
    }
    
    return 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Meus Pedidos</h1>
          {currentCustomer ? (
            <div className="space-y-2">
              <p className="text-gray-600">Bem-vindo(a), {currentCustomer.name}!</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{currentCustomer.phone}</span>
                </span>
                {currentCustomer.email && (
                  <span className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{currentCustomer.email}</span>
                  </span>
                )}
              </div>
              <Button
                onClick={clearSession}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Trocar Cliente
              </Button>
            </div>
          ) : (
            <p className="text-gray-600">Digite seu email ou telefone para buscar seus pedidos</p>
          )}
        </div>

        {/* Search Section */}
        {!currentCustomer && (
          <div className="mb-8 flex justify-center">
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Digite seu email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-20"
                />
                <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3">
                  Buscar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p>Buscando pedidos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8 text-red-600">
            <AlertCircle className="w-6 h-6 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        )}

        {/* No Search State */}
        {!hasSearched && !loading && !currentCustomer && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Buscar Pedidos</h3>
            <p className="text-gray-600 mb-4">
              Digite seu email ou telefone para encontrar seus pedidos
            </p>
          </div>
        )}

        {/* No Results State */}
        {hasSearched && !loading && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-600">
              {currentCustomer 
                ? `Não encontramos pedidos para ${currentCustomer.name}`
                : `Não encontramos pedidos para "${lastSearchTerm}"`
              }
            </p>
            {currentCustomer && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">
                  Faça seu primeiro pedido no menu principal!
                </p>
                <Button
                  onClick={() => window.location.href = '/'}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Ir para o Menu
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-500" />
                        {order.customer_name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Pedido #{order.id} • {formatDate(order.created_at)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{getStatusText(order.status)}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{order.customer_phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 font-medium">{order.customer_email || 'Não informado'}</span>
                    </div>
                    {order.address && (
                      <div className="flex items-start space-x-2 md:col-span-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                        <span className="text-sm text-gray-600">{order.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-xl font-bold text-green-600">
                        R$ {calculateOrderTotal(order).toFixed(2)}
                      </span>
                    </div>
                    <Button
                      onClick={() => openOrderModal(order)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver Produtos</span>
                    </Button>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Observações:</strong> {order.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Detalhes do Pedido #{selectedOrder.id}</h2>
                  <Button
                    onClick={closeOrderModal}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Customer Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Informações do Cliente</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedOrder.customer_phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedOrder.customer_email}</span>
                    </div>
                    {selectedOrder.address && (
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                        <span className="text-sm">{selectedOrder.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Status */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-1">{getStatusText(selectedOrder.status)}</span>
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Pedido realizado em {formatDate(selectedOrder.created_at)}
                    </span>
                  </div>
                </div>

                {/* Products List */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Produtos do Pedido</h3>
                  <div className="space-y-3">
                    {selectedOrder.order_items?.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.product?.name || 'Produto não encontrado'}</p>
                          <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">R$ {Number(item.unit_price).toFixed(2)} cada</p>
                          <p className="font-semibold text-green-600">
                            R$ {(Number(item.unit_price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total do Pedido:</span>
                    <span className="text-xl font-bold text-green-600">
                      R$ {calculateOrderTotal(selectedOrder).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Observações:</strong> {selectedOrder.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cart Modal */}
        <CartModal isOpen={isCartModalOpen} onClose={closeCartModal} onCheckout={handleCheckout} />
      </div>
    </div>
  )
}

export default OrdersPage 