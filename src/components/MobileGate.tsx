import { useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

export default function MobileGate() {
  const isMobile = useIsMobile()
  const [entered, setEntered] = useState(false)

  if (!isMobile || entered) return null

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
