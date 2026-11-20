import type { CSSProperties } from 'react'

// The DNI Studios logo as an image, with a soft metallic sheen that sweeps
// across it now and then (styles in globals.css → .brand-logo).
const SOURCES = {
  horizontal: { src: '/logo-horizontal.webp?v=3', w: 1402, h: 300 },
  stacked:    { src: '/logo-stacked.webp?v=3',    w: 825,  h: 810 },
  mark:       { src: '/logo-mark-clear.webp?v=4', w: 822,  h: 598 },
} as const

type Props = {
  variant?: keyof typeof SOURCES
  height: number
  alt?: string
  className?: string
}

export default function BrandLogo({ variant = 'horizontal', height, alt = 'DNI Studios', className = '' }: Props) {
  const { src, w, h } = SOURCES[variant]
  const width = Math.round((height * w) / h)
  const style = { width, height, '--logo-src': `url(${src})` } as CSSProperties
  return (
    <span className={`brand-logo ${className}`} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={width} height={height} />
    </span>
  )
}
