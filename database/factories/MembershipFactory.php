<?php

namespace Database\Factories;

use App\Models\SubscriptionPackage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Membership>
 */
class MembershipFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startedAt = fake()->dateTimeBetween('-6 months', 'now');
        $duration = fake()->randomElement([1, 3, 6, 12]);
        
        return [
            'user_id' => User::factory(),
            'subscription_package_id' => SubscriptionPackage::factory(),
            'started_at' => $startedAt,
            'expires_at' => (clone $startedAt)->modify("+{$duration} months"),
            'status' => fake()->randomElement(['active', 'expired', 'cancelled']),
        ];
    }

    /**
     * Indicate that the membership is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'started_at' => fake()->dateTimeBetween('-3 months', 'now'),
            'expires_at' => fake()->dateTimeBetween('now', '+3 months'),
        ]);
    }

    /**
     * Indicate that the membership is expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'expired',
            'expires_at' => fake()->dateTimeBetween('-1 months', 'now'),
        ]);
    }
}