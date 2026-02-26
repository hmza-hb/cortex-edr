import nextra from 'nextra'

const withNextra = nextra({})

export default withNextra({
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com'
        }]
    },
    turbopack: {
        resolveAlias: {
            "next-mdx-import-source-file": "./mdx-components.tsx"
        }
    },
    transpilePackages: ['nextra', 'nextra-theme-docs']
})
