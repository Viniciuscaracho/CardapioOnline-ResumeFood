import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from './ui/button.jsx'
import { Badge } from './ui/badge.jsx'
import { Menu, X, Home, Utensils, FileText, ShoppingCart } from 'lucide-react'
import { useCart } from '../contexts/CartContext.jsx'
import cheiroverdeLogo from '../assets/cheiro_verde_logo.png'

function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartItemCount, openCartModal } = useCart()

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/menu', label: 'Menu', icon: Utensils },
    { path: '/orders', label: 'Pedidos', icon: FileText }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <img src={cheiroverdeLogo} alt="Logo" className="w-8 h-8" />
            <span className="font-bold text-gray-800 hidden sm:block">
              Cheiro Verde
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              )
            })}
            
            {/* Cart Button - Always visible */}
            <Button
              variant="ghost"
              size="sm"
              onClick={openCartModal}
              className="flex items-center space-x-2 relative"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Carrinho</span>
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart Button - Always visible */}
            <Button
              variant="ghost"
              size="sm"
              onClick={openCartModal}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      navigate(item.path)
                      setIsMenuOpen(false)
                    }}
                    className="w-full justify-start flex items-center space-x-3"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation 