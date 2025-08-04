<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Product>
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Elektronik',
            'Makanan & Minuman',
            'Pakaian',
            'Peralatan Rumah Tangga',
            'Kecantikan & Kesehatan',
            'Otomotif',
            'Olahraga',
            'Buku & Alat Tulis',
        ];

        $units = ['pcs', 'kg', 'liter', 'meter', 'box', 'pack'];
        
        $stock = $this->faker->numberBetween(0, 500);
        $minStock = $this->faker->numberBetween(5, 50);

        return [
            'code' => 'PRD-' . $this->faker->unique()->numberBetween(1000, 9999),
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->optional(0.7)->paragraph(),
            'category' => $this->faker->randomElement($categories),
            'price' => $this->faker->randomFloat(2, 1000, 500000),
            'stock' => $stock,
            'min_stock' => $minStock,
            'unit' => $this->faker->randomElement($units),
            'supplier' => $this->faker->optional(0.8)->company(),
            'location' => $this->faker->optional(0.6)->randomElement(['Gudang A', 'Gudang B', 'Toko Depan', 'Rak 1', 'Rak 2', 'Rak 3']),
            'status' => $this->faker->randomElement(['active', 'inactive']),
        ];
    }

    /**
     * Indicate that the product is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the product has low stock.
     */
    public function lowStock(): static
    {
        return $this->state(function (array $attributes) {
            $minStock = $this->faker->numberBetween(10, 20);
            return [
                'stock' => $this->faker->numberBetween(0, $minStock),
                'min_stock' => $minStock,
            ];
        });
    }
}