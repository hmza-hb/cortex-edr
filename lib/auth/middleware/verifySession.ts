import { NextRequest } from 'next/server';
import { extractToken } from './extractToken';

/**
 * Verifies a session natively within Edge/API routes returning boolean or user context.
 */
export async function verifySession(req: NextRequest) {
    try {
        const token = await extractToken(req);
        if (!token) return null;
        
        return {
            id: token.id as string,
            email: token.email as string,
            name: token.name as string
        };
    } catch(err) {
        return null;
    }
}
