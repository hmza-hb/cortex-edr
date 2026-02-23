import type { NextConfig } from "next";
import nextra from "nextra";

const withNextra = nextra({
    // Nextra 4 uses automatic theme resolution and page structure
});

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com'
            }
        ]
    }
};

export default withNextra(nextConfig);
