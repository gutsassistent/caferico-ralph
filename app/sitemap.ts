import type { MetadataRoute } from 'next'

const BASE_URL = 'https://caferico.be'
const LOCALES = ['nl', 'en', 'fr', 'es'] as const
const DEFAULT_LOCALE = 'nl'

function localizedEntry(
  path: string,
  options: {
    changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency']
    priority?: number
    lastModified?: Date
  } = {}
): MetadataRoute.Sitemap[number] {
  const { changeFrequency = 'monthly', priority = 0.5, lastModified = new Date() } = options

  const languages: Record<string, string> = {}
  for (const locale of LOCALES) {
    languages[locale === 'nl' ? 'nl-BE' : locale === 'fr' ? 'fr-BE' : locale] =
      `${BASE_URL}/${locale}${path}`
  }
  languages['x-default'] = `${BASE_URL}/${DEFAULT_LOCALE}${path}`

  return {
    url: `${BASE_URL}/${DEFAULT_LOCALE}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    localizedEntry('', { changeFrequency: 'weekly', priority: 1.0 }),
    localizedEntry('/shop', { changeFrequency: 'weekly', priority: 0.9 }),
    localizedEntry('/subscriptions', { changeFrequency: 'weekly', priority: 0.8 }),
    localizedEntry('/about', { changeFrequency: 'monthly', priority: 0.7 }),
    localizedEntry('/blog', { changeFrequency: 'weekly', priority: 0.7 }),
    localizedEntry('/contact', { changeFrequency: 'monthly', priority: 0.6 }),
    localizedEntry('/faq', { changeFrequency: 'monthly', priority: 0.6 }),
    localizedEntry('/verkooppunten', { changeFrequency: 'monthly', priority: 0.6 }),
  ]

  const productSlugs = [
    'mild-light-roast',
    'intens-medium-roast',
    'espresso-dark-roast',
    'decaf',
    'proefpakket',
    'hervulbaar-tonnetje',
  ]
  const productPages = productSlugs.map((slug) =>
    localizedEntry(`/shop/${slug}`, { changeFrequency: 'weekly', priority: 0.8 })
  )

  const blogSlugs = [
    'slow-roast',
    'origin-stories',
    'brewing-rituals',
    'belgian-coffee-culture',
    'water-quality',
  ]
  const blogPages = blogSlugs.map((slug) =>
    localizedEntry(`/blog/${slug}`, { changeFrequency: 'monthly', priority: 0.5 })
  )

  return [...staticPages, ...productPages, ...blogPages]
}
