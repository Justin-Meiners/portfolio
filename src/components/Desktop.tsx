import { useEffect } from 'react'
import { useWindowManager, type OpenWindowConfig } from '../context/WindowManager'
import Window from './Window'
import Taskbar from './Taskbar'
import type { StartMenuItem } from './StartMenu'

const welcomeWindow: OpenWindowConfig = {
  id: 'welcome',
  title: 'Welcome',
  icon: '/assets/welcome-icon.png',
  position: { x: 96, y: 72 },
  width: 360,
  content: (
    <div>
      <p style={{ marginTop: 0 }}>Welcome to my portfolio.</p>
      <p style={{ marginBottom: 0 }}>Take a look around.</p>
    </div>
  ),
}

export default function Desktop({ onShutDown }: { onShutDown: () => void }) {
  const { windows, openWindow } = useWindowManager()

  useEffect(() => {
    openWindow(welcomeWindow)
  }, [openWindow])

  const startMenuItems: StartMenuItem[] = [
    {
      id: 'welcome',
      label: 'Welcome',
      icon: '/assets/welcome-icon.png',
      onClick: () => openWindow(welcomeWindow),
    },
    {
      id: 'shutdown',
      label: 'Shut Down...',
      icon: '/assets/shutdown-icon.png',
      onClick: onShutDown,
    },
  ]

  return (
    <div className="desktop">
      {windows
        .filter((w) => !w.isMinimized)
        .map((w) => (
          <Window key={w.id} win={w} />
        ))}
      <Taskbar startMenuItems={startMenuItems} />
    </div>
  )
}
