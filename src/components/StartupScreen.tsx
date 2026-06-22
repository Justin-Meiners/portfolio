import { useEffect } from 'react'

export default function StartupScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2500)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="fullscreen-splash">
      <img src="/assets/startup-screen.png" alt="Starting Windows 98" />
    </div>
  )
}
