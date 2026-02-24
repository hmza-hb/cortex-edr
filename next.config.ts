import type { NextConfig } from "next";
import nextra from "nextra";
import { resolve } from "path";

const withNextra = nextra({});

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
        ],
    },
    turbopack: {
        resolveAlias: {
            "next-mdx-import-source-file": [
                "private-next-root-dir/mdx-components",
                "private-next-root-dir/src/mdx-components",
                "@/mdx-components",
            ],
        },
    },
};

export default withNextra(nextConfig);
