import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import AdminUsersPageClient from './AdminUsersPageClient';

// Admin email whitelist - replace with your admin emails
const ADMIN_EMAILS = [
    'hmza.hb82@gmail.com', // Replace with your actual admin email
    // Add more admin emails as needed
];

function isAdmin(email: string): boolean {
    return ADMIN_EMAILS.includes(email.toLowerCase());
}

export default async function AdminUsersPage() {
    // Server-side authentication and authorization
    const user = await currentUser();

    if (!user) {
        redirect('/login');
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;
    if (!userEmail || !isAdmin(userEmail)) {
        redirect('/dashboard'); // Redirect non-admins to dashboard
    }

    return <AdminUsersPageClient />;
}
