import nextra from 'nextra'

const withNextra = nextra({
    theme: 'nextra-theme-docs',
    themeConfig: './theme.config.tsx'
})

export default withNextra({
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com'
        }]
    },
    // Disabling Turbopack for building if it's causing issues with virtual modules
    // In Next.js 15+, you might need to use Webpack explicitly for some ESM packages
    transpilePackages: ['nextra', 'nextra-theme-docs']
})
