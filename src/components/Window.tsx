import { useLayoutEffect, useRef, useState, type ComponentType, type PointerEvent } from 'react'
import { useWindowManager, type WindowState } from '../context/WindowManager'
import { APP_REGISTRY, type AppParams } from '../apps/registry'
import { DESKTOP_ZOOM } from '../desktopZoom'
import { useIsMobile } from '../hooks/useIsMobile'
import ImageSlot from './ImageSlot'

export default function Window({ win }: { win: WindowState }) {
  const {
    activeId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    moveWindow,
    resizeWindow,
  } = useWindowManager()
  const isActive = activeId === win.id
  const isMobile = useIsMobile()
  const Body: ComponentType<AppParams> = APP_REGISTRY[win.appId]

  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const [resizeState, setResizeState] = useState<{
    height: number
    position: { x: number; y: number }
  } | null>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const autoSizeRef = useRef(win.height === undefined)
  const initialYRef = useRef(win.position.y)
  const lastAutoHeightRef = useRef<number | null>(null)
  const dragRef = useRef<{
    startX: number
    startY: number
    origin: { x: number; y: number }
  } | null>(null)
  const resizeRef = useRef<{
    edge: 'top' | 'bottom'
    startY: number
    originHeight: number
    originPosition: { x: number; y: number }
    contentHeight: number
    latest: {
      height: number
      position: { x: number; y: number }
    }
  } | null>(null)

  const pos = resizeState?.position ?? dragPos ?? win.position
  const height = resizeState?.height ?? win.height

  function getContentHeight() {
    const windowElement = windowRef.current
    const body = windowElement?.querySelector<HTMLElement>('.window-body')
    if (!windowElement || !body) return 140

    const chromeHeight = windowElement.offsetHeight - body.clientHeight
    return chromeHeight + body.scrollHeight
  }

  useLayoutEffect(() => {
    if (isMobile || win.isMaximized || !windowRef.current) return

    const updateHeight = () => {
      if (!autoSizeRef.current) return

      const viewHeight = window.innerHeight / DESKTOP_ZOOM
      const taskbarHeight = 30
      const availableHeight = viewHeight - initialYRef.current - taskbarHeight - 8
      const nextHeight = Math.min(getContentHeight(), availableHeight)

      if (lastAutoHeightRef.current === nextHeight) return
      lastAutoHeightRef.current = nextHeight
      resizeWindow(win.id, nextHeight)
    }

    updateHeight()

    const body = windowRef.current.querySelector<HTMLElement>('.window-body')
    if (!body) return

    const observer = new ResizeObserver(updateHeight)
    observer.observe(body)
    Array.from(body.children).forEach((child) => observer.observe(child))

    return () => observer.disconnect()
  }, [isMobile, resizeWindow, win.id, win.isMaximized])

  function handlePointerDown(e: PointerEvent) {
    if (e.button !== 0) return
    if (isMobile || win.isMaximized) return
    if ((e.target as HTMLElement).closest('.title-bar-controls')) return
    autoSizeRef.current = false
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origin: win.position,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: PointerEvent) {
    const drag = dragRef.current
    if (!drag) return
    const width = win.width ?? 320
    // Pointer deltas are in viewport px; the desktop is zoomed, so scale into desktop px.
    const nextX = drag.origin.x + (e.clientX - drag.startX) / DESKTOP_ZOOM
    const nextY = drag.origin.y + (e.clientY - drag.startY) / DESKTOP_ZOOM
    // Prevent window from being dragged out of view
    const viewW = window.innerWidth / DESKTOP_ZOOM
    const viewH = window.innerHeight / DESKTOP_ZOOM
    const windowHeight = height ?? windowRef.current?.offsetHeight ?? 140
    const x = Math.min(Math.max(nextX, -(width - 120)), viewW - 120)
    const y = Math.min(Math.max(nextY, 0), viewH - 30 - windowHeight - 8)
    setDragPos({ x, y })
  }

  function handleResizePointerDown(edge: 'top' | 'bottom', e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 || !windowRef.current) return
    e.stopPropagation()
    autoSizeRef.current = false
    focusWindow(win.id)
    resizeRef.current = {
      edge,
      startY: e.clientY,
      originHeight: windowRef.current.offsetHeight,
      originPosition: win.position,
      contentHeight: getContentHeight(),
      latest: {
        height: windowRef.current.offsetHeight,
        position: win.position,
      },
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handleResizePointerMove(e: PointerEvent<HTMLDivElement>) {
    const resize = resizeRef.current
    if (!resize) return

    const delta = (e.clientY - resize.startY) / DESKTOP_ZOOM
    const viewHeight = window.innerHeight / DESKTOP_ZOOM
    const desktopBottom = viewHeight - 30 - 8
    const minimumHeight = 140

    if (resize.edge === 'bottom') {
      const maximumHeight = Math.min(
        desktopBottom - resize.originPosition.y,
        resize.contentHeight,
      )
      const nextHeight = Math.min(Math.max(resize.originHeight + delta, minimumHeight), maximumHeight)
      resize.latest = { height: nextHeight, position: resize.originPosition }
      setResizeState(resize.latest)
      return
    }

    const bottom = resize.originPosition.y + resize.originHeight
    const minimumY = Math.max(0, bottom - resize.contentHeight)
    const nextY = Math.min(
      Math.max(resize.originPosition.y + delta, minimumY),
      bottom - minimumHeight,
    )
    resize.latest = {
      height: bottom - nextY,
      position: { x: resize.originPosition.x, y: nextY },
    }
    setResizeState(resize.latest)
  }

  function handleResizePointerUp(e: PointerEvent<HTMLDivElement>) {
    const resize = resizeRef.current
    if (!resize) return
    resizeRef.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
    resizeWindow(win.id, resize.latest.height, resize.latest.position)
    setResizeState(null)
  }

  function handlePointerUp(e: PointerEvent) {
    if (!dragRef.current) return
    dragRef.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
    if (dragPos) {
      moveWindow(win.id, dragPos)
      setDragPos(null)
    }
  }

  return (
    <div
      ref={windowRef}
      className={`window desktop-window${win.isMaximized ? ' maximized' : ''}`}
      onMouseDown={() => focusWindow(win.id)}
      style={{
        position: 'absolute',
        left: win.isMaximized ? 0 : pos.x,
        top: win.isMaximized ? 0 : pos.y,
        zIndex: win.zIndex,
        width: win.isMaximized ? '100%' : (win.width ?? 320),
        height: win.isMaximized ? 'calc(100% - var(--taskbar-height))' : height,
        maxHeight: !win.isMaximized && !height
          ? `calc(100% - ${win.position.y}px - var(--taskbar-height) - 8px)`
          : undefined,
      }}
    >
      {!isMobile && !win.isMaximized && (
        <div
          className="window-resize-edge top"
          onPointerDown={(e) => handleResizePointerDown('top', e)}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
        />
      )}
      <div
        className={`title-bar${isActive ? '' : ' inactive'}`}
        style={{
          cursor: isMobile || win.isMaximized ? 'default' : 'move',
          userSelect: 'none',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {win.icon && <ImageSlot src={win.icon} alt="" width={16} height={16} />}
          <span className="title-bar-text">{win.title}</span>
        </div>
        <div className="title-bar-controls">
          <button
            aria-label="Minimize"
            onClick={(e) => {
              e.stopPropagation()
              minimizeWindow(win.id)
            }}
          />
          <button
            aria-label={win.isMaximized ? 'Restore' : 'Maximize'}
            onClick={(e) => {
              e.stopPropagation()
              autoSizeRef.current = false
              toggleMaximizeWindow(win.id)
            }}
          />
          <button
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation()
              closeWindow(win.id)
            }}
          />
        </div>
      </div>
      <div className="window-body">
        <Body {...win.params} />
      </div>
      {!isMobile && !win.isMaximized && (
        <div
          className="window-resize-edge bottom"
          onPointerDown={(e) => handleResizePointerDown('bottom', e)}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
        />
      )}
    </div>
  )
}
