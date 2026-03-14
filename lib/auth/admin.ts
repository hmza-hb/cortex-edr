import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

const ADMIN_EMAILS = [
    'hmza.hb82@gmail.com',
    'support@cortex-edr.com',
    'hamza-hafeez82@github.com' // Fallback for GitHub OAuth if needed
];

export function isAdmin(email: string | null | undefined): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email.toLowerCase());
}

export async function getAdminSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;
    if (!isAdmin(session.user.email)) return null;
    return session;
}
