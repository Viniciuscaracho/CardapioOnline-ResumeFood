import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { PizzaCard } from '../components/PizzaCard'
import { MobileHeader } from '../components/MobileHeader'
import { FeaturedCombinations } from '../components/FeaturedCombinations'
import { CartModal } from '../components/CartModal'
import { useCart } from '../contexts/CartContext'
import { useIsMobile } from '../hooks/use-mobile'
import { Menu, Search, Clock, DollarSign, Info } from 'lucide-react'

function MenuPage() {
  const isMobile = useIsMobile()
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    getCartItemQuantity,
    getTotalItems,
    getTotalPrice
  } = useCart()
  
  const [products, setProducts] = useState([])
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Sabores disponíveis para pizzas
  const availablePizzaFlavors = [
    {
      id: 1,
      name: 'Muçarela',
      description: 'Muçarela, molho de tomate e orégano',
      price: 45.00
    },
    {
      id: 2,
      name: 'Calabresa',
      description: 'Calabresa, muçarela, molho de tomate e orégano',
      price: 48.00
    },
    {
      id: 3,
      name: 'Frango com Catupiry',
      description: 'Frango desfiado, catupiry, muçarela, molho de tomate e orégano',
      price: 54.00
    },
    {
      id: 4,
      name: 'Bacon',
      description: 'Bacon crocante, muçarela, molho de tomate e orégano',
      price: 56.00
    },
    {
      id: 5,
      name: 'Quatro Queijos',
      description: 'Muçarela, parmesão, provolone e gorgonzola',
      price: 52.00
    },
    {
      id: 6,
      name: 'Portuguesa',
      description: 'Presunto, ovos, cebola, azeitonas, muçarela e molho de tomate',
      price: 50.00
    },
    {
      id: 7,
      name: 'Atum',
      description: 'Atum, cebola, muçarela e molho de tomate',
      price: 52.00
    },
    {
      id: 8,
      name: 'Palmito',
      description: 'Palmito, muçarela, molho de tomate e orégano',
      price: 50.00
    },
    {
      id: 9,
      name: 'Pepperoni',
      description: 'Pepperoni, muçarela, molho de tomate e orégano',
      price: 58.00
    },
    {
      id: 10,
      name: 'Margherita',
      description: 'Molho de tomate, muçarela fresca, manjericão e azeite de oliva',
      price: 45.00
    }
  ]

  // Categorias para filtro
  const categories = [
    { id: 'all', name: 'Todos', icon: '🍕' },
    { id: 'pizza', name: 'Pizzas', icon: '🍕' },
    { id: 'borda', name: 'Bordas', icon: '🥖' },
    { id: 'bebidas', name: 'Bebidas', icon: '🥤' }
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    }
  }

  const handleMenuClick = () => {
    // Implementar menu lateral se necessário
    console.log('Menu clicked')
  }

  const handleSearchClick = () => {
    // Implementar busca se necessário
    console.log('Search clicked')
  }

  const handleInfoClick = () => {
    // Implementar informações do restaurante
    console.log('Info clicked')
  }

  const closeCartModal = () => {
    setIsCartModalOpen(false)
  }

  const openCartModal = () => {
    setIsCartModalOpen(true)
  }

  // Filtrar produtos por categoria
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  const cartItemCount = getTotalItems()

  return (
    <div className="min-h-screen bg-gray-50 mobile-no-overflow">
      {/* Header Mobile */}
      {isMobile && (
        <>
          <MobileHeader
            restaurantName="Cheiro Verde"
            restaurantType="Restaurante"
            status="Aberto"
            statusColor="bg-green-100 text-green-800"
            deliveryTime="30-60min"
            minimumOrder="R$ 15,00"
            cartItemCount={cartItemCount}
            onMenuClick={handleMenuClick}
            onSearchClick={handleSearchClick}
            onCartClick={openCartModal}
            onInfoClick={handleInfoClick}
          />
          
          {/* Filtros de categoria mobile */}
          <div className="bg-white border-b px-3 py-2 mobile-spacing">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap flex-shrink-0 text-xs px-3 py-1 mobile-button"
                >
                  <span className="mr-1">{category.icon}</span>
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Conteúdo principal */}
      <div className={`${isMobile ? 'px-3 mobile-spacing' : 'container mx-auto px-4'} py-2 sm:py-4`}>
        {/* Header Desktop */}
        {!isMobile && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Cheiro Verde</h1>
                <p className="text-gray-600">Restaurante</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-800">Aberto</span>
                  </div>
                  <p className="text-xs text-gray-600">30-60min</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-800">Pedido mínimo</span>
                  </div>
                  <p className="text-xs text-gray-600">R$ 15,00</p>
                </div>
                <Button
                  onClick={openCartModal}
                  className="relative bg-green-600 hover:bg-green-700"
                >
                  Carrinho
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Filtros de categoria desktop */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  <span className="mr-1">{category.icon}</span>
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Combinações em destaque */}
        <FeaturedCombinations
          products={products.filter(p => p.category === 'pizza').slice(0, 3)}
          onAdd={addToCart}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          getCartItemQuantity={getCartItemQuantity}
          availableFlavors={availablePizzaFlavors}
        />

        {/* Lista de produtos */}
        <div className="space-y-3">
          {filteredProducts.map(item => {
            const quantity = getCartItemQuantity(item.id)
            return (
              <PizzaCard
                key={item.id}
                item={item}
                quantity={quantity}
                onAdd={addToCart}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
                availableFlavors={availablePizzaFlavors}
              />
            )
          })}
        </div>
      </div>

      {/* Modal do carrinho */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={closeCartModal}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />
    </div>
  )
}

export default MenuPage 