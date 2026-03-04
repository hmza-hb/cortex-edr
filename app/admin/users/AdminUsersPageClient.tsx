'use client';

import { useState, useEffect } from 'react';
import { TierId } from '@/lib/config/system';

interface User {
    email: string;
    plan_tier: string;
    scans_remaining: number;
    created_at: string;
    updated_at: string;
}

export default function AdminUsersPageClient() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const tiers = Object.values(TierId).map(tier => tier.toLowerCase());

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            const data = await response.json();

            if (data.success) {
                setUsers(data.users);
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to fetch users' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error' });
        } finally {
            setLoading(false);
        }
    };

    const updateUserTier = async (email: string, newTier: string) => {
        setUpdating(email);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: email,
                    newTier: newTier
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                // Update the local state
                setUsers(users.map(user =>
                    user.email === email
                        ? { ...user, plan_tier: newTier, updated_at: new Date().toISOString() }
                        : user
                ));
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update user' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error' });
        } finally {
            setUpdating(null);
        }
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'vibe_coder': return 'bg-gray-100 text-gray-800';
            case 'developer': return 'bg-blue-100 text-blue-800';
            case 'teams': return 'bg-purple-100 text-purple-800';
            case 'enterprise': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

                    {message && (
                        <div className={`mb-6 p-4 rounded-lg ${
                            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Current Tier
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Scans Remaining
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Updated
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.email}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierColor(user.plan_tier)}`}>
                                                {user.plan_tier.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.scans_remaining}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.updated_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <select
                                                value={user.plan_tier}
                                                onChange={(e) => updateUserTier(user.email, e.target.value)}
                                                disabled={updating === user.email}
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                            >
                                                {tiers.map((tier) => (
                                                    <option key={tier} value={tier}>
                                                        {tier.replace('_', ' ').toUpperCase()}
                                                    </option>
                                                ))}
                                            </select>
                                            {updating === user.email && (
                                                <span className="ml-2 text-blue-600">Updating...</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No users found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
