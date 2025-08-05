<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Models\SubscriptionPackage;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Display payment form for subscription.
     */
    public function index(SubscriptionPackage $package)
    {
        return Inertia::render('payment/index', [
            'package' => $package,
            'snapToken' => $this->createSnapToken($package)
        ]);
    }

    /**
     * Create Midtrans Snap token.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subscription_package_id' => 'required|exists:subscription_packages,id'
        ]);
        
        $package = SubscriptionPackage::findOrFail($validated['subscription_package_id']);
        $user = auth()->user();
        
        // Create transaction record
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'subscription_package_id' => $package->id,
            'transaction_id' => 'TXN-' . uniqid(),
            'midtrans_order_id' => 'ORDER-' . time() . '-' . $user->id,
            'amount' => $package->price,
            'status' => 'pending'
        ]);
        
        // Create Midtrans Snap token
        $snapToken = $this->createSnapToken($package, $transaction);
        
        return Inertia::render('payment/index', [
            'package' => $package,
            'transaction' => $transaction,
            'snapToken' => $snapToken
        ]);
    }

    /**
     * Handle payment callback from Midtrans.
     */
    public function show(Request $request)
    {
        // Handle Midtrans callback
        $orderId = $request->input('order_id');
        $transactionStatus = $request->input('transaction_status');
        $fraudStatus = $request->input('fraud_status');
        
        $transaction = Transaction::where('midtrans_order_id', $orderId)->first();
        
        if (!$transaction) {
            return response()->json(['status' => 'error', 'message' => 'Transaction not found']);
        }
        
        // Update transaction status based on Midtrans response
        if ($transactionStatus === 'capture' || $transactionStatus === 'settlement') {
            $transaction->update([
                'status' => 'paid',
                'paid_at' => now(),
                'midtrans_response' => $request->all()
            ]);
            
            // Create membership
            $this->createMembership($transaction);
        } elseif ($transactionStatus === 'pending') {
            $transaction->update([
                'status' => 'pending',
                'midtrans_response' => $request->all()
            ]);
        } else {
            $transaction->update([
                'status' => 'failed',
                'midtrans_response' => $request->all()
            ]);
        }
        
        return response()->json(['status' => 'success']);
    }

    /**
     * Display payment success page.
     */
    public function edit(Transaction $transaction)
    {
        return Inertia::render('payment/success', [
            'transaction' => $transaction->load(['subscriptionPackage', 'membership'])
        ]);
    }

    /**
     * Create Midtrans Snap token.
     */
    private function createSnapToken(SubscriptionPackage $package, Transaction $transaction = null): string
    {
        $user = auth()->user();
        $orderId = $transaction ? $transaction->midtrans_order_id : 'ORDER-' . time() . '-' . $user->id;
        
        // Mock Snap token for demo purposes
        // In real implementation, integrate with Midtrans SDK
        return 'snap-token-' . uniqid();
    }

    /**
     * Create membership after successful payment.
     */
    private function createMembership(Transaction $transaction): void
    {
        $package = $transaction->subscriptionPackage;
        $user = $transaction->user;
        
        $membership = Membership::create([
            'user_id' => $user->id,
            'subscription_package_id' => $package->id,
            'started_at' => now(),
            'expires_at' => now()->addMonths($package->duration_months),
            'status' => 'active'
        ]);
        
        $transaction->update(['membership_id' => $membership->id]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy()
    {
        // Handle payment cancellation
        return redirect()->route('dashboard')
            ->with('info', 'Payment cancelled.');
    }
}