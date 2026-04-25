import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from './verifySession';
import { isAdmin } from '@/lib/auth/admin';
import { createAuditLog } from '@/lib/security/auditLog';

/**
 * Higher-order function to protect API routes with admin authentication
 */
export function requireAdmin(handler: (req: NextRequest, user: { id: string, email: string }) => Promise<Response>) {
    return async (req: NextRequest) => {
        const user = await verifySession(req);
        
        if (!user || user.email === undefined) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        if (!isAdmin(user.email)) {
             await createAuditLog({
                action: 'admin_access_blocked',
                actor_id: user.id,
                actor_email: user.email,
                resource_type: 'admin_route',
                resource_id: new URL(req.url).pathname,
                status: 'denied'
            });
            return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
        }
        
        return handler(req, user);
    };
}
