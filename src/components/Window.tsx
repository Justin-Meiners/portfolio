import { useRef, useState, type ComponentType, type PointerEvent } from 'react'
import { useWindowManager, type WindowState } from '../context/WindowManager'
import { APP_REGISTRY, type AppParams } from '../apps/registry'
import ImageSlot from './ImageSlot'

export default function Window({ win }: { win: WindowState }) {
  const { activeId, focusWindow, closeWindow, minimizeWindow, moveWindow } =
    useWindowManager()
  const isActive = activeId === win.id
  const Body: ComponentType<AppParams> = APP_REGISTRY[win.appId]

  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const dragRef = useRef<{
    startX: number
    startY: number
    origin: { x: number; y: number }
  } | null>(null)

  const pos = dragPos ?? win.position

  function handlePointerDown(e: PointerEvent) {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest('.title-bar-controls')) return
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
    const nextX = drag.origin.x + (e.clientX - drag.startX)
    const nextY = drag.origin.y + (e.clientY - drag.startY)
    // Prevent window from being dragged out of view
    const x = Math.min(Math.max(nextX, -(width - 120)), window.innerWidth - 120)
    const y = Math.min(Math.max(nextY, 0), window.innerHeight - 40)
    setDragPos({ x, y })
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
      className="window"
      onMouseDown={() => focusWindow(win.id)}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        zIndex: win.zIndex,
        width: win.width ?? 320,
      }}
    >
      <div
        className={`title-bar${isActive ? '' : ' inactive'}`}
        style={{ cursor: 'move', userSelect: 'none' }}
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
          <button aria-label="Maximize" disabled />
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
    </div>
  )
}
