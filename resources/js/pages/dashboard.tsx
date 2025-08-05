import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

interface Membership {
    id: number;
    status: string;
    started_at: string;
    expires_at: string;
    subscription_package: {
        name: string;
        price: number;
        duration_months: number;
    };
}

interface Transaction {
    id: number;
    transaction_id: string;
    amount: number;
    status: string;
    created_at: string;
    subscription_package: {
        name: string;
    };
}

interface Package {
    id: number;
    name: string;
    description: string;
    price: number;
    duration_months: number;
    is_active: boolean;
}

interface Props {
    current_membership?: Membership;
    membership_history: Membership[];
    transaction_history: Transaction[];
    available_packages: Package[];
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ 
    current_membership, 
    membership_history, 
    transaction_history, 
    available_packages 
}: Props) {
    const handleSubscribe = (packageId: number) => {
        router.post(route('payment.store'), {
            subscription_package_id: packageId
        });
    };

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
            <Head title="Member Dashboard" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">🎉 Welcome to Your Dashboard</h1>
                    <p className="text-blue-100">
                        Manage your subscriptions, view transaction history, and explore new packages.
                    </p>
                </div>

                {/* Current Membership Status */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                📋 Current Membership
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {current_membership ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{current_membership.subscription_package.name}</span>
                                        {getStatusBadge(current_membership.status)}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <p>Started: {formatDate(current_membership.started_at)}</p>
                                        <p>Expires: {formatDate(current_membership.expires_at)}</p>
                                        <p>Price: {formatCurrency(current_membership.subscription_package.price)}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-gray-500 mb-4">No active membership</p>
                                    <p className="text-sm text-gray-400">Subscribe to a package to get started!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                📊 Quick Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Memberships:</span>
                                    <span className="font-semibold">{membership_history.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Transactions:</span>
                                    <span className="font-semibold">{transaction_history.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Available Packages:</span>
                                    <span className="font-semibold">{available_packages.length}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Available Packages */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            📦 Available Subscription Packages
                        </CardTitle>
                        <CardDescription>
                            Choose from our available subscription plans
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {available_packages.map((pkg) => (
                                <Card key={pkg.id} className="relative">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                                        <CardDescription className="text-sm">
                                            {pkg.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-indigo-600">
                                                    {formatCurrency(pkg.price)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    for {pkg.duration_months} month{pkg.duration_months > 1 ? 's' : ''}
                                                </div>
                                            </div>
                                            <Button 
                                                onClick={() => handleSubscribe(pkg.id)}
                                                className="w-full"
                                                disabled={current_membership?.status === 'active'}
                                            >
                                                {current_membership?.status === 'active' ? 'Already Subscribed' : 'Subscribe Now'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                📋 Recent Memberships
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {membership_history.length > 0 ? (
                                <div className="space-y-3">
                                    {membership_history.slice(0, 3).map((membership) => (
                                        <div key={membership.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <div className="font-medium">{membership.subscription_package.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {formatDate(membership.started_at)}
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
                                <p className="text-gray-500 text-center py-6">No membership history</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                💳 Recent Transactions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {transaction_history.length > 0 ? (
                                <div className="space-y-3">
                                    {transaction_history.slice(0, 3).map((transaction) => (
                                        <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <div className="font-medium">{transaction.subscription_package.name}</div>
                                                <div className="text-sm text-gray-500">
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
                                <p className="text-gray-500 text-center py-6">No transaction history</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}