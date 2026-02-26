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
    turbopack: {
        resolveAlias: {
            "next-mdx-import-source-file": "./mdx-components",
        },
    },
};

export default withNextra(nextConfig);
