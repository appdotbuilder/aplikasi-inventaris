<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique()->comment('Product code/SKU');
            $table->string('name')->comment('Product name');
            $table->text('description')->nullable()->comment('Product description');
            $table->string('category')->comment('Product category');
            $table->decimal('price', 15, 2)->comment('Product price');
            $table->integer('stock')->default(0)->comment('Current stock quantity');
            $table->integer('min_stock')->default(0)->comment('Minimum stock level');
            $table->string('unit')->default('pcs')->comment('Stock unit (pcs, kg, liter, etc.)');
            $table->string('supplier')->nullable()->comment('Supplier name');
            $table->string('location')->nullable()->comment('Storage location');
            $table->enum('status', ['active', 'inactive'])->default('active')->comment('Product status');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('code');
            $table->index('name');
            $table->index('category');
            $table->index('status');
            $table->index(['status', 'stock']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};