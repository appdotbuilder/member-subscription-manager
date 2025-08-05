import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

interface Package {
    id: number;
    name: string;
    description: string;
    price: number;
    duration_months: number;
    is_active: boolean;
    created_at: string;
}

interface Props {
    packages: {
        data: Package[];
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
        title: 'Admin Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Subscription Packages',
        href: '/subscription-packages',
    },
];

export default function SubscriptionPackagesIndex({ packages }: Props) {
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

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete the package "${name}"?`)) {
            router.delete(route('subscription-packages.destroy', id));
        }
    };

    const handleToggleStatus = (id: number, currentStatus: boolean) => {
        router.patch(route('subscription-packages.update', id), {
            is_active: !currentStatus
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscription Packages Management" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">📦 Subscription Packages</h1>
                        <p className="text-gray-600">Manage your subscription packages and pricing</p>
                    </div>
                    <Link href={route('subscription-packages.create')}>
                        <Button>
                            ➕ Create New Package
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{packages.meta.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Active Packages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {packages.data.filter(pkg => pkg.is_active).length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Inactive Packages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {packages.data.filter(pkg => !pkg.is_active).length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Packages List */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Packages</CardTitle>
                        <CardDescription>
                            Manage your subscription packages, pricing, and availability
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {packages.data.length > 0 ? (
                            <div className="space-y-4">
                                {packages.data.map((pkg) => (
                                    <div key={pkg.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-lg font-semibold">{pkg.name}</h3>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        pkg.is_active 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {pkg.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mt-1">{pkg.description}</p>
                                                <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                                                    <span>💰 {formatCurrency(pkg.price)}</span>
                                                    <span>📅 {pkg.duration_months} month{pkg.duration_months > 1 ? 's' : ''}</span>
                                                    <span>📆 Created {formatDate(pkg.created_at)}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 ml-4">
                                                <Link href={route('subscription-packages.show', pkg.id)}>
                                                    <Button variant="outline" size="sm">
                                                        👁️ View
                                                    </Button>
                                                </Link>
                                                <Link href={route('subscription-packages.edit', pkg.id)}>
                                                    <Button variant="outline" size="sm">
                                                        ✏️ Edit
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleToggleStatus(pkg.id, pkg.is_active)}
                                                >
                                                    {pkg.is_active ? '⏸️ Disable' : '▶️ Enable'}
                                                </Button>
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm"
                                                    onClick={() => handleDelete(pkg.id, pkg.name)}
                                                >
                                                    🗑️ Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📦</div>
                                <h3 className="text-lg font-semibold mb-2">No packages yet</h3>
                                <p className="text-gray-600 mb-4">Create your first subscription package to get started.</p>
                                <Link href={route('subscription-packages.create')}>
                                    <Button>
                                        ➕ Create First Package
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination would go here if needed */}
            </div>
        </AppLayout>
    );
}