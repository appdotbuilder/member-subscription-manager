<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubscriptionPackageRequest;
use App\Http\Requests\UpdateSubscriptionPackageRequest;
use App\Models\SubscriptionPackage;
use Inertia\Inertia;

class SubscriptionPackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $packages = SubscriptionPackage::latest()->paginate(10);
        
        return Inertia::render('admin/subscription-packages/index', [
            'packages' => $packages
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/subscription-packages/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSubscriptionPackageRequest $request)
    {
        $package = SubscriptionPackage::create($request->validated());

        return redirect()->route('subscription-packages.index')
            ->with('success', 'Subscription package created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(SubscriptionPackage $subscriptionPackage)
    {
        return Inertia::render('admin/subscription-packages/show', [
            'package' => $subscriptionPackage->load(['memberships.user', 'transactions'])
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SubscriptionPackage $subscriptionPackage)
    {
        return Inertia::render('admin/subscription-packages/edit', [
            'package' => $subscriptionPackage
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSubscriptionPackageRequest $request, SubscriptionPackage $subscriptionPackage)
    {
        $subscriptionPackage->update($request->validated());

        return redirect()->route('subscription-packages.index')
            ->with('success', 'Subscription package updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SubscriptionPackage $subscriptionPackage)
    {
        $subscriptionPackage->delete();

        return redirect()->route('subscription-packages.index')
            ->with('success', 'Subscription package deleted successfully.');
    }
}