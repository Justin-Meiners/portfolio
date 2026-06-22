import { useEffect, useState } from 'react'

export default function ShutDownScreen({ onRestart }: { onRestart: () => void }) {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fullscreen-splash">
      <img src="/assets/shutdown-screen.png" alt="It's now safe to turn off your computer" />
      {showPrompt && (
        <div className="window restart-dialog">
          <div className="title-bar">
            <div className="title-bar-text">Shut Down</div>
          </div>
          <div className="window-body">
            <p style={{ margin: 0 }}>Do you want to start up the computer again?</p>
            <div className="restart-actions">
              <button onClick={onRestart}>Restart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
