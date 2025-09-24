import React, { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { X, Check } from 'lucide-react'

export function FlavorSelector({ 
  isOpen, 
  onClose, 
  onConfirm, 
  availableFlavors = [],
  maxFlavors = 3,
  itemName = "Pizza"
}) {
  const [selectedFlavors, setSelectedFlavors] = useState([])

  const handleFlavorToggle = (flavor) => {
    if (selectedFlavors.includes(flavor)) {
      setSelectedFlavors(selectedFlavors.filter(f => f !== flavor))
    } else if (selectedFlavors.length < maxFlavors) {
      setSelectedFlavors([...selectedFlavors, flavor])
    }
  }

  const handleConfirm = () => {
    if (selectedFlavors.length > 0) {
      onConfirm(selectedFlavors)
      setSelectedFlavors([])
      onClose()
    }
  }

  const handleCancel = () => {
    setSelectedFlavors([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Escolha os sabores da {itemName}
            </h3>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Selecione até {maxFlavors} sabores
          </p>
        </div>

        {/* Lista de sabores */}
        <div className="p-4">
          <div className="space-y-2">
            {availableFlavors.map((flavor) => (
              <div
                key={flavor.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedFlavors.includes(flavor.name)
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleFlavorToggle(flavor.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{flavor.name}</h4>
                    <p className="text-sm text-gray-600">{flavor.description}</p>
                    <p className="text-sm font-medium text-green-600 mt-1">
                      R$ {parseFloat(flavor.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="ml-3">
                    {selectedFlavors.includes(flavor.name) ? (
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

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">
              {selectedFlavors.length} de {maxFlavors} sabores selecionados
            </span>
            {selectedFlavors.length > 0 && (
              <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                {selectedFlavors.join(', ')}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedFlavors.length === 0}
              className="flex-1 bg-teal-600 hover:bg-teal-700"
            >
              Confirmar ({selectedFlavors.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 