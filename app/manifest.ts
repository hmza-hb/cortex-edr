import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Cortex EDR — AI-Powered Code Security Scanner',
        short_name: 'Cortex EDR',
        description: 'Scan your codebase for security vulnerabilities in seconds with a 7-agent AI pipeline.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#a855f7',
        icons: [
            {
                src: '/assets/logo.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/assets/logo.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
