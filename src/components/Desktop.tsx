import { useEffect, useState } from 'react'
import { useWindowManager, type OpenWindowConfig } from '../context/WindowManager'
import Window from './Window'
import Taskbar from './Taskbar'
import DesktopIcon from './DesktopIcon'
import type { StartMenuItem } from './StartMenu'

const welcomeWindow: OpenWindowConfig = {
  id: 'welcome',
  title: 'Welcome',
  icon: '/assets/welcome-icon.png',
  appId: 'welcome',
  position: { x: 96, y: 72 },
  width: 360,
}

interface DesktopIconConfig {
  id: string
  label: string
  icon: string
  window: OpenWindowConfig
}

const desktopIcons: DesktopIconConfig[] = [
  {
    id: 'my-computer',
    label: 'My Computer',
    icon: '/assets/my-computer-icon.png',
    window: {
      id: 'my-computer',
      title: 'My Computer',
      icon: '/assets/my-computer-icon.png',
      appId: 'my-computer',
      position: { x: 180, y: 90 },
      width: 360,
    },
  },
  {
    id: 'about',
    label: 'About Me',
    icon: '/assets/about-icon.png',
    window: {
      id: 'about',
      title: 'About Me',
      icon: '/assets/about-icon.png',
      appId: 'about',
      position: { x: 130, y: 130 },
      width: 440,
    },
  },
  {
    id: 'recycle-bin',
    label: 'Recycle Bin',
    icon: '/assets/recycle-bin-icon.png',
    window: {
      id: 'recycle-bin',
      title: 'Recycle Bin',
      icon: '/assets/recycle-bin-icon.png',
      appId: 'recycle-bin',
      position: { x: 230, y: 170 },
      width: 360,
    },
  },
]

export default function Desktop({ onShutDown }: { onShutDown: () => void }) {
  const { windows, openWindow } = useWindowManager()
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)

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
    <div className="desktop" onClick={() => setSelectedIcon(null)}>
      <div className="desktop-icons">
        {desktopIcons.map((entry) => (
          <DesktopIcon
            key={entry.id}
            label={entry.label}
            icon={entry.icon}
            selected={selectedIcon === entry.id}
            onSelect={() => setSelectedIcon(entry.id)}
            onOpen={() => openWindow(entry.window)}
          />
        ))}
      </div>

      {windows
        .filter((w) => !w.isMinimized)
        .map((w) => (
          <Window key={w.id} win={w} />
        ))}

      <Taskbar startMenuItems={startMenuItems} />
    </div>
  )
}
