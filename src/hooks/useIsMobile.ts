import { useEffect, useState } from 'react'

export const MOBILE_MAX_WIDTH = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MOBILE_MAX_WIDTH,
  )

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_MAX_WIDTH)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return isMobile
}
