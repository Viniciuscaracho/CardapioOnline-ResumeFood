import React from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { Plus, Minus, Trash2, X, ShoppingCart } from 'lucide-react'
import { useIsMobile } from '../hooks/use-mobile'

export function CartModal({ isOpen, onClose, cart, onUpdateQuantity, onRemove }) {
  const isMobile = useIsMobile()
  
  if (!isOpen) return null

  const getDisplayName = (item) => {
    if (item.customName) {
      return item.customName
    }
    return item.name
  }

  const getFlavorDisplay = (item) => {
    if (item.pizzaConfig) {
      const { type, flavors } = item.pizzaConfig
      if (type === 'single') {
        return `Sabor: ${flavors[0].name}`
      } else if (type === 'half-half') {
        return `Meia ${flavors[0].name} e Meia ${flavors[1].name}`
      } else if (type === 'three-quarters') {
        return `Sabores: ${flavors.map(f => f.name).join(', ')}`
      }
    } else if (item.selectedFlavorNames) {
      return `Sabores: ${item.selectedFlavorNames.join(', ')}`
    }
    return null
  }

  const getItemId = (item) => {
    return item.uniqueId || item.id
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price) || 0
      return total + (price * item.quantity)
    }, 0)
  }

  // Renderizar modal para desktop
  if (!isMobile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Seu Carrinho</h3>
                  <p className="text-sm text-gray-600">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Lista de itens - scrollável */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Carrinho vazio</h3>
                <p className="text-gray-500">Adicione alguns produtos para começar!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => {
                  const price = parseFloat(item.price) || 0
                  const itemId = getItemId(item)
                  const displayName = getDisplayName(item)
                  const flavorDisplay = getFlavorDisplay(item)

                  return (
                    <Card key={itemId} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <img
                            src={item.image_url || item.image}
                            alt={displayName}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate">
                              {displayName}
                            </h3>

                            {/* Mostrar configuração de sabores se houver */}
                            {flavorDisplay && (
                              <div className="mt-2 mb-3">
                                <Badge variant="secondary" className="text-xs bg-teal-100 text-teal-800 border border-teal-200">
                                  {flavorDisplay}
                                </Badge>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <p className="text-lg font-bold text-green-600">
                                R$ {price.toFixed(2)}
                              </p>

                              {/* Controles de quantidade */}
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                                  <Button
                                    onClick={() => onUpdateQuantity(itemId, item.quantity - 1)}
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-gray-200"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                  <span className="text-sm font-semibold min-w-[24px] text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    onClick={() => onUpdateQuantity(itemId, item.quantity + 1)}
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-gray-200"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                                <Button
                                  onClick={() => onRemove(itemId)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
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

          {/* Footer com total - fixo */}
          {cart.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  R$ {calculateTotal().toFixed(2)}
                </span>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-semibold rounded-lg">
                Finalizar Pedido
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Renderizar carrinho inline para mobile (slide-up)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-end justify-center p-0">
      <div className="bg-white rounded-t-2xl w-full h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Seu Carrinho</h3>
                <p className="text-sm text-gray-600">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Lista de itens - scrollável */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">Carrinho vazio</h3>
              <p className="text-sm text-gray-500">Adicione alguns produtos!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => {
                const price = parseFloat(item.price) || 0
                const itemId = getItemId(item)
                const displayName = getDisplayName(item)
                const flavorDisplay = getFlavorDisplay(item)

                return (
                  <div key={itemId} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-start space-x-3">
                      <img
                        src={item.image_url || item.image}
                        alt={displayName}
                        className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate text-sm">
                          {displayName}
                        </h3>

                        {/* Mostrar configuração de sabores se houver */}
                        {flavorDisplay && (
                          <div className="mt-1 mb-2">
                            <Badge variant="secondary" className="text-xs bg-teal-100 text-teal-800 border border-teal-200">
                              {flavorDisplay}
                            </Badge>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <p className="text-base font-bold text-green-600">
                            R$ {price.toFixed(2)}
                          </p>

                          {/* Controles de quantidade */}
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
                              <Button
                                onClick={() => onUpdateQuantity(itemId, item.quantity - 1)}
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 hover:bg-gray-200"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-semibold min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                onClick={() => onUpdateQuantity(itemId, item.quantity + 1)}
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 hover:bg-gray-200"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <Button
                              onClick={() => onRemove(itemId)}
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer com total - fixo */}
        {cart.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-gray-800">Total:</span>
              <span className="text-xl font-bold text-green-600">
                R$ {calculateTotal().toFixed(2)}
              </span>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-semibold rounded-lg">
              Finalizar Pedido
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 