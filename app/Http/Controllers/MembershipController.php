<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Models\SubscriptionPackage;
use Inertia\Inertia;

class MembershipController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            $memberships = Membership::with(['user', 'subscriptionPackage'])
                ->latest()
                ->paginate(10);
        } else {
            $memberships = $user->memberships()
                ->with('subscriptionPackage')
                ->latest()
                ->paginate(10);
        }
        
        return Inertia::render('memberships/index', [
            'memberships' => $memberships
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $packages = SubscriptionPackage::active()->get();
        
        return Inertia::render('memberships/create', [
            'packages' => $packages
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store()
    {
        // This will be handled by payment processing
        return redirect()->route('memberships.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Membership $membership)
    {
        // Check if user can view this membership
        if (auth()->user()->isMember() && $membership->user_id !== auth()->id()) {
            abort(403, 'Unauthorized to view this membership.');
        }
        
        return Inertia::render('memberships/show', [
            'membership' => $membership->load(['subscriptionPackage', 'transactions'])
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Membership $membership)
    {
        // Only admins can edit memberships
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Unauthorized to edit memberships.');
        }
        
        return Inertia::render('memberships/edit', [
            'membership' => $membership
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Membership $membership)
    {
        // Only admins can update memberships
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Unauthorized to update memberships.');
        }
        
        // Admin can update membership status
        $validated = request()->validate([
            'status' => 'required|in:active,expired,cancelled'
        ]);
        
        $membership->update($validated);

        return redirect()->route('memberships.index')
            ->with('success', 'Membership updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Membership $membership)
    {
        // Only admins can delete memberships
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Unauthorized to delete memberships.');
        }
        
        $membership->delete();

        return redirect()->route('memberships.index')
            ->with('success', 'Membership deleted successfully.');
    }
}