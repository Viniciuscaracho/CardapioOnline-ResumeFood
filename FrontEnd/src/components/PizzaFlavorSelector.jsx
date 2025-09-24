import React, { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { X, Check, Circle, CircleDot } from 'lucide-react'

export function PizzaFlavorSelector({ 
  isOpen, 
  onClose, 
  onConfirm, 
  availableFlavors = [],
  itemName = "Pizza"
}) {
  const [pizzaType, setPizzaType] = useState('single') // 'single', 'half-half', 'three-quarters'
  const [selectedFlavors, setSelectedFlavors] = useState([])

  const handlePizzaTypeChange = (type) => {
    setPizzaType(type)
    setSelectedFlavors([])
  }

  const handleFlavorToggle = (flavor) => {
    if (pizzaType === 'single') {
      // Para pizza de um sabor, substitui a seleção
      setSelectedFlavors([flavor])
    } else if (pizzaType === 'half-half') {
      // Para pizza meia a meia, permite até 2 sabores
      if (selectedFlavors.includes(flavor)) {
        setSelectedFlavors(selectedFlavors.filter(f => f !== flavor))
      } else if (selectedFlavors.length < 2) {
        setSelectedFlavors([...selectedFlavors, flavor])
      }
    } else if (pizzaType === 'three-quarters') {
      // Para pizza com 3 sabores, permite até 3 sabores
      if (selectedFlavors.includes(flavor)) {
        setSelectedFlavors(selectedFlavors.filter(f => f !== flavor))
      } else if (selectedFlavors.length < 3) {
        setSelectedFlavors([...selectedFlavors, flavor])
      }
    }
  }

  const handleConfirm = () => {
    if (selectedFlavors.length > 0) {
      const pizzaConfig = {
        type: pizzaType,
        flavors: selectedFlavors,
        customName: generateCustomName(pizzaType, selectedFlavors)
      }
      onConfirm(pizzaConfig)
      setSelectedFlavors([])
      setPizzaType('single')
      onClose()
    }
  }

  const handleCancel = () => {
    setSelectedFlavors([])
    setPizzaType('single')
    onClose()
  }

  const generateCustomName = (type, flavors) => {
    if (type === 'single') {
      return `Pizza ${flavors[0].name}`
    } else if (type === 'half-half') {
      return `Pizza Meia ${flavors[0].name} e Meia ${flavors[1].name}`
    } else if (type === 'three-quarters') {
      return `Pizza ${flavors.map(f => f.name).join(', ')}`
    }
    return itemName
  }

  const getMaxFlavors = () => {
    switch (pizzaType) {
      case 'single': return 1
      case 'half-half': return 2
      case 'three-quarters': return 3
      default: return 1
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mobile-text-optimized">
              Personalizar {itemName}
            </h3>
            <Button variant="ghost" size="sm" onClick={handleCancel} className="mobile-button">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto">
          {/* Seleção do tipo de pizza */}
          <div className="p-3 sm:p-4 border-b">
            <h4 className="text-sm font-medium text-gray-700 mb-3 mobile-text-optimized">
              Como você quer sua pizza?
            </h4>
            <div className="space-y-2">
              <Button
                variant={pizzaType === 'single' ? "default" : "outline"}
                className={`w-full justify-start mobile-button ${pizzaType === 'single' ? 'bg-teal-600 text-white' : ''}`}
                onClick={() => handlePizzaTypeChange('single')}
              >
                <Circle className="w-4 h-4 mr-2" />
                <span className="mobile-text-optimized">Um sabor apenas</span>
              </Button>
              <Button
                variant={pizzaType === 'half-half' ? "default" : "outline"}
                className={`w-full justify-start mobile-button ${pizzaType === 'half-half' ? 'bg-teal-600 text-white' : ''}`}
                onClick={() => handlePizzaTypeChange('half-half')}
              >
                <div className="w-4 h-4 mr-2 flex">
                  <div className="w-1/2 h-full border-r-2 border-current"></div>
                </div>
                <span className="mobile-text-optimized">Meia a meia (2 sabores)</span>
              </Button>
              <Button
                variant={pizzaType === 'three-quarters' ? "default" : "outline"}
                className={`w-full justify-start mobile-button ${pizzaType === 'three-quarters' ? 'bg-teal-600 text-white' : ''}`}
                onClick={() => handlePizzaTypeChange('three-quarters')}
              >
                <div className="w-4 h-4 mr-2 flex">
                  <div className="w-1/3 h-full border-r border-current"></div>
                  <div className="w-1/3 h-full border-r border-current"></div>
                </div>
                <span className="mobile-text-optimized">Três sabores</span>
              </Button>
            </div>
          </div>

          {/* Lista de sabores */}
          <div className="p-3 sm:p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3 mobile-text-optimized">
              Escolha {getMaxFlavors()} sabor{getMaxFlavors() > 1 ? 'es' : ''}:
            </h4>
            <div className="space-y-2">
              {availableFlavors.map((flavor) => (
                <div
                  key={flavor.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors mobile-card-optimized ${
                    selectedFlavors.includes(flavor)
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleFlavorToggle(flavor)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 mobile-text-optimized">{flavor.name}</h4>
                      <p className="text-sm text-gray-600 mobile-text-optimized line-clamp-2">{flavor.description}</p>
                      <p className="text-sm font-medium text-green-600 mt-1 mobile-text-optimized">
                        R$ {parseFloat(flavor.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      {selectedFlavors.includes(flavor) ? (
                        <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 mobile-text-optimized">
              {selectedFlavors.length} de {getMaxFlavors()} sabores selecionados
            </span>
            {selectedFlavors.length > 0 && (
              <Badge variant="secondary" className="bg-teal-100 text-teal-800 text-xs">
                {selectedFlavors.map(f => f.name).join(', ')}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 mobile-button"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedFlavors.length === 0}
              className="flex-1 bg-teal-600 hover:bg-teal-700 mobile-button"
            >
              Confirmar ({selectedFlavors.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 