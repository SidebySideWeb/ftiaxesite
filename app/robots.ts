import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Use Vercel URL in production, fallback to default
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://ftiaxesite.gr')

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

