import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange);
  }, [])

  return !!isMobile
}

// Hook expandido para mais funcionalidades mobile
export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = React.useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    orientation: 'portrait',
    screenSize: { width: 0, height: 0 },
    userAgent: ''
  })

  React.useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setDeviceInfo({
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isDesktop: width >= TABLET_BREAKPOINT,
        orientation: width > height ? 'landscape' : 'portrait',
        screenSize: { width, height },
        userAgent: navigator.userAgent
      })
    }

    updateDeviceInfo()
    window.addEventListener('resize', updateDeviceInfo)
    window.addEventListener('orientationchange', updateDeviceInfo)

    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
    }
  }, [])

  return deviceInfo
}

// Hook para simular touch events em desktop
export function useTouchSimulation() {
  const [isTouchSimulated, setIsTouchSimulated] = React.useState(false)

  const enableTouchSimulation = () => {
    setIsTouchSimulated(true)
    // Adiciona classe CSS para simular touch
    document.body.classList.add('touch-simulation')
  }

  const disableTouchSimulation = () => {
    setIsTouchSimulated(false)
    document.body.classList.remove('touch-simulation')
  }

  return {
    isTouchSimulated,
    enableTouchSimulation,
    disableTouchSimulation
  }
}
