const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: []
    },
    experimental: {
        serverComponentsExternalPackages: ['@aws-sdk'],
    },
}

module.exports = nextConfig;