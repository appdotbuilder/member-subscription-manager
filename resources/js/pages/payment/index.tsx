import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface Package {
    id: number;
    name: string;
    description: string;
    price: number;
    duration_months: number;
}

interface Transaction {
    id: number;
    transaction_id: string;
    midtrans_order_id: string;
    amount: number;
    status: string;
}

interface Props {
    package: Package;
    transaction?: Transaction;
    snapToken: string;
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payment',
        href: '/payment',
    },
];

export default function PaymentIndex({ package: pkg, transaction }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    const handlePayment = () => {
        // In real implementation, this would integrate with Midtrans Snap
        // For demo purposes, we'll simulate the payment process
        alert('🎉 Payment simulation successful! In production, this would redirect to Midtrans payment page.');
        
        // Simulate successful payment after 2 seconds
        setTimeout(() => {
            window.location.href = route('dashboard');
        }, 2000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Payment - ${pkg.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 max-w-2xl mx-auto">
                {/* Payment Header */}
                <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white text-center">
                    <h1 className="text-2xl font-bold mb-2">💳 Complete Your Payment</h1>
                    <p className="text-green-100">
                        You're just one step away from accessing {pkg.name}
                    </p>
                </div>

                {/* Package Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            📦 Subscription Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Package Name:</span>
                                <span>{pkg.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Duration:</span>
                                <span>{pkg.duration_months} month{pkg.duration_months > 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Description:</span>
                                <span className="text-right max-w-xs">{pkg.description}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total Amount:</span>
                                <span className="text-green-600">{formatCurrency(pkg.price)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Transaction Info */}
                {transaction && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                🧾 Transaction Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Transaction ID:</span>
                                    <span className="text-sm font-mono">{transaction.transaction_id}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Order ID:</span>
                                    <span className="text-sm font-mono">{transaction.midtrans_order_id}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Status:</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Payment Methods */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            💳 Payment Methods
                        </CardTitle>
                        <CardDescription>
                            Choose your preferred payment method
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3">
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                <div className="text-2xl">💳</div>
                                <div>
                                    <div className="font-medium">Credit/Debit Card</div>
                                    <div className="text-sm text-gray-500">Visa, Mastercard, JCB</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                <div className="text-2xl">🏦</div>
                                <div>
                                    <div className="font-medium">Bank Transfer</div>
                                    <div className="text-sm text-gray-500">BCA, BNI, BRI, Mandiri</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                <div className="text-2xl">📱</div>
                                <div>
                                    <div className="font-medium">E-Wallet</div>
                                    <div className="text-sm text-gray-500">GoPay, OVO, DANA, LinkAja</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Button */}
                <div className="space-y-4">
                    <Button 
                        onClick={handlePayment}
                        className="w-full h-12 text-lg"
                        size="lg"
                    >
                        🚀 Proceed to Payment - {formatCurrency(pkg.price)}
                    </Button>
                    
                    <div className="text-center text-sm text-gray-500">
                        <p>🔒 Your payment is secured by Midtrans</p>
                        <p>💯 30-day money back guarantee</p>
                    </div>
                </div>

                {/* Demo Notice */}
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                            <div className="text-2xl">ℹ️</div>
                            <div>
                                <div className="font-medium text-yellow-800">Demo Mode</div>
                                <div className="text-sm text-yellow-700">
                                    This is a demonstration. In production, you would be redirected to the actual Midtrans payment page with real payment processing.
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}