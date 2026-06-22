import { useEffect, useState } from 'react'
import { useWindowManager } from '../context/WindowManager'
import ImageSlot from './ImageSlot'
import StartMenu, { type StartMenuItem } from './StartMenu'
import './taskbar.css'

export default function Taskbar({ startMenuItems }: { startMenuItems: StartMenuItem[] }) {
  const { windows, activeId, toggleWindow } = useWindowManager()
  const [startOpen, setStartOpen] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

  return (
    <div className="taskbar">
      <button
        className={`start-button${startOpen ? ' active' : ''}`}
        onClick={() => setStartOpen((open) => !open)}
      >
        <ImageSlot src="/assets/windows-icon.png" alt="" width={20} height={18} />
        <span>Start</span>
      </button>

      <div className="taskbar-divider" />

      <div className="taskbar-windows">
        {windows.map((win) => (
          <button
            key={win.id}
            className={`taskbar-button${
              activeId === win.id && !win.isMinimized ? ' active' : ''
            }`}
            onClick={() => toggleWindow(win.id)}
          >
            {win.icon && (
              <ImageSlot src={win.icon} alt="" width={16} height={16} />
            )}
            <span className="taskbar-button-label">{win.title}</span>
          </button>
        ))}
      </div>

      <div className="taskbar-tray">{time}</div>

      {startOpen && (
        <StartMenu items={startMenuItems} onClose={() => setStartOpen(false)} />
      )}
    </div>
  )
}
