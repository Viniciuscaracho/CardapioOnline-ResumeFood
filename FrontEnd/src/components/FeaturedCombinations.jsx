import React from 'react'
import { PizzaCard } from './PizzaCard'
import { ChevronUp } from 'lucide-react'

export function FeaturedCombinations({ products, onAdd, onRemove, onUpdateQuantity, getCartItemQuantity, availableFlavors = [] }) {
  // Filtrar produtos em destaque (pizzas com dois sabores)
  const featuredProducts = products.filter(product => 
    product.category === 'pizza' && 
    product.description?.includes('dois sabores')
  )

  if (featuredProducts.length === 0) return null

  return (
    <div className="mb-4 sm:mb-6 mobile-spacing">
      {/* Header da seção */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
        <div className="flex items-center space-x-2">
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mobile-text-optimized">
            COMBINAÇÕES MAIS PEDIDAS
          </h2>
        </div>
        <span className="text-xs sm:text-sm text-gray-500 mobile-text-optimized">
          {featuredProducts.length} combinações
        </span>
      </div>

      {/* Grid de produtos em destaque */}
      <div className="grid grid-cols-1 gap-2 sm:gap-3">
        {featuredProducts.map(item => {
          const quantity = getCartItemQuantity(item.id)
          return (
            <PizzaCard
              key={item.id}
              item={item}
              quantity={quantity}
              onAdd={onAdd}
              onRemove={onRemove}
              onUpdateQuantity={onUpdateQuantity}
              availableFlavors={availableFlavors}
            />
          )
        })}
      </div>
    </div>
  )
} 