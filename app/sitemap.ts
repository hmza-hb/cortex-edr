import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://cortex-edr.com'

    const routes = [
        { path: '', priority: 1.0, changefreq: 'daily' },
        { path: '/features', priority: 0.9, changefreq: 'weekly' },
        { path: '/pricing', priority: 0.8, changefreq: 'weekly' },
        { path: '/login', priority: 0.7, changefreq: 'monthly' },
        { path: '/legal/security', priority: 0.6, changefreq: 'daily' },
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
