import { Button } from './ui/button.jsx'
import { Card, CardContent } from './ui/card.jsx'
import { Badge } from './ui/badge.jsx'
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'
import { useCart } from '../contexts/CartContext.jsx'

function CartModal({ isOpen, onClose, onCheckout }) {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartItemCount } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">Carrinho</h2>
            <Badge variant="secondary">{cartItemCount}</Badge>
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

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Seu carrinho está vazio</p>
              <p className="text-sm text-gray-400">Adicione alguns itens para começar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => {
                const price = parseFloat(item.price) || 0
                return (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <img
                          src={item.image_url || item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            R$ {price.toFixed(2)}
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            
                            <span className="text-sm font-medium min-w-[30px] text-center">
                              {item.quantity}
                            </span>
                            
                            <Button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            
                            <Button
                              onClick={() => removeFromCart(item.id)}
                              size="sm"
                              variant="destructive"
                              className="w-8 h-8 p-0 ml-auto"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right mt-2">
                            <span className="text-sm font-semibold text-green-600">
                              R$ {(price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        {cart.length > 0 && (
          <div className="border-t p-4 flex-shrink-0 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-green-600">
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
                onClick={onCheckout}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Finalizar Pedido
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartModal 