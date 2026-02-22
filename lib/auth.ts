/**
 * Returns the canonical app URL for OAuth redirects.
 * Use NEXT_PUBLIC_APP_URL in production to avoid wrong redirects (e.g. localhost when deployed).
 */
export function getAppUrl(originFromHeaders?: string | null): string {
    const envUrl = process.env.NEXT_PUBLIC_APP_URL
    if (envUrl) {
        return envUrl.replace(/\/$/, '') // strip trailing slash
    }
    if (originFromHeaders) {
        return originFromHeaders
    }
    // Fallback for serverless when origin header is missing
    return process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'
}
