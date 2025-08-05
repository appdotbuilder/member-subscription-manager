<?php

namespace Database\Seeders;

use App\Models\SubscriptionPackage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubscriptionPackageSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Basic Plan',
                'description' => 'Perfect for individuals getting started with basic features and limited access.',
                'duration_months' => 1,
                'price' => 99000,
                'is_active' => true,
            ],
            [
                'name' => 'Standard Plan',
                'description' => 'Great for small teams with enhanced features and priority support.',
                'duration_months' => 3,
                'price' => 249000,
                'is_active' => true,
            ],
            [
                'name' => 'Premium Plan',
                'description' => 'Best value for growing businesses with full access to all features.',
                'duration_months' => 6,
                'price' => 449000,
                'is_active' => true,
            ],
            [
                'name' => 'Enterprise Plan',
                'description' => 'Complete solution for large organizations with unlimited access and dedicated support.',
                'duration_months' => 12,
                'price' => 799000,
                'is_active' => true,
            ],
            [
                'name' => 'Trial Plan',
                'description' => 'Free trial plan for testing purposes (inactive by default).',
                'duration_months' => 1,
                'price' => 0,
                'is_active' => false,
            ],
        ];

        foreach ($packages as $package) {
            SubscriptionPackage::create($package);
        }
    }
}