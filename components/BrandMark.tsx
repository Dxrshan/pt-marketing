// The DNI Studios "D" mark (transparent), sized by height.
export default function BrandMark({ height = 28 }: { height?: number }) {
  const width = Math.round((height * 256) / 187)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/dni-studios-mark.webp" alt="" width={width} height={height} style={{ display: 'block', flexShrink: 0 }} />
  )
}
