import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { ArrowRight, Utensils, FileText, ShoppingCart } from 'lucide-react'
import { CartModal } from '../components/CartModal'
import CheckoutModal from '../components/CheckoutModal'
import { useCart } from '../contexts/CartContext'

function HomePage() {
  const navigate = useNavigate()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)
  const { cart, updateQuantity, removeFromCart } = useCart()

  const handleCheckout = () => {
    setIsCartModalOpen(false)
    setIsCheckoutOpen(true)
  }

  const handleCheckoutSuccess = (newOrder) => {
    console.log('🎉 HomePage: handleCheckoutSuccess chamado com:', newOrder)
    setIsCheckoutOpen(false)
    
    // Salvar dados do cliente na sessão antes de navegar
    if (newOrder && newOrder.customer_phone) {
      console.log('🎉 HomePage: Salvando dados do cliente na sessão')
      const customerData = {
        name: newOrder.customer_name,
        phone: newOrder.customer_phone,
        email: newOrder.customer_email,
        address: newOrder.address
      }
      localStorage.setItem('customerSession', JSON.stringify(customerData))
      console.log('🎉 HomePage: Sessão salva, navegando para /orders')
    }
    
    navigate('/orders')
  }

  const closeCartModal = () => {
    setIsCartModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Bem-vindo ao <span className="text-green-600">Cheiro Verde</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubra os sabores autênticos da nossa cozinha. 
            Deliciosos pratos preparados com ingredientes frescos e muito amor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/menu')}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              Ver Cardápio
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={() => navigate('/orders')}
              variant="outline"
              size="lg"
            >
              Meus Pedidos
              <FileText className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Utensils className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Cardápio Variado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Explore nossa seleção de pratos deliciosos, desde hambúrgueres artesanais 
                até acompanhamentos frescos e bebidas refrescantes.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Pedido Fácil</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Faça seu pedido online de forma simples e rápida. 
                Acompanhe o status em tempo real e receba atualizações.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Histórico Completo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Acesse todo o histórico dos seus pedidos anteriores. 
                Reviva os sabores que você mais gostou.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Pronto para experimentar?
          </h2>
          <p className="text-gray-600 mb-6">
            Clique no botão abaixo e descubra nossos deliciosos pratos
          </p>
          <Button 
            onClick={() => navigate('/menu')}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            Ver Cardápio Completo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Cart Modal */}
        <CartModal 
          isOpen={isCartModalOpen} 
          onClose={closeCartModal} 
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
        />
        <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} onSuccess={handleCheckoutSuccess} />
      </div>
    </div>
  )
}

export default HomePage 