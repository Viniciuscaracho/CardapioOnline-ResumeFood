import React from 'react'

const AnimatedCard = ({ 
  children, 
  className = "", 
  onClick,
  hover = true,
  ...props 
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-lg border
        bg-white shadow-sm
        transition-all duration-300 ease-in-out
        ${hover ? `
          hover:shadow-lg hover:scale-105
          hover:border-gray-300
          active:scale-100
        ` : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
      
      {/* Subtle border animation */}
      <div className="absolute inset-0 border-2 border-transparent hover:border-green-200/50 transition-colors duration-300 rounded-lg" />
    </div>
  )
}

export default AnimatedCard 