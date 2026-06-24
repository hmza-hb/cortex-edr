import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://app.cortex-edr.com'

    const routes = [
        { path: '/docs', priority: 0.9, changefreq: 'weekly' },
        { path: '/chat', priority: 0.8, changefreq: 'daily' },
        { path: '/auth', priority: 0.8, changefreq: 'monthly' },
        { path: '/legal/security', priority: 0.5, changefreq: 'monthly' },
        { path: '/legal/privacy', priority: 0.4, changefreq: 'monthly' },
        { path: '/legal/terms', priority: 0.4, changefreq: 'monthly' },
        { path: '/legal/refund', priority: 0.3, changefreq: 'monthly' },
        { path: '/legal/cookies', priority: 0.3, changefreq: 'monthly' },
        { path: '/legal/compliance', priority: 0.3, changefreq: 'monthly' },
    ].map((route) => ({
        url: `${baseUrl}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changefreq as any,
        priority: route.priority,
    }))

    return [...routes]
}
