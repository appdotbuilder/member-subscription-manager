import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    return (
        <>
            <Head title="Subscription Management System" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center">
                                <div className="text-2xl font-bold text-indigo-600">
                                    📊 SubsManager
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="text-gray-700 hover:text-indigo-600 font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-gray-700 hover:text-indigo-600 font-medium"
                                        >
                                            Login
                                        </Link>
                                        <Link href={route('register')}>
                                            <Button>Register</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            🎯 Comprehensive Subscription Management
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Complete solution for managing memberships, subscriptions, and payments. 
                            Built with modern technology and integrated with Midtrans payment gateway.
                        </p>
                        {!auth.user && (
                            <div className="flex justify-center space-x-4">
                                <Link href={route('register')}>
                                    <Button size="lg" className="text-lg px-8 py-3">
                                        🚀 Get Started Free
                                    </Button>
                                </Link>
                                <Link href={route('login')}>
                                    <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                                        👤 Member Login
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg">
                                    👥 Member Management
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Complete member registration, profile management, and subscription tracking system.
                                </CardDescription>
                                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                    <li>• Easy registration process</li>
                                    <li>• Profile management</li>
                                    <li>• Subscription history</li>
                                    <li>• Transaction tracking</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg">
                                    📦 Package Management
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Flexible subscription packages with customizable duration, pricing, and features.
                                </CardDescription>
                                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                    <li>• Custom package creation</li>
                                    <li>• Flexible pricing</li>
                                    <li>• Duration management</li>
                                    <li>• Active/inactive status</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg">
                                    💳 Payment Integration
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Secure payment processing with Midtrans integration supporting multiple payment methods.
                                </CardDescription>
                                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                    <li>• Midtrans integration</li>
                                    <li>• Multiple payment methods</li>
                                    <li>• Automatic confirmations</li>
                                    <li>• Transaction history</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg">
                                    📊 Admin Dashboard
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Comprehensive admin panel with analytics, member management, and revenue tracking.
                                </CardDescription>
                                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                    <li>• Revenue analytics</li>
                                    <li>• Member statistics</li>
                                    <li>• Package management</li>
                                    <li>• Transaction monitoring</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg">
                                    📧 Email Notifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Automated email system for registrations, payment confirmations, and subscription reminders.
                                </CardDescription>
                                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                    <li>• Registration confirmations</li>
                                    <li>• Payment notifications</li>
                                    <li>• Expiry reminders</li>
                                    <li>• Custom templates</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg">
                                    🔐 Secure Access
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Role-based authentication system with separate access for members and administrators.
                                </CardDescription>
                                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                    <li>• Role-based access</li>
                                    <li>• Secure authentication</li>
                                    <li>• Member/Admin roles</li>
                                    <li>• Protected routes</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-indigo-600 rounded-2xl p-12 text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">
                            🎉 Ready to Start Managing Subscriptions?
                        </h2>
                        <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of businesses using our platform to manage their subscription services efficiently.
                        </p>
                        {!auth.user && (
                            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link href={route('register')}>
                                    <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                                        🚀 Start Free Trial
                                    </Button>
                                </Link>
                                <Link href={route('login')}>
                                    <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent border-white text-white hover:bg-white hover:text-indigo-600">
                                        👤 Login to Account
                                    </Button>
                                </Link>
                            </div>
                        )}
                        {auth.user && (
                            <Link href={route('dashboard')}>
                                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                                    📊 Go to Dashboard
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Stats Section */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-indigo-600">500+</div>
                            <div className="text-gray-600">Active Members</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-indigo-600">50+</div>
                            <div className="text-gray-600">Subscription Plans</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-indigo-600">99.9%</div>
                            <div className="text-gray-600">Uptime</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-indigo-600">24/7</div>
                            <div className="text-gray-600">Support</div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-gray-800 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="text-2xl font-bold text-indigo-400 mb-4">
                            📊 SubsManager
                        </div>
                        <p className="text-gray-400 mb-6">
                            The complete subscription management solution for modern businesses.
                        </p>
                        <div className="flex justify-center space-x-6 text-sm">
                            <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                            <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                            <a href="#" className="text-gray-400 hover:text-white">Support</a>
                            <a href="#" className="text-gray-400 hover:text-white">Contact</a>
                        </div>
                        <div className="mt-6 text-gray-500 text-sm">
                            © 2024 SubsManager. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}