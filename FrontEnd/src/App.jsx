import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import HomePage from './pages/HomePage.jsx'
import MenuPage from './pages/MenuPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import { OrderProvider } from './contexts/OrderContext.jsx'
import { AnalyticsProvider } from './contexts/AnalyticsContext.jsx'

function App() {
  return (
    <Router>
      <AnalyticsProvider>
        <CartProvider>
          <OrderProvider>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                </Routes>
              </main>
            </div>
          </OrderProvider>
        </CartProvider>
      </AnalyticsProvider>
    </Router>
  )
}

export default App

