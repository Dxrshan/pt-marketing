import type { CSSProperties } from 'react'

// The DNI Studios logo as an image, with a soft metallic sheen that sweeps
// across it now and then (styles in globals.css → .brand-logo).
const SOURCES = {
  horizontal: { src: '/logo-horizontal.webp', w: 1529, h: 300 },
  stacked:    { src: '/logo-stacked.webp',    w: 973,  h: 817 },
  mark:       { src: '/logo-mark-clear.webp', w: 412,  h: 300 },
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
