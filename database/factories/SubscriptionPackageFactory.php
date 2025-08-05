<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SubscriptionPackage>
 */
class SubscriptionPackageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $plans = ['Basic', 'Standard', 'Premium', 'Enterprise'];
        $durations = [1, 3, 6, 12];
        
        return [
            'name' => fake()->randomElement($plans) . ' Plan',
            'description' => fake()->paragraph(),
            'duration_months' => fake()->randomElement($durations),
            'price' => fake()->numberBetween(50000, 500000),
            'is_active' => fake()->boolean(80), // 80% chance of being active
        ];
    }

    /**
     * Indicate that the package is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the package is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}