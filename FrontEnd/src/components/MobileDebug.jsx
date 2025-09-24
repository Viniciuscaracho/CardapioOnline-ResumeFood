import React from 'react'
import { useDeviceInfo, useTouchSimulation } from '../hooks/use-mobile'

export function MobileDebug() {
  const deviceInfo = useDeviceInfo()
  const { isTouchSimulated, enableTouchSimulation, disableTouchSimulation } = useTouchSimulation()

  if (process.env.NODE_ENV === 'production') {
    return null // Não mostrar em produção
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <h3 className="font-bold mb-2">📱 Mobile Debug</h3>
      
      <div className="space-y-1">
        <div>
          <strong>Device:</strong> {deviceInfo.isMobile ? '📱 Mobile' : deviceInfo.isTablet ? '📱 Tablet' : '💻 Desktop'}
        </div>
        
        <div>
          <strong>Orientation:</strong> {deviceInfo.orientation === 'portrait' ? '📱 Portrait' : '🔄 Landscape'}
        </div>
        
        <div>
          <strong>Screen:</strong> {deviceInfo.screenSize.width} × {deviceInfo.screenSize.height}
        </div>
        
        <div className="mt-3">
          <button
            onClick={isTouchSimulated ? disableTouchSimulation : enableTouchSimulation}
            className={`px-2 py-1 rounded text-xs ${
              isTouchSimulated 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isTouchSimulated ? 'Disable' : 'Enable'} Touch Simulation
          </button>
        </div>
        
        <div className="mt-2 text-xs opacity-70">
          <div>User Agent:</div>
          <div className="break-all">{deviceInfo.userAgent.substring(0, 50)}...</div>
        </div>
      </div>
    </div>
  )
} 