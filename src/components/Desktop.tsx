import { useEffect } from 'react'
import { useWindowManager } from '../context/WindowManager'
import Window from './Window'

export default function Desktop() {
  const { windows, openWindow } = useWindowManager()

  useEffect(() => {
    openWindow({
      id: 'welcome',
      title: 'Welcome',
      position: { x: 96, y: 72 },
      width: 360,
      content: (
        <div>
          <p style={{ marginTop: 0 }}>
            Welcome to my portfolio.
          </p>
          <p style={{ marginBottom: 0 }}>Take a look around.</p>
        </div>
      ),
    })
  }, [openWindow])

  return (
    <div className="desktop">
      {windows.map((w) => (
        <Window key={w.id} win={w} />
      ))}
    </div>
  )
}
