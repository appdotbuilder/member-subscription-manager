<?php

namespace Database\Factories;

use App\Models\Membership;
use App\Models\SubscriptionPackage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['pending', 'paid', 'failed', 'cancelled']);
        
        return [
            'user_id' => User::factory(),
            'subscription_package_id' => SubscriptionPackage::factory(),
            'membership_id' => null,
            'transaction_id' => 'TXN-' . fake()->unique()->randomNumber(8),
            'midtrans_order_id' => 'ORDER-' . fake()->unique()->randomNumber(8),
            'amount' => fake()->numberBetween(50000, 500000),
            'status' => $status,
            'payment_method' => fake()->randomElement(['credit_card', 'bank_transfer', 'e_wallet', 'other']),
            'midtrans_response' => $status === 'paid' ? ['status' => 'success'] : null,
            'paid_at' => $status === 'paid' ? fake()->dateTimeBetween('-1 month', 'now') : null,
        ];
    }

    /**
     * Indicate that the transaction is paid.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
            'paid_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'midtrans_response' => ['status' => 'success'],
        ]);
    }

    /**
     * Indicate that the transaction is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'paid_at' => null,
            'midtrans_response' => null,
        ]);
    }
}