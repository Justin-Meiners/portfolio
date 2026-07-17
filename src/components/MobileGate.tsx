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
            This portfolio is better viewed on a desktop, but you can still view this on mobile if you wanna check it out.
            If you ever want the full experience, check back in on a bigger screen!
          </p>
          <div className="mobile-gate-actions">
            <button onClick={() => setEntered(true)}>Enter anyway</button>
          </div>
        </div>
      </div>
    </div>
  )
}
