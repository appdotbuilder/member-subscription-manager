import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

interface Membership {
    id: number;
    status: string;
    started_at: string;
    expires_at: string;
    user?: {
        name: string;
        email: string;
    };
    subscription_package: {
        name: string;
        price: number;
        duration_months: number;
    };
}

interface Props {
    memberships: {
        data: Membership[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Memberships',
        href: '/memberships',
    },
];

export default function MembershipsIndex({ memberships }: Props) {
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
        };
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    const getDaysUntilExpiry = (expiryDate: string) => {
        const expiry = new Date(expiryDate);
        const now = new Date();
        const diffTime = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Memberships" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">📋 My Memberships</h1>
                        <p className="text-gray-600">View your subscription history and current memberships</p>
                    </div>
                    <Link href={route('dashboard')}>
                        <Button variant="outline">
                            🔙 Back to Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Memberships</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{memberships.meta.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Active Memberships</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {memberships.data.filter(membership => membership.status === 'active').length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Expired Memberships</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {memberships.data.filter(membership => membership.status === 'expired').length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Memberships List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Membership History</CardTitle>
                        <CardDescription>
                            Your complete subscription history and current active memberships
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {memberships.data.length > 0 ? (
                            <div className="space-y-4">
                                {memberships.data.map((membership) => {
                                    const daysUntilExpiry = getDaysUntilExpiry(membership.expires_at);
                                    const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;
                                    
                                    return (
                                        <div key={membership.id} className={`border rounded-lg p-4 ${
                                            membership.status === 'active' ? 'border-green-200 bg-green-50' : 
                                            membership.status === 'expired' ? 'border-red-200 bg-red-50' : 
                                            'border-gray-200'
                                        }`}>
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3">
                                                        <h3 className="text-lg font-semibold">{membership.subscription_package.name}</h3>
                                                        {getStatusBadge(membership.status)}
                                                        {isExpiringSoon && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                ⚠️ Expires in {daysUntilExpiry} days
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    {membership.user && (
                                                        <p className="text-gray-600 mt-1">
                                                            Member: {membership.user.name} ({membership.user.email})
                                                        </p>
                                                    )}
                                                    
                                                    <div className="flex items-center space-x-6 mt-3 text-sm text-gray-600">
                                                        <span>💰 {formatCurrency(membership.subscription_package.price)}</span>
                                                        <span>📅 {membership.subscription_package.duration_months} month{membership.subscription_package.duration_months > 1 ? 's' : ''}</span>
                                                        <span>🚀 Started: {formatDate(membership.started_at)}</span>
                                                        <span>⏰ Expires: {formatDate(membership.expires_at)}</span>
                                                    </div>
                                                    
                                                    {membership.status === 'active' && daysUntilExpiry > 0 && (
                                                        <div className="mt-2 text-sm text-green-600">
                                                            ✅ {daysUntilExpiry} days remaining
                                                        </div>
                                                    )}
                                                    
                                                    {membership.status === 'expired' && (
                                                        <div className="mt-2 text-sm text-red-600">
                                                            ❌ Expired {Math.abs(daysUntilExpiry)} days ago
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center space-x-2 ml-4">
                                                    <Link href={route('memberships.show', membership.id)}>
                                                        <Button variant="outline" size="sm">
                                                            👁️ View Details
                                                        </Button>
                                                    </Link>
                                                    
                                                    {membership.status === 'expired' && (
                                                        <Link href={route('dashboard')}>
                                                            <Button size="sm">
                                                                🔄 Renew
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📋</div>
                                <h3 className="text-lg font-semibold mb-2">No memberships yet</h3>
                                <p className="text-gray-600 mb-4">Start your subscription journey by choosing a package.</p>
                                <Link href={route('dashboard')}>
                                    <Button>
                                        🚀 Browse Packages
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}