'use client';

import { useState, useEffect } from 'react';
import { TierId } from '@/lib/config/system';

interface User {
    email: string;
    plan_tier: string;
    scans_remaining: number;
    created_at: string;
    updated_at: string;
    id: string;
    payment_status?: string;
    payment_amount?: number;
    payment_date?: string | null;
    payment_method?: string;
    payment_verified_by?: string | null;
    payment_notes?: string;
    billing_cycle?: string;
}

export default function AdminUsersPageClient() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleting, setDeleting] = useState<string | null>(null);
    const [paymentFilter, setPaymentFilter] = useState<string>('all');

    const tiers = Object.values(TierId).map(tier => tier.toLowerCase());

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        // Filter users based on search term and payment status
        let filtered = users.filter(user => 
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.plan_tier.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Apply payment filter
        if (paymentFilter !== 'all') {
            filtered = filtered.filter(user => (user.payment_status || 'unpaid') === paymentFilter);
        }
        
        setFilteredUsers(filtered);
    }, [searchTerm, users, paymentFilter]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            const data = await response.json();

            if (data.success) {
                setUsers(data.users);
                setFilteredUsers(data.users);
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

    const deleteUser = async (email: string) => {
        if (!confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
            return;
        }

        setDeleting(email);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'delete_user',
                    userEmail: email
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                // Remove user from local state
                setUsers(users.filter(user => user.email !== email));
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to delete user' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error' });
        } finally {
            setDeleting(null);
        }
    };

    const resetUserScans = async (email: string, tier: string) => {
        setUpdating(email);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'reset_scans',
                    userEmail: email,
                    newTier: tier
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                fetchUsers(); // Refresh to get updated scan count
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to reset scans' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error' });
        } finally {
            setUpdating(null);
        }
    };

    const verifyPayment = async (email: string, amount: number, method: string, notes: string = '') => {
        setUpdating(email);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'verify_payment',
                    userEmail: email,
                    paymentAmount: amount,
                    paymentMethod: method,
                    notes: notes,
                    billingCycle: 'monthly'
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                fetchUsers(); // Refresh to get updated payment info
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to verify payment' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error' });
        } finally {
            setUpdating(null);
        }
    };

    const rejectPayment = async (email: string, notes: string = '') => {
        setUpdating(email);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'reject_payment',
                    userEmail: email,
                    notes: notes
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                fetchUsers(); // Refresh to get updated payment info
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to reject payment' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error' });
        } finally {
            setUpdating(null);
        }
    };

    const markPaymentPending = async (email: string, amount: number, method: string = 'manual', notes: string = '') => {
        setUpdating(email);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'mark_pending',
                    userEmail: email,
                    paymentAmount: amount,
                    paymentMethod: method,
                    notes: notes
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                fetchUsers(); // Refresh to get updated payment info
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to mark payment as pending' });
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

    const getPaymentStatusColor = (status?: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'unpaid': return 'bg-red-100 text-red-800';
            case 'expired': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const paidUsersCount = users.filter(u => u.payment_status === 'paid').length;
    const pendingUsersCount = users.filter(u => u.payment_status === 'pending').length;

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
                    {/* Header with stats */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                            <div className="flex gap-6 mt-2">
                                <span className="text-sm text-gray-600">
                                    Total Users: <span className="font-bold text-gray-900">{users.length}</span>
                                </span>
                                <span className="text-sm text-gray-600">
                                    Filtered: <span className="font-bold text-gray-900">{filteredUsers.length}</span>
                                </span>
                                <span className="text-sm text-gray-600">
                                    Paid: <span className="font-bold text-green-600">{paidUsersCount}</span>
                                </span>
                                <span className="text-sm text-gray-600">
                                    Pending: <span className="font-bold text-yellow-600">{pendingUsersCount}</span>
                                </span>
                            </div>
                        </div>
                        
                        {/* Search and filter */}
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Search users by email or tier..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                            />
                            
                            <select
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                            >
                                <option value="all">All Payment Status</option>
                                <option value="paid">Paid Users</option>
                                <option value="pending">Pending Users</option>
                                <option value="unpaid">Unpaid Users</option>
                                <option value="expired">Expired Users</option>
                            </select>
                        </div>
                    </div>

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
                                        #
                                    </th>
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
                                        Payment Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user, index) => (
                                    <tr key={user.email} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <div>
                                                <div>{user.email}</div>
                                                <div className="text-xs text-gray-500">ID: {user.id.substring(0, 8)}...</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierColor(user.plan_tier)}`}>
                                                {user.plan_tier.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.scans_remaining}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(user.payment_status || 'unpaid')}`}>
                                                {(user.payment_status || 'unpaid').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${user.payment_amount || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.payment_date ? new Date(user.payment_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={user.plan_tier}
                                                        onChange={(e) => updateUserTier(user.email, e.target.value)}
                                                        disabled={updating === user.email}
                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-900 bg-white"
                                                    >
                                                        {tiers.map((tier) => (
                                                            <option key={tier} value={tier}>
                                                                {tier.replace('_', ' ').toUpperCase()}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    
                                                    <button
                                                        onClick={() => resetUserScans(user.email, user.plan_tier)}
                                                        disabled={updating === user.email}
                                                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                                                        title="Reset scans to tier limit"
                                                    >
                                                        Reset
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => deleteUser(user.email)}
                                                        disabled={deleting === user.email}
                                                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
                                                        title="Delete user"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                                
                                                {/* Payment Actions */}
                                                <div className="flex items-center gap-2">
                                                    {(user.payment_status || 'unpaid') === 'unpaid' && (
                                                        <button
                                                            onClick={() => {
                                                                const amount = prompt('Enter payment amount:');
                                                                const method = prompt('Enter payment method (bank_transfer/crypto/manual):');
                                                                if (amount && method) {
                                                                    verifyPayment(user.email, parseFloat(amount), method);
                                                                }
                                                            }}
                                                            disabled={updating === user.email}
                                                            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
                                                            title="Verify payment"
                                                        >
                                                            Verify
                                                        </button>
                                                    )}
                                                    
                                                    {(user.payment_status || 'unpaid') === 'unpaid' && (
                                                        <button
                                                            onClick={() => {
                                                                const amount = prompt('Enter payment amount:');
                                                                if (amount) {
                                                                    markPaymentPending(user.email, parseFloat(amount));
                                                                }
                                                            }}
                                                            disabled={updating === user.email}
                                                            className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300"
                                                            title="Mark as pending"
                                                        >
                                                            Pending
                                                        </button>
                                                    )}
                                                    
                                                    {(user.payment_status === 'paid' || user.payment_status === 'pending') && (
                                                        <button
                                                            onClick={() => {
                                                                const reason = prompt('Reason for rejection:');
                                                                if (reason) {
                                                                    rejectPayment(user.email, reason);
                                                                }
                                                            }}
                                                            disabled={updating === user.email}
                                                            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
                                                            title="Reject payment"
                                                        >
                                                            Reject
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                {updating === user.email && (
                                                    <span className="text-blue-600 text-xs">Updating...</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            {searchTerm ? 'No users found matching your search' : 'No users found'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
