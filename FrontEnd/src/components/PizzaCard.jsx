import React, { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Plus, Minus, Trash2, X, Check } from 'lucide-react'
import { PizzaFlavorSelector } from './PizzaFlavorSelector'
import { useIsMobile } from '../hooks/use-mobile'

export function PizzaCard({ item, quantity, onAdd, onRemove, onUpdateQuantity, availableFlavors = [] }) {
  const [showFlavorSelector, setShowFlavorSelector] = useState(false)
  const [showInlineSelector, setShowInlineSelector] = useState(false)
  const [selectedFlavors, setSelectedFlavors] = useState([])
  const [pizzaType, setPizzaType] = useState('single')
  
  const isMobile = useIsMobile()

  // Verificar se é uma pizza
  const isPizza = item.category === 'pizza'

  const handleFlavorConfirm = (pizzaConfig) => {
    // Adicionar item com informações dos sabores selecionados
    const itemWithFlavors = {
      ...item,
      pizzaConfig,
      customName: pizzaConfig.customName,
      selectedFlavorNames: pizzaConfig.flavors.map(f => f.name),
      selectedFlavors: pizzaConfig.flavors.length
    }
    onAdd(itemWithFlavors)
    setShowInlineSelector(false)
    setSelectedFlavors([])
    setPizzaType('single')
  }

  const handleAddToCart = () => {
    if (isPizza) {
      if (isMobile) {
        // Usar seletor inline para mobile
        setShowInlineSelector(true)
      } else {
        // Usar modal para desktop
        setShowFlavorSelector(true)
      }
    } else {
      // Adicionar item diretamente para outros produtos
      onAdd(item)
    }
  }

  const handleInlineFlavorToggle = (flavor) => {
    if (pizzaType === 'single') {
      setSelectedFlavors([flavor])
    } else if (pizzaType === 'half-half') {
      if (selectedFlavors.includes(flavor)) {
        setSelectedFlavors(selectedFlavors.filter(f => f !== flavor))
      } else if (selectedFlavors.length < 2) {
        setSelectedFlavors([...selectedFlavors, flavor])
      }
    } else if (pizzaType === 'three-quarters') {
      if (selectedFlavors.includes(flavor)) {
        setSelectedFlavors(selectedFlavors.filter(f => f !== flavor))
      } else if (selectedFlavors.length < 3) {
        setSelectedFlavors([...selectedFlavors, flavor])
      }
    }
  }

  const handleInlineConfirm = () => {
    if (selectedFlavors.length > 0) {
      const pizzaConfig = {
        type: pizzaType,
        flavors: selectedFlavors,
        customName: generateCustomName(pizzaType, selectedFlavors)
      }
      handleFlavorConfirm(pizzaConfig)
    }
  }

  const generateCustomName = (type, flavors) => {
    if (type === 'single') {
      return `Pizza ${flavors[0].name}`
    } else if (type === 'half-half') {
      return `Pizza Meia ${flavors[0].name} e Meia ${flavors[1].name}`
    } else if (type === 'three-quarters') {
      return `Pizza ${flavors.map(f => f.name).join(', ')}`
    }
    return item.name
  }

  const getMaxFlavors = () => {
    switch (pizzaType) {
      case 'single': return 1
      case 'half-half': return 2
      case 'three-quarters': return 3
      default: return 1
    }
  }

  // Criar ID único para verificar quantidade no carrinho
  const getItemId = () => {
    return item.id
  }

  const itemId = getItemId()

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow mobile-card-optimized">
        <div className="flex">
          {/* Imagem à esquerda */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
            <img
              src={item.image_url || item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            
            {/* Badge de disponibilidade */}
            <div className="absolute top-1 right-1">
              <Badge variant={item.available ? "default" : "secondary"} className="text-xs px-1 py-0">
                {item.available ? "✓" : "✗"}
              </Badge>
            </div>
          </div>

          {/* Conteúdo à direita */}
          <div className="flex-1 p-2 sm:p-3 flex flex-col justify-between min-w-0">
            {/* Título e descrição */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 leading-tight mobile-text-optimized">
                {item.name}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-2 leading-tight mobile-text-optimized">
                {item.description}
              </p>
              
              {/* Indicador para pizzas */}
              {isPizza && (
                <div className="mt-1">
                  <p className="text-xs text-teal-600 font-medium mobile-text-optimized">
                    Escolha os sabores
                  </p>
                </div>
              )}
            </div>

            {/* Preço e controles */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-base sm:text-lg font-bold text-gray-800 mobile-text-optimized">
                R$ {parseFloat(item.price).toFixed(2)}
              </span>

              {/* Controles do carrinho */}
              <div className="flex items-center space-x-1">
                {quantity === 0 ? (
                  <Button
                    onClick={handleAddToCart}
                    disabled={!item.available}
                    size="sm"
                    className="h-7 sm:h-8 px-2 sm:px-3 bg-green-600 hover:bg-green-700 text-white text-xs mobile-button"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">
                      {isPizza ? 'Escolher Sabores' : 'Adicionar'}
                    </span>
                    <span className="sm:hidden">
                      {isPizza ? 'Sabores' : 'Add'}
                    </span>
                  </Button>
                ) : (
                  <div className="flex items-center space-x-1">
                    <Button
                      onClick={() => onUpdateQuantity(itemId, quantity - 1)}
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 mobile-button"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <div className="flex items-center justify-center min-w-[24px] sm:min-w-[30px]">
                      <span className="text-sm font-semibold text-gray-800 mobile-text-optimized">
                        {quantity}
                      </span>
                    </div>
                    <Button
                      onClick={handleAddToCart}
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 mobile-button"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => onRemove(itemId)}
                      size="sm"
                      variant="destructive"
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 mobile-button"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Seletor inline para mobile */}
        {isMobile && showInlineSelector && isPizza && (
          <div className="border-t bg-gray-50 p-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-800">Escolha os sabores</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInlineSelector(false)}
                className="p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Tipo de pizza */}
            <div className="mb-3">
              <div className="flex gap-2">
                <Button
                  variant={pizzaType === 'single' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPizzaType('single')}
                  className="text-xs mobile-button"
                >
                  Um sabor
                </Button>
                <Button
                  variant={pizzaType === 'half-half' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPizzaType('half-half')}
                  className="text-xs mobile-button"
                >
                  Meia a meia
                </Button>
                <Button
                  variant={pizzaType === 'three-quarters' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPizzaType('three-quarters')}
                  className="text-xs mobile-button"
                >
                  Três sabores
                </Button>
              </div>
            </div>

            {/* Lista de sabores */}
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableFlavors.map((flavor) => (
                <div
                  key={flavor.id}
                  className={`p-2 border rounded cursor-pointer text-xs ${
                    selectedFlavors.includes(flavor)
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleInlineFlavorToggle(flavor)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{flavor.name}</div>
                      <div className="text-gray-600 truncate">{flavor.description}</div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {selectedFlavors.includes(flavor) ? (
                        <Check className="w-4 h-4 text-teal-600" />
                      ) : (
                        <div className="w-4 h-4 border border-gray-300 rounded"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInlineSelector(false)}
                className="flex-1 mobile-button"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleInlineConfirm}
                disabled={selectedFlavors.length === 0}
                className="flex-1 bg-teal-600 hover:bg-teal-700 mobile-button"
              >
                Confirmar ({selectedFlavors.length})
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de seleção de sabores (apenas para desktop) */}
      {!isMobile && (
        <PizzaFlavorSelector
          isOpen={showFlavorSelector}
          onClose={() => setShowFlavorSelector(false)}
          onConfirm={handleFlavorConfirm}
          availableFlavors={availableFlavors}
          itemName={item.name}
        />
      )}
    </>
  )
} 