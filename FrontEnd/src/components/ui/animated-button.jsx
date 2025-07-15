import React from 'react'
import { Button } from './button.jsx'

const AnimatedButton = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "", 
  onClick, 
  disabled = false,
  loading = false,
  icon: Icon,
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden
        transition-all duration-200 ease-in-out
        hover:scale-105 active:scale-95
        hover:shadow-lg active:shadow-md
        transform-gpu
        ${loading ? 'cursor-not-allowed opacity-75' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Ripple effect */}
      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-200 rounded-md" />
      
      {/* Content */}
      <div className="relative flex items-center space-x-2">
        {Icon && (
          <Icon className={`
            w-4 h-4 transition-transform duration-200
            ${loading ? 'animate-spin' : 'hover:rotate-12'}
          `} />
        )}
        
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Carregando...</span>
          </div>
        ) : (
          <span className="transition-all duration-200">{children}</span>
        )}
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 transform -skew-x-12" />
    </Button>
  )
}

export default AnimatedButton 