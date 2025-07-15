import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react'

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Produtos', icon: Package },
  { path: '/admin/orders', label: 'Pedidos', icon: ShoppingCart },
]

export default function AdminNavigation() {
  const location = useLocation()
  const [open, setOpen] = useState(true)

  return (
    <nav className={`fixed top-0 left-0 bg-white border-r border-gray-200 min-h-screen h-full w-64 p-6 flex flex-col transition-all duration-200 z-40 ${open ? '' : 'w-20 p-2'}`}>
      <div className="flex items-center gap-2 mb-10">
        <span className="font-bold text-xl text-green-700">Cheiro Verde</span>
      </div>
      <ul className="flex-1 space-y-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <NavLink
              to={path}
              end={path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {open && <span>{label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
      <button
        className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        onClick={() => {/* implementar logout futuramente */}}
      >
        <LogOut className="w-5 h-5" />
        {open && <span>Sair</span>}
      </button>
    </nav>
  )
} 