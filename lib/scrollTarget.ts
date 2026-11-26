// Where to scroll for an in-page section link. Scroll-animated sections (sticky,
// several screens tall) start blank and reveal their content as you scroll through
// them, so landing on their top shows an empty screen. They set data-scroll-at to
// the point (0–1 through the animation) worth landing on; others land on their top.
export function sectionScrollTop(el: HTMLElement): number {
  const top = el.getBoundingClientRect().top + window.scrollY
  const at = Number(el.dataset.scrollAt)
  if (!at) return top
  return top + at * Math.max(el.offsetHeight - window.innerHeight, 0)
}

type Lenis = { scrollTo: (target: number, opts?: { duration?: number; immediate?: boolean }) => void }

export function scrollToSection(el: HTMLElement, opts: { immediate?: boolean } = {}) {
  const top = sectionScrollTop(el)
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
  if (lenis) lenis.scrollTo(top, opts.immediate ? { immediate: true } : { duration: 1.8 })
  else window.scrollTo({ top, behavior: opts.immediate ? 'auto' : 'smooth' })
}
