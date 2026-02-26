import nextra from "nextra";

const withNextra = nextra({});

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https" as const,
                hostname: "avatars.githubusercontent.com",
            },
        ],
    },
    // Next.js 15+ uses top-level turbo config
    turbo: {
        resolveAlias: {
            "next-mdx-import-source-file": [
                "./mdx-components.tsx",
                "./mdx-components",
                "mdx-components.tsx"
            ],
        },
    },
};

export default withNextra(nextConfig);
