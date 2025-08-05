<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Models\SubscriptionPackage;
use App\Models\Transaction;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            return $this->adminDashboard();
        }
        
        return $this->memberDashboard();
    }

    /**
     * Display admin dashboard.
     */
    private function adminDashboard()
    {
        $stats = [
            'total_members' => User::members()->count(),
            'active_memberships' => Membership::where('status', 'active')->count(),
            'total_packages' => SubscriptionPackage::count(),
            'monthly_revenue' => Transaction::where('status', 'paid')
                ->whereMonth('created_at', now()->month)
                ->sum('amount'),
        ];
        
        $recent_transactions = Transaction::with(['user', 'subscriptionPackage'])
            ->latest()
            ->take(5)
            ->get();
            
        $recent_memberships = Membership::with(['user', 'subscriptionPackage'])
            ->latest()
            ->take(5)
            ->get();
        
        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recent_transactions' => $recent_transactions,
            'recent_memberships' => $recent_memberships
        ]);
    }

    /**
     * Display member dashboard.
     */
    private function memberDashboard()
    {
        $user = auth()->user();
        
        $current_membership = $user->currentMembership();
        $membership_history = $user->memberships()
            ->with('subscriptionPackage')
            ->latest()
            ->take(5)
            ->get();
            
        $transaction_history = $user->transactions()
            ->with('subscriptionPackage')
            ->latest()
            ->take(5)
            ->get();
            
        $available_packages = SubscriptionPackage::active()->get();
        
        return Inertia::render('dashboard', [
            'current_membership' => $current_membership?->load('subscriptionPackage'),
            'membership_history' => $membership_history,
            'transaction_history' => $transaction_history,
            'available_packages' => $available_packages
        ]);
    }
}