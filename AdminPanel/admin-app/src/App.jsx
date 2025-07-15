import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AdminNavigation from './components/AdminNavigation'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import './index.css'
import { NotificationProvider, useNotifications } from './contexts/NotificationContext'
import NotificationModal from './components/NotificationModal'

function GlobalNotificationModal() {
  const { modalOrder, closeModal } = useNotifications()
  return (
    <NotificationModal
      order={modalOrder}
      onClose={closeModal}
    />
  )
}

function AppRoutes() {
  return (
    <>
      <GlobalNotificationModal />
      <div className="flex min-h-screen">
        <AdminNavigation />
        <main className="flex-1 p-8 bg-gray-50 ml-64 min-h-screen transition-all duration-200">
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

function App() {
  return (
    <NotificationProvider>
      <Router>
        <AppRoutes />
      </Router>
    </NotificationProvider>
  )
}

export default App 