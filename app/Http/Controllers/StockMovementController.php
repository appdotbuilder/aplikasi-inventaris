<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StockMovementRequest;
use App\Models\Product;
use App\Models\StockMovement;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $movements = StockMovement::with('product')
            ->when(request('product_id'), function ($query, $productId) {
                $query->where('product_id', $productId);
            })
            ->when(request('type'), function ($query, $type) {
                $query->where('type', $type);
            })
            ->latest('movement_date')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('stock-movements/index', [
            'movements' => $movements,
            'filters' => request()->only(['product_id', 'type']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $product = request('product_id') ? Product::find(request('product_id')) : null;
        
        return Inertia::render('stock-movements/create', [
            'product' => $product,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StockMovementRequest $request)
    {
        $product = Product::findOrFail(request('product_id'));
        
        $validated = $request->validated();
        
        // Validate stock availability for outgoing movements
        if ($validated['type'] === 'out' && $product->stock < $validated['quantity']) {
            return back()->withErrors([
                'quantity' => 'Stok tidak mencukupi. Stok tersedia: ' . $product->stock . ' ' . $product->unit
            ]);
        }
        
        // Use the model methods to handle stock movements
        if ($validated['type'] === 'in') {
            $product->addStock(
                $validated['quantity'],
                $validated['unit_price'] ?? null,
                $validated['notes'] ?? null,
                $validated['reference'] ?? null
            );
        } else {
            $product->removeStock(
                $validated['quantity'],
                $validated['unit_price'] ?? null,
                $validated['notes'] ?? null,
                $validated['reference'] ?? null
            );
        }

        return redirect()->route('products.show', $product)
            ->with('success', 'Pergerakan stok berhasil dicatat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(StockMovement $stockMovement)
    {
        $stockMovement->load('product');

        return Inertia::render('stock-movements/show', [
            'movement' => $stockMovement,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StockMovement $stockMovement)
    {
        $stockMovement->load('product');

        return Inertia::render('stock-movements/edit', [
            'movement' => $stockMovement,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StockMovementRequest $request, StockMovement $stockMovement)
    {
        $validated = $request->validated();
        
        // Calculate the difference to adjust stock
        $oldQuantity = $stockMovement->quantity;
        $newQuantity = $validated['quantity'];
        $quantityDiff = $newQuantity - $oldQuantity;
        
        $product = $stockMovement->product;
        
        // Adjust stock based on movement type and quantity difference
        if ($stockMovement->type === 'in') {
            $product->increment('stock', $quantityDiff);
        } else {
            // For outgoing movements, check if we have enough stock
            if ($quantityDiff > 0 && $product->stock < $quantityDiff) {
                return back()->withErrors([
                    'quantity' => 'Stok tidak mencukupi untuk perubahan ini. Stok tersedia: ' . $product->stock . ' ' . $product->unit
                ]);
            }
            $product->decrement('stock', $quantityDiff);
        }
        
        $stockMovement->update($validated);

        return redirect()->route('stock-movements.show', $stockMovement)
            ->with('success', 'Pergerakan stok berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockMovement $stockMovement)
    {
        $product = $stockMovement->product;
        
        // Reverse the stock movement
        if ($stockMovement->type === 'in') {
            $product->decrement('stock', $stockMovement->quantity);
        } else {
            $product->increment('stock', $stockMovement->quantity);
        }
        
        $stockMovement->delete();

        return redirect()->route('products.show', $product)
            ->with('success', 'Pergerakan stok berhasil dihapus.');
    }
}