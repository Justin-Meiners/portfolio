import type { ComponentType } from 'react'
import { useWindowManager, type WindowState } from '../context/WindowManager'
import { APP_REGISTRY } from '../apps/registry'
import ImageSlot from './ImageSlot'

export default function Window({ win }: { win: WindowState }) {
  const { activeId, focusWindow, closeWindow, minimizeWindow } = useWindowManager()
  const isActive = activeId === win.id
  const Body: ComponentType = APP_REGISTRY[win.appId]

  return (
    <div
      className="window"
      onMouseDown={() => focusWindow(win.id)}
      style={{
        position: 'absolute',
        left: win.position.x,
        top: win.position.y,
        zIndex: win.zIndex,
        width: win.width ?? 320,
      }}
    >
      <div className={`title-bar${isActive ? '' : ' inactive'}`}>
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
        <Body />
      </div>
    </div>
  )
}
