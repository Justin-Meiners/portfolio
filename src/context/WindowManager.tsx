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
  icon?: string
  position: { x: number; y: number }
  width?: number
  zIndex: number
  isMinimized: boolean
}

export interface OpenWindowConfig {
  id: string
  title: string
  content: ReactNode
  icon?: string
  position?: { x: number; y: number }
  width?: number
}

interface WindowManagerContextValue {
  windows: WindowState[]
  activeId: string | null
  openWindow: (config: OpenWindowConfig) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  toggleWindow: (id: string) => void
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(null)

// Highest-stacked visible window, ignoring one id (the one being closed/minimized).
function topMostId(list: WindowState[], excludeId: string): string | null {
  const visible = list.filter((w) => !w.isMinimized && w.id !== excludeId)
  if (visible.length === 0) return null
  return visible.reduce((top, w) => (w.zIndex > top.zIndex ? w : top)).id
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const topZ = useRef(10)

  const focusWindow = useCallback((id: string) => {
    topZ.current += 1
    const z = topZ.current
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: z, isMinimized: false } : w)),
    )
    setActiveId(id)
  }, [])

  const openWindow = useCallback((config: OpenWindowConfig) => {
    topZ.current += 1
    const z = topZ.current
    setWindows((prev) => {
      if (prev.some((w) => w.id === config.id)) {
        return prev.map((w) =>
          w.id === config.id ? { ...w, zIndex: z, isMinimized: false } : w,
        )
      }
      return [
        ...prev,
        {
          id: config.id,
          title: config.title,
          content: config.content,
          icon: config.icon,
          position: config.position ?? { x: 80, y: 80 },
          width: config.width,
          zIndex: z,
          isMinimized: false,
        },
      ]
    })
    setActiveId(config.id)
  }, [])

  const closeWindow = useCallback(
    (id: string) => {
      setWindows((prev) => prev.filter((w) => w.id !== id))
      setActiveId((cur) => (cur === id ? topMostId(windows, id) : cur))
    },
    [windows],
  )

  const minimizeWindow = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
      )
      setActiveId((cur) => (cur === id ? topMostId(windows, id) : cur))
    },
    [windows],
  )

  const toggleWindow = useCallback(
    (id: string) => {
      const win = windows.find((w) => w.id === id)
      if (!win) return
      if (activeId === id && !win.isMinimized) {
        minimizeWindow(id)
      } else {
        focusWindow(id)
      }
    },
    [windows, activeId, minimizeWindow, focusWindow],
  )

  const value = useMemo(
    () => ({
      windows,
      activeId,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      toggleWindow,
    }),
    [
      windows,
      activeId,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      toggleWindow,
    ],
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
