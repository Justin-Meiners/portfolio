import ImageSlot from './ImageSlot'

interface DesktopIconProps {
  label: string
  icon: string
  selected: boolean
  onSelect: () => void
  onOpen: () => void
}

export default function DesktopIcon({
  label,
  icon,
  selected,
  onSelect,
  onOpen,
}: DesktopIconProps) {
  return (
    <div
      className={`desktop-icon${selected ? ' selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onDoubleClick={onOpen}
    >
      <ImageSlot src={icon} alt="" width={32} height={32} />
      <span className="desktop-icon-label">{label}</span>
    </div>
  )
}
