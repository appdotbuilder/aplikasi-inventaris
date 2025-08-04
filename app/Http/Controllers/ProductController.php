<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Requests\StockMovementRequest;
use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('stockMovements')
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%")
                      ->orWhere('category', 'like', "%{$search}%");
            })
            ->when(request('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->when(request('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when(request('low_stock'), function ($query) {
                $query->lowStock();
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $categories = Product::distinct()->pluck('category')->filter()->sort()->values();
        
        $stats = [
            'total_products' => Product::count(),
            'active_products' => Product::active()->count(),
            'low_stock_products' => Product::lowStock()->count(),
            'total_value' => Product::selectRaw('SUM(stock * price) as total')->value('total') ?? 0,
        ];

        return Inertia::render('welcome', [
            'products' => $products,
            'categories' => $categories,
            'stats' => $stats,
            'filters' => request()->only(['search', 'category', 'status', 'low_stock']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Product::distinct()->pluck('category')->filter()->sort()->values();
        
        return Inertia::render('products/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        Product::create($request->validated());

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load(['stockMovements' => function ($query) {
            $query->latest()->limit(20);
        }]);

        return Inertia::render('products/show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $categories = Product::distinct()->pluck('category')->filter()->sort()->values();
        
        return Inertia::render('products/edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return redirect()->route('products.show', $product)
            ->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil dihapus.');
    }
}