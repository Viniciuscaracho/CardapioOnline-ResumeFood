import { useState } from 'react'
import { Button } from './ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx'
import { Input } from './ui/input.jsx'
import { Label } from './ui/label.jsx'
import { Textarea } from './ui/textarea.jsx'
import { Badge } from './ui/badge.jsx'
import { X, User, Phone, MapPin, ShoppingCart } from 'lucide-react'
import { useCart } from '../contexts/CartContext.jsx'
import { useOrders } from '../contexts/OrderContext.jsx'

// Função para normalizar o telefone para '11 981504864'
function normalizePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  }
  return digits;
}

function CheckoutModal({ isOpen, onClose, onSuccess }) {
  const { cart, getTotalPrice, clearCart } = useCart()
  const { createOrder } = useOrders()
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    email: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('=== DEBUG: CheckoutModal handleSubmit ===')
    console.log('Cart antes de enviar:', cart)
    console.log('Cart length:', cart.length)
    console.log('CustomerInfo:', customerInfo)
    
    if (!customerInfo.name.trim()) {
      alert('Por favor, informe seu nome')
      return
    }

    if (!customerInfo.phone.trim()) {
      alert('Por favor, informe seu telefone')
      return
    }

    if (cart.length === 0) {
      alert('Carrinho vazio! Adicione produtos antes de finalizar o pedido.')
      return
    }

    setIsSubmitting(true)

    try {
      console.log('=== DEBUG: Iniciando criação do pedido ===')
      console.log('Cart no início:', cart)
      
      // Normalizar telefone antes de enviar
      const normalizedCustomerInfo = {
        ...customerInfo,
        phone: normalizePhone(customerInfo.phone)
      };
      // Criar o pedido via API
      const newOrder = await createOrder(cart, normalizedCustomerInfo)
      
      console.log('Pedido criado com sucesso:', newOrder)
      
      // Limpar o carrinho apenas após sucesso
      clearCart()
      
      // Fechar modal e navegar
      onSuccess(newOrder)
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error)
      alert(`Erro ao finalizar pedido: ${error.message}`)
      // Não limpar o carrinho em caso de erro
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const cartTotal = getTotalPrice()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[98vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">Finalizar Pedido</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col sm:flex-row flex-1 min-h-0">
          {/* Formulário */}
          <div className="w-full sm:w-[420px] p-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="flex items-center space-x-2 text-base mb-1">
                  <User className="w-5 h-5" />
                  <span>Nome completo *</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center space-x-2 text-base mb-1">
                  <Phone className="w-5 h-5" />
                  <span>Telefone *</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center space-x-2 text-base mb-1">
                  <User className="w-5 h-5" />
                  <span>E-mail *</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address" className="flex items-center space-x-2 text-base mb-1">
                  <MapPin className="w-5 h-5" />
                  <span>Endereço de entrega</span>
                </Label>
                <Textarea
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Rua, número, bairro, cidade..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-base mb-1">Observações</Label>
                <Textarea
                  id="notes"
                  value={customerInfo.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Alguma observação especial sobre o pedido?"
                  rows={2}
                />
              </div>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div className="w-full sm:w-[420px] border-t sm:border-t-0 sm:border-l bg-gray-50 flex flex-col max-h-96 sm:max-h-none">
            <div className="p-6 border-b flex-shrink-0">
              <h3 className="font-semibold text-xl">Resumo do Pedido</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              <div className="space-y-5">
                {cart.map(item => (
                  <div key={item.id} className="flex items-start justify-between text-base">
                    <div className="flex-1">
                      <p className="font-semibold leading-tight mb-2">{item.name}</p>
                      <p className="text-gray-600 text-sm mb-1">Qtd: {item.quantity}</p>
                    </div>
                    <span className="font-bold whitespace-nowrap">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Total - Fixo */}
            <div className="border-t p-6 flex-shrink-0 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  R$ {cartTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  Continuar Comprando
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Processando...' : 'Finalizar Pedido'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutModal 