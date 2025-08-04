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
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['in', 'out'])->comment('Movement type: in (masuk) or out (keluar)');
            $table->integer('quantity')->comment('Movement quantity');
            $table->decimal('unit_price', 15, 2)->nullable()->comment('Unit price for this movement');
            $table->text('notes')->nullable()->comment('Movement notes');
            $table->string('reference')->nullable()->comment('Reference number (PO, invoice, etc.)');
            $table->timestamp('movement_date')->useCurrent()->comment('Movement date');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('product_id');
            $table->index('type');
            $table->index('movement_date');
            $table->index(['product_id', 'movement_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};