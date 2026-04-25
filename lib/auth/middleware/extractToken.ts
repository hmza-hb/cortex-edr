import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Extracts and decodes the JWT token from the incoming request.
 */
export async function extractToken(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
        throw new Error('NEXTAUTH_SECRET is not configured');
    }
    
    // getToken decodes the JWT from the cookie using the secret
    return await getToken({ req, secret });
}
