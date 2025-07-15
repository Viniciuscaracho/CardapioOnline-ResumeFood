import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import CartModal from '../components/CartModal'
import CheckoutModal from '../components/CheckoutModal'
import { useCart } from '../contexts/CartContext'

function MenuPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartItemQuantity,
    cartItemCount,
    isCartModalOpen,
    closeCartModal
  } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:3000/api/products')
        if (!response.ok) throw new Error('Erro ao carregar produtos')
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError('Erro ao carregar produtos')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Filtrar apenas produtos disponíveis para o cliente
  const availableProducts = products.filter(p => p.available)

  const categories = [
    { id: 'todos', name: 'Todos', icon: '🍽️' },
    ...Array.from(new Set(availableProducts.map(p => p.category))).map(cat => ({
      id: cat,
      name: cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : '',
      icon: ''
    }))
  ].filter((cat, idx, arr) => cat.id && arr.findIndex(c => c.id === cat.id) === idx)

  const filteredItems = selectedCategory === 'todos'
    ? availableProducts
    : availableProducts.filter(item => item.category === selectedCategory)

  const handleCheckout = () => {
    closeCartModal()
    setIsCheckoutOpen(true)
  }

  const handleCheckoutSuccess = (newOrder) => {
    console.log('🎉 MenuPage: handleCheckoutSuccess chamado com:', newOrder)
    setIsCheckoutOpen(false)
    
    // Salvar dados do cliente na sessão antes de navegar
    if (newOrder && newOrder.customer_phone) {
      console.log('🎉 MenuPage: Salvando dados do cliente na sessão')
      const customerData = {
        name: newOrder.customer_name,
        phone: newOrder.customer_phone,
        email: newOrder.customer_email,
        address: newOrder.address
      }
      localStorage.setItem('customerSession', JSON.stringify(customerData))
      console.log('🎉 MenuPage: Sessão salva, navegando para /orders')
    }
    
    navigate('/orders')
  }

  if (loading) {
    return <div className="text-center py-20">Carregando produtos...</div>
  }
  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cardápio</h1>
          <p className="text-gray-600">Confira nossos deliciosos pratos e bebidas</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2"
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const quantity = getCartItemQuantity(item.id)
            return (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image_url || item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </CardTitle>
                    <Badge variant={item.available ? "default" : "secondary"}>
                      {item.available ? "Disponível" : "Indisponível"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {item.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-green-600">
                      R$ {parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                  {/* Cart Controls */}
                  <div className="flex items-center justify-between">
                    {quantity === 0 ? (
                      <Button
                        onClick={() => addToCart(item)}
                        disabled={!item.available}
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-2 w-full">
                        <Button
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center justify-center min-w-[60px]">
                          <span className="text-lg font-semibold text-gray-800">
                            {quantity}
                          </span>
                        </div>
                        <Button
                          onClick={() => addToCart(item)}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => removeFromCart(item.id)}
                          size="sm"
                          variant="destructive"
                          className="ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Cart Modal */}
        <CartModal isOpen={isCartModalOpen} onClose={closeCartModal} onCheckout={handleCheckout} />
        <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} onSuccess={handleCheckoutSuccess} />
      </div>
    </div>
  )
}

export default MenuPage 