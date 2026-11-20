import type { MetadataRoute } from 'next'

const SITE = 'https://www.dnianalytics.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/offer`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/legal/terms-of-service`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE}/legal/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE}/legal/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE}/legal/dpa`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
