import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

interface Stats {
    total_members: number;
    active_memberships: number;
    total_packages: number;
    monthly_revenue: number;
}

interface Transaction {
    id: number;
    transaction_id: string;
    amount: number;
    status: string;
    created_at: string;
    user: {
        name: string;
        email: string;
    };
    subscription_package: {
        name: string;
    };
}

interface Membership {
    id: number;
    status: string;
    started_at: string;
    expires_at: string;
    user: {
        name: string;
        email: string;
    };
    subscription_package: {
        name: string;
        price: number;
    };
}

interface Props {
    stats: Stats;
    recent_transactions: Transaction[];
    recent_memberships: Membership[];
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/dashboard',
    },
];

export default function AdminDashboard({ stats, recent_transactions, recent_memberships }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            expired: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
            paid: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
        };
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">🎛️ Admin Dashboard</h1>
                    <p className="text-purple-100">
                        Monitor your subscription business with comprehensive analytics and management tools.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                            <div className="text-2xl">👥</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_members}</div>
                            <p className="text-xs text-muted-foreground">
                                Registered users
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Memberships</CardTitle>
                            <div className="text-2xl">📋</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_memberships}</div>
                            <p className="text-xs text-muted-foreground">
                                Currently active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Subscription Packages</CardTitle>
                            <div className="text-2xl">📦</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_packages}</div>
                            <p className="text-xs text-muted-foreground">
                                Available packages
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                            <div className="text-2xl">💰</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.monthly_revenue)}</div>
                            <p className="text-xs text-muted-foreground">
                                This month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            ⚡ Quick Actions
                        </CardTitle>
                        <CardDescription>
                            Common administrative tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Link href={route('subscription-packages.create')}>
                                <Button className="w-full h-20 flex-col">
                                    <div className="text-2xl mb-2">📦</div>
                                    Create Package
                                </Button>
                            </Link>
                            <Link href={route('subscription-packages.index')}>
                                <Button variant="outline" className="w-full h-20 flex-col">
                                    <div className="text-2xl mb-2">📋</div>
                                    Manage Packages
                                </Button>
                            </Link>
                            <Link href={route('memberships.index')}>
                                <Button variant="outline" className="w-full h-20 flex-col">
                                    <div className="text-2xl mb-2">👥</div>
                                    View Members
                                </Button>
                            </Link>
                            <Button variant="outline" className="w-full h-20 flex-col">
                                <div className="text-2xl mb-2">📊</div>
                                Reports
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                💳 Recent Transactions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recent_transactions.length > 0 ? (
                                <div className="space-y-3">
                                    {recent_transactions.map((transaction) => (
                                        <div key={transaction.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <div className="font-medium">{transaction.user.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {transaction.subscription_package.name}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    {formatCurrency(transaction.amount)} • {formatDate(transaction.created_at)}
                                                </div>
                                            </div>
                                            {getStatusBadge(transaction.status)}
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full">
                                        View All Transactions
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-6">No recent transactions</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                📋 Recent Memberships
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recent_memberships.length > 0 ? (
                                <div className="space-y-3">
                                    {recent_memberships.map((membership) => (
                                        <div key={membership.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <div className="font-medium">{membership.user.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {membership.subscription_package.name}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    Started: {formatDate(membership.started_at)}
                                                </div>
                                            </div>
                                            {getStatusBadge(membership.status)}
                                        </div>
                                    ))}
                                    <Link href={route('memberships.index')} className="block">
                                        <Button variant="outline" className="w-full">
                                            View All Memberships
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-6">No recent memberships</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}