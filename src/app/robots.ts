import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXTAUTH_URL ??
    ''

  const isPreview =
    !siteUrl ||
    siteUrl.includes('scpreview') ||
    siteUrl.includes('localhost')

  if (isPreview) {
    // Preview bleibt für Google & Co. gesperrt (keine Indexierung der Vorschau),
    // aber SEO-Audit-Tools werden gezielt erlaubt, damit Dennis Checks fahren kann.
    return {
      rules: [
        { userAgent: 'Seobility', allow: '/' },
        { userAgent: 'SEOkicks-Robot', allow: '/' },
        { userAgent: '*', disallow: '/' },
      ],
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
