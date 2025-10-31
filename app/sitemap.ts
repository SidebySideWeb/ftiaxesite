import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Use Vercel URL in production, fallback to default
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://ftiaxesite.gr')

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/#features`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#process`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // TODO: Add dynamic routes from Payload CMS if needed
  // Example:
  // const pages = await fetchPagesFromCMS()
  // const dynamicRoutes = pages.map((page) => ({
  //   url: `${baseUrl}/${page.slug}`,
  //   lastModified: page.updatedAt,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.8,
  // }))

  return routes
}

