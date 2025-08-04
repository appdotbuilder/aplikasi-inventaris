import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { 
    ArrowLeft, 
    Edit, 
    Trash2, 
    Plus, 
    Minus,
    Package,
    MapPin,
    User,
    Calendar,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    History
} from 'lucide-react';

interface StockMovement {
    id: number;
    type: 'in' | 'out';
    quantity: number;
    unit_price?: number;
    notes?: string;
    reference?: string;
    movement_date: string;
    created_at: string;
}

interface Product {
    id: number;
    code: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    stock: number;
    min_stock: number;
    unit: string;
    supplier?: string;
    location?: string;
    status: 'active' | 'inactive';
    is_low_stock: boolean;
    created_at: string;
    updated_at: string;
    stock_movements: StockMovement[];
}

interface Props {
    product: Product;
    [key: string]: unknown;
}

export default function ShowProduct({ product }: Props) {
    const [showStockForm, setShowStockForm] = useState(false);
    const [stockFormData, setStockFormData] = useState({
        type: 'in' as 'in' | 'out',
        quantity: '',
        unit_price: '',
        notes: '',
        reference: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };
    
    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) {
            router.delete(`/products/${product.id}`, {
                onSuccess: () => {
                    router.get('/');
                }
            });
        }
    };
    
    const handleStockSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        router.post(`/stock-movements?product_id=${product.id}`, stockFormData, {
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            },
            onSuccess: () => {
                setShowStockForm(false);
                setStockFormData({
                    type: 'in',
                    quantity: '',
                    unit_price: '',
                    notes: '',
                    reference: '',
                });
                setErrors({});
                setIsSubmitting(false);
            }
        });
    };
    
    const goBack = () => {
        router.get('/');
    };

    return (
        <>
            <Head title={`${product.name} - Detail Produk`} />
            
            <AppShell>
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="mb-6">
                            <Button 
                                variant="ghost" 
                                onClick={goBack}
                                className="mb-4"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali ke Daftar Produk
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Product Info */}
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-2xl flex items-center gap-3">
                                                    📦 {product.name}
                                                </CardTitle>
                                                <CardDescription className="text-lg mt-2">
                                                    {product.code} • {product.category}
                                                </CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge 
                                                    variant={product.status === 'active' ? 'default' : 'secondary'}
                                                >
                                                    {product.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                                </Badge>
                                                {product.is_low_stock && (
                                                    <Badge variant="destructive">
                                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                                        Stok Menipis
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {product.description && (
                                            <div>
                                                <h3 className="font-medium mb-2">Deskripsi</h3>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {product.description}
                                                </p>
                                            </div>
                                        )}
                                        
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="font-medium mb-3">Informasi Produk</h3>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Harga:</span>
                                                        <span className="font-medium text-green-600">
                                                            {formatCurrency(product.price)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Stok:</span>
                                                        <span className={`font-medium ${
                                                            product.is_low_stock ? 'text-red-600' : 'text-green-600'
                                                        }`}>
                                                            {product.stock} {product.unit}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Stok Minimum:</span>
                                                        <span className="font-medium">
                                                            {product.min_stock} {product.unit}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Satuan:</span>
                                                        <span className="font-medium">{product.unit}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <h3 className="font-medium mb-3">Informasi Tambahan</h3>
                                                <div className="space-y-3">
                                                    {product.supplier && (
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm">{product.supplier}</span>
                                                        </div>
                                                    )}
                                                    {product.location && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm">{product.location}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm">
                                                            Dibuat: {formatDate(product.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2 pt-4 border-t">
                                            <Link href={`/products/${product.id}/edit`} className="flex-1">
                                                <Button variant="outline" className="w-full">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit Produk
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="outline" 
                                                onClick={handleDelete}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Hapus
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            
                            {/* Stock Management */}
                            <div>
                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="w-5 h-5" />
                                            Kelola Stok
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-4 mb-4">
                                            <div className="text-3xl font-bold mb-2">
                                                {product.stock} {product.unit}
                                            </div>
                                            <p className="text-sm text-gray-600">Stok Saat Ini</p>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Button 
                                                className="w-full" 
                                                onClick={() => {
                                                    setStockFormData(prev => ({ ...prev, type: 'in' }));
                                                    setShowStockForm(true);
                                                }}
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Tambah Stok
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                className="w-full"
                                                onClick={() => {
                                                    setStockFormData(prev => ({ ...prev, type: 'out' }));
                                                    setShowStockForm(true);
                                                }}
                                            >
                                                <Minus className="w-4 h-4 mr-2" />
                                                Kurangi Stok
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                {/* Stock Form */}
                                {showStockForm && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                {stockFormData.type === 'in' ? '📈 Tambah Stok' : '📉 Kurangi Stok'}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleStockSubmit} className="space-y-4">
                                                <div>
                                                    <Label htmlFor="quantity">Jumlah *</Label>
                                                    <Input
                                                        id="quantity"
                                                        type="number"
                                                        min="1"
                                                        value={stockFormData.quantity}
                                                        onChange={(e) => setStockFormData(prev => 
                                                            ({ ...prev, quantity: e.target.value })
                                                        )}
                                                        placeholder="0"
                                                        className={errors.quantity ? 'border-red-500' : ''}
                                                    />
                                                    {errors.quantity && (
                                                        <p className="text-sm text-red-600 mt-1">{errors.quantity}</p>
                                                    )}
                                                </div>
                                                
                                                <div>
                                                    <Label htmlFor="unit_price">Harga Satuan</Label>
                                                    <Input
                                                        id="unit_price"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={stockFormData.unit_price}
                                                        onChange={(e) => setStockFormData(prev => 
                                                            ({ ...prev, unit_price: e.target.value })
                                                        )}
                                                        placeholder="0"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <Label htmlFor="reference">Referensi</Label>
                                                    <Input
                                                        id="reference"
                                                        type="text"
                                                        value={stockFormData.reference}
                                                        onChange={(e) => setStockFormData(prev => 
                                                            ({ ...prev, reference: e.target.value })
                                                        )}
                                                        placeholder="PO, Invoice, dll"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <Label htmlFor="notes">Catatan</Label>
                                                    <Textarea
                                                        id="notes"
                                                        value={stockFormData.notes}
                                                        onChange={(e) => setStockFormData(prev => 
                                                            ({ ...prev, notes: e.target.value })
                                                        )}
                                                        placeholder="Catatan tambahan..."
                                                        rows={2}
                                                    />
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                    <Button 
                                                        type="submit" 
                                                        disabled={isSubmitting}
                                                        className="flex-1"
                                                    >
                                                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                                                    </Button>
                                                    <Button 
                                                        type="button" 
                                                        variant="outline" 
                                                        onClick={() => setShowStockForm(false)}
                                                        disabled={isSubmitting}
                                                    >
                                                        Batal
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                        
                        {/* Stock Movement History */}
                        {product.stock_movements.length > 0 && (
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <History className="w-5 h-5" />
                                        Riwayat Pergerakan Stok
                                    </CardTitle>
                                    <CardDescription>
                                        20 pergerakan stok terbaru
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {product.stock_movements.map((movement) => (
                                            <div 
                                                key={movement.id}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-full ${
                                                        movement.type === 'in' 
                                                            ? 'bg-green-100 text-green-600' 
                                                            : 'bg-red-100 text-red-600'
                                                    }`}>
                                                        {movement.type === 'in' ? (
                                                            <TrendingUp className="w-4 h-4" />
                                                        ) : (
                                                            <TrendingDown className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {movement.type === 'in' ? 'Stok Masuk' : 'Stok Keluar'}: {' '}
                                                            {movement.quantity} {product.unit}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {formatDate(movement.movement_date)}
                                                            {movement.reference && ` • ${movement.reference}`}
                                                        </div>
                                                        {movement.notes && (
                                                            <div className="text-sm text-gray-500 mt-1">
                                                                {movement.notes}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {movement.unit_price && (
                                                    <div className="text-right">
                                                        <div className="font-medium">
                                                            {formatCurrency(movement.unit_price)}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            per {product.unit}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {product.stock_movements.length >= 20 && (
                                        <div className="text-center mt-4">
                                            <Link href={`/stock-movements?product_id=${product.id}`}>
                                                <Button variant="outline">
                                                    Lihat Semua Riwayat
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </AppShell>
        </>
    );
}