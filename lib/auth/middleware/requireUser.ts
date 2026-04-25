import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from './verifySession';
import { createAuditLog } from '@/lib/security/auditLog';

/**
 * Higher-order function to protect API routes with user authentication
 */
export function requireUser(handler: (req: NextRequest, user: { id: string, email: string }) => Promise<Response>) {
    return async (req: NextRequest) => {
        const user = await verifySession(req);
        
        if (!user) {
            await createAuditLog({
                action: 'api_access_blocked',
                actor_id: 'anonymous',
                resource_type: 'api_route',
                resource_id: new URL(req.url).pathname,
                status: 'denied'
            });
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        return handler(req, user);
    };
}
