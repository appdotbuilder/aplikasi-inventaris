<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Product
 *
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string|null $description
 * @property string $category
 * @property float $price
 * @property int $stock
 * @property int $min_stock
 * @property string $unit
 * @property string|null $supplier
 * @property string|null $location
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StockMovement> $stockMovements
 * @property-read int|null $stock_movements_count
 * @property-read bool $is_low_stock
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Product newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Product newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Product query()
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereMinStock($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereStock($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereSupplier($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product active()
 * @method static \Illuminate\Database\Eloquent\Builder|Product lowStock()
 * @method static \Database\Factories\ProductFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'name',
        'description',
        'category',
        'price',
        'stock',
        'min_stock',
        'unit',
        'supplier',
        'location',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
        'min_stock' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'is_low_stock',
    ];

    /**
     * Get the stock movements for the product.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * Scope a query to only include active products.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include products with low stock.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLowStock($query)
    {
        return $query->whereColumn('stock', '<=', 'min_stock');
    }

    /**
     * Get the is_low_stock attribute.
     *
     * @return bool
     */
    public function getIsLowStockAttribute(): bool
    {
        return $this->stock <= $this->min_stock;
    }

    /**
     * Add stock to the product.
     *
     * @param int $quantity
     * @param float|null $unitPrice
     * @param string|null $notes
     * @param string|null $reference
     * @return void
     */
    public function addStock(int $quantity, ?float $unitPrice = null, ?string $notes = null, ?string $reference = null): void
    {
        $this->increment('stock', $quantity);
        
        $this->stockMovements()->create([
            'type' => 'in',
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'notes' => $notes,
            'reference' => $reference,
        ]);
    }

    /**
     * Remove stock from the product.
     *
     * @param int $quantity
     * @param float|null $unitPrice
     * @param string|null $notes
     * @param string|null $reference
     * @return void
     */
    public function removeStock(int $quantity, ?float $unitPrice = null, ?string $notes = null, ?string $reference = null): void
    {
        $this->decrement('stock', $quantity);
        
        $this->stockMovements()->create([
            'type' => 'out',
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'notes' => $notes,
            'reference' => $reference,
        ]);
    }
}