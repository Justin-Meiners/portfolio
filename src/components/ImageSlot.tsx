import { useState } from 'react'

interface ImageSlotProps {
  src: string
  alt: string
  width: number
  height: number
}

export default function ImageSlot({ src, alt, width, height }: ImageSlotProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        className="image-slot-placeholder"
        title={`Image slot: ${src}`}
        style={{ width, height }}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      onError={() => setFailed(true)}
    />
  )
}
