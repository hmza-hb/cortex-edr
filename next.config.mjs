import nextra from 'nextra'

const withNextra = nextra({})

export default withNextra({
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com'
        }]
    },
    // In Next.js 15+, resolving virtual modules for MDX often requires this alias
    experimental: {
        turbo: {
            resolveAlias: {
                "next-mdx-import-source-file": "./mdx-components.tsx"
            }
        }
    },
    transpilePackages: ['nextra', 'nextra-theme-docs']
})
