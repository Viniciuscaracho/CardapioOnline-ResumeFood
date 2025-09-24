import React from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Menu, Search, Clock, DollarSign, Info, ShoppingCart } from 'lucide-react'

export function MobileHeader({ 
  restaurantName = "Cheiro Verde", 
  restaurantType = "Restaurante",
  status = "Aberto",
  statusColor = "bg-pink-100 text-pink-800",
  deliveryTime = "30-60min",
  minimumOrder = "R$ 15,00",
  cartItemCount = 0,
  onMenuClick,
  onSearchClick,
  onCartClick,
  onInfoClick
}) {
  return (
    <div className="sticky top-0 z-30 bg-white shadow-sm border-b">
      {/* Header principal */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Lado esquerdo - Menu e Logo */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="p-2" onClick={onMenuClick}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">CV</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-gray-800 truncate">{restaurantName}</h1>
                <p className="text-xs text-gray-600 truncate">{restaurantType}</p>
              </div>
            </div>
          </div>

          {/* Lado direito - Status e Ações */}
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className={`${statusColor} text-xs px-2 py-1`}>
              {status}
            </Badge>
            <Button variant="ghost" size="sm" className="p-2" onClick={onSearchClick}>
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 relative" onClick={onCartClick}>
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Barra de informações do restaurante */}
      <div className="bg-gray-100 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{deliveryTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>Mín {minimumOrder}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-xs p-1 h-auto" onClick={onInfoClick}>
            <Info className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Ver mais</span>
            <span className="sm:hidden">Info</span>
          </Button>
        </div>
      </div>
    </div>
  )
} 