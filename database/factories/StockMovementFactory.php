<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockMovement>
 */
class StockMovementFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\StockMovement>
     */
    protected $model = StockMovement::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['in', 'out']);
        
        return [
            'product_id' => Product::factory(),
            'type' => $type,
            'quantity' => $this->faker->numberBetween(1, 100),
            'unit_price' => $this->faker->optional(0.8)->randomFloat(2, 1000, 100000),
            'notes' => $this->faker->optional(0.5)->sentence(),
            'reference' => $this->faker->optional(0.6)->bothify('REF-####'),
            'movement_date' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }

    /**
     * Indicate that the movement is incoming stock.
     */
    public function incoming(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'in',
            'notes' => 'Stok masuk - ' . $this->faker->sentence(),
        ]);
    }

    /**
     * Indicate that the movement is outgoing stock.
     */
    public function outgoing(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'out',
            'notes' => 'Stok keluar - ' . $this->faker->sentence(),
        ]);
    }
}