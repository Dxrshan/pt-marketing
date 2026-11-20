import type { MetadataRoute } from 'next'

const SITE = 'https://www.dnianalytics.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/offer`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
