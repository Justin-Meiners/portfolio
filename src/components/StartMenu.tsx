import ImageSlot from './ImageSlot'

export interface StartMenuItem {
  id: string
  label: string
  icon?: string
  onClick: () => void
}

interface StartMenuProps {
  items: StartMenuItem[]
  onClose: () => void
}

export default function StartMenu({ items, onClose }: StartMenuProps) {
  return (
    <>
      <div className="start-menu-backdrop" onClick={onClose} />
      <div className="start-menu">
        <div className="start-menu-banner">
          <span>Portfolio</span>
        </div>
        <ul className="start-menu-items">
          {items.map((item) => (
            <li
              key={item.id}
              className="start-menu-item"
              onClick={() => {
                item.onClick()
                onClose()
              }}
            >
              <span className="start-menu-item-icon">
                {item.icon && (
                  <ImageSlot src={item.icon} alt="" width={24} height={24} />
                )}
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
