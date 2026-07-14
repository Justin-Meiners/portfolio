import { useEffect, useState } from 'react'

const MOBILE_MAX_WIDTH = 768

function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(
    () => window.innerWidth < MOBILE_MAX_WIDTH,
  )
  useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth < MOBILE_MAX_WIDTH)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return isSmall
}

export default function MobileGate() {
  const isSmall = useIsSmallScreen()
  const [entered, setEntered] = useState(false)

  if (!isSmall || entered) return null

  return (
    <div className="mobile-gate">
      <div className="window mobile-gate-dialog">
        <div className="title-bar">
          <div className="title-bar-text">Notice</div>
        </div>
        <div className="window-body">
          <p style={{ marginTop: 0 }}>
            Turn your phone horizontally if you want a better experience!
          </p>
          <div className="mobile-gate-actions">
            <button onClick={() => setEntered(true)}>Enter anyway</button>
          </div>
        </div>
      </div>
    </div>
  )
}
