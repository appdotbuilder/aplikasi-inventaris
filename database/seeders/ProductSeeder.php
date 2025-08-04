<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create products with realistic Indonesian data
        $products = [
            [
                'code' => 'ELK-001',
                'name' => 'Smartphone Samsung Galaxy A54',
                'description' => 'Smartphone Android dengan kamera 50MP dan RAM 8GB',
                'category' => 'Elektronik',
                'price' => 4500000,
                'stock' => 25,
                'min_stock' => 5,
                'unit' => 'pcs',
                'supplier' => 'PT Samsung Indonesia',
                'location' => 'Gudang A',
                'status' => 'active',
            ],
            [
                'code' => 'MKN-001',
                'name' => 'Indomie Goreng',
                'description' => 'Mi instan rasa goreng kemasan 85g',
                'category' => 'Makanan & Minuman',
                'price' => 3500,
                'stock' => 200,
                'min_stock' => 50,
                'unit' => 'pcs',
                'supplier' => 'PT Indofood Sukses Makmur',
                'location' => 'Rak 1',
                'status' => 'active',
            ],
            [
                'code' => 'PKN-001',
                'name' => 'Kaos Polo Pria',
                'description' => 'Kaos polo cotton combed 30s warna navy',
                'category' => 'Pakaian',
                'price' => 85000,
                'stock' => 15,
                'min_stock' => 10,
                'unit' => 'pcs',
                'supplier' => 'CV Garmen Sejahtera',
                'location' => 'Gudang B',
                'status' => 'active',
            ],
            [
                'code' => 'PRT-001',
                'name' => 'Rice Cooker Miyako 1.8L',
                'description' => 'Magic com kapasitas 1.8 liter dengan fitur keep warm',
                'category' => 'Peralatan Rumah Tangga',
                'price' => 350000,
                'stock' => 8,
                'min_stock' => 3,
                'unit' => 'pcs',
                'supplier' => 'PT Miyako Electronics',
                'location' => 'Gudang A',
                'status' => 'active',
            ],
            [
                'code' => 'KKS-001',
                'name' => 'Wardah Lightening Day Cream',
                'description' => 'Krim pagi pencerah wajah 20g',
                'category' => 'Kecantikan & Kesehatan',
                'price' => 25000,
                'stock' => 45,
                'min_stock' => 15,
                'unit' => 'pcs',
                'supplier' => 'PT Paragon Technology',
                'location' => 'Rak 2',
                'status' => 'active',
            ],
        ];

        foreach ($products as $productData) {
            $product = Product::create($productData);
            
            // Create some stock movements for each product
            for ($i = 0; $i < random_int(3, 8); $i++) {
                StockMovement::factory()
                    ->for($product)
                    ->create([
                        'movement_date' => fake()->dateTimeBetween('-3 months', 'now'),
                    ]);
            }
        }

        // Create additional random products
        Product::factory(15)
            ->active()
            ->create()
            ->each(function ($product) {
                // Create stock movements for each product
                StockMovement::factory(random_int(2, 6))
                    ->for($product)
                    ->create();
            });

        // Create some products with low stock
        Product::factory(5)
            ->lowStock()
            ->active()
            ->create()
            ->each(function ($product) {
                // Create some stock movements
                StockMovement::factory(random_int(1, 3))
                    ->for($product)
                    ->create();
            });
    }
}