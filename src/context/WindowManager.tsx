import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export interface WindowState {
  id: string
  title: string
  content: ReactNode
  position: { x: number; y: number }
  width?: number
  zIndex: number
}

export interface OpenWindowConfig {
  id: string
  title: string
  content: ReactNode
  position?: { x: number; y: number }
  width?: number
}

interface WindowManagerContextValue {
  windows: WindowState[]
  activeId: string | null
  openWindow: (config: OpenWindowConfig) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(null)

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const topZ = useRef(10)

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      if (!prev.some((w) => w.id === id)) return prev
      topZ.current += 1
      return prev.map((w) => (w.id === id ? { ...w, zIndex: topZ.current } : w))
    })
    setActiveId(id)
  }, [])

  const openWindow = useCallback((config: OpenWindowConfig) => {
    setWindows((prev) => {
      if (prev.some((w) => w.id === config.id)) return prev
      topZ.current += 1
      return [
        ...prev,
        {
          id: config.id,
          title: config.title,
          content: config.content,
          position: config.position ?? { x: 80, y: 80 },
          width: config.width,
          zIndex: topZ.current,
        },
      ]
    })
    setActiveId(config.id)
  }, [])

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
    setActiveId((cur) => (cur === id ? null : cur))
  }, [])

  const value = useMemo(
    () => ({ windows, activeId, openWindow, closeWindow, focusWindow }),
    [windows, activeId, openWindow, closeWindow, focusWindow],
  )

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWindowManager() {
  const ctx = useContext(WindowManagerContext)
  if (!ctx) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider')
  }
  return ctx
}
