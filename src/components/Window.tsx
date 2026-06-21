import { useWindowManager, type WindowState } from '../context/WindowManager'

export default function Window({ win }: { win: WindowState }) {
  const { activeId, focusWindow, closeWindow } = useWindowManager()
  const isActive = activeId === win.id

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
        <div className="title-bar-text">{win.title}</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" disabled />
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
      <div className="window-body">{win.content}</div>
    </div>
  )
}
