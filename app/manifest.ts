import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DNI Studios',
    short_name: 'DNI Studios',
    description: 'Studio management software for personal trainers.',
    start_url: '/',
    display: 'browser',
    background_color: '#0b0c0f',
    theme_color: '#111318',
    icons: [
      { src: '/icon-192.png?v=4', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png?v=4', sizes: '512x512', type: 'image/png' },
    ],
  }
}
