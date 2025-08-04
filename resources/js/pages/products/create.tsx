import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

interface Props {
    categories: string[];
    [key: string]: unknown;
}

export default function CreateProduct({ categories }: Props) {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        min_stock: '',
        unit: 'pcs',
        supplier: '',
        location: '',
        status: 'active',
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        router.post('/products', formData, {
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            },
            onSuccess: () => {
                // Redirect will happen automatically
            }
        });
    };
    
    const goBack = () => {
        router.get('/');
    };

    return (
        <>
            <Head title="Tambah Produk - Sistem Inventaris" />
            
            <AppShell>
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
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
                            
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                ➕ Tambah Produk Baru
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Masukkan informasi produk yang akan ditambahkan ke inventaris
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Produk</CardTitle>
                                <CardDescription>
                                    Lengkapi semua informasi produk dengan benar
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Product Code */}
                                        <div className="space-y-2">
                                            <Label htmlFor="code">Kode Produk *</Label>
                                            <Input
                                                id="code"
                                                type="text"
                                                value={formData.code}
                                                onChange={(e) => handleInputChange('code', e.target.value)}
                                                placeholder="Contoh: PRD-001"
                                                className={errors.code ? 'border-red-500' : ''}
                                            />
                                            {errors.code && (
                                                <p className="text-sm text-red-600">{errors.code}</p>
                                            )}
                                        </div>
                                        
                                        {/* Product Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nama Produk *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                placeholder="Nama produk"
                                                className={errors.name ? 'border-red-500' : ''}
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-600">{errors.name}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Deskripsi</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="Deskripsi detail produk..."
                                            rows={3}
                                            className={errors.description ? 'border-red-500' : ''}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-600">{errors.description}</p>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Category */}
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Kategori *</Label>
                                            <Select 
                                                value={formData.category} 
                                                onValueChange={(value) => handleInputChange('category', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih kategori" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat} value={cat}>
                                                            {cat}
                                                        </SelectItem>
                                                    ))}
                                                    <SelectItem value="Elektronik">Elektronik</SelectItem>
                                                    <SelectItem value="Makanan & Minuman">Makanan & Minuman</SelectItem>
                                                    <SelectItem value="Pakaian">Pakaian</SelectItem>
                                                    <SelectItem value="Peralatan Rumah Tangga">Peralatan Rumah Tangga</SelectItem>
                                                    <SelectItem value="Kecantikan & Kesehatan">Kecantikan & Kesehatan</SelectItem>
                                                    <SelectItem value="Otomotif">Otomotif</SelectItem>
                                                    <SelectItem value="Olahraga">Olahraga</SelectItem>
                                                    <SelectItem value="Buku & Alat Tulis">Buku & Alat Tulis</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.category && (
                                                <p className="text-sm text-red-600">{errors.category}</p>
                                            )}
                                        </div>
                                        
                                        {/* Price */}
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Harga (Rp) *</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={(e) => handleInputChange('price', e.target.value)}
                                                placeholder="0"
                                                className={errors.price ? 'border-red-500' : ''}
                                            />
                                            {errors.price && (
                                                <p className="text-sm text-red-600">{errors.price}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Stock */}
                                        <div className="space-y-2">
                                            <Label htmlFor="stock">Stok Awal *</Label>
                                            <Input
                                                id="stock"
                                                type="number"
                                                min="0"
                                                value={formData.stock}
                                                onChange={(e) => handleInputChange('stock', e.target.value)}
                                                placeholder="0"
                                                className={errors.stock ? 'border-red-500' : ''}
                                            />
                                            {errors.stock && (
                                                <p className="text-sm text-red-600">{errors.stock}</p>
                                            )}
                                        </div>
                                        
                                        {/* Min Stock */}
                                        <div className="space-y-2">
                                            <Label htmlFor="min_stock">Stok Minimum *</Label>
                                            <Input
                                                id="min_stock"
                                                type="number"
                                                min="0"
                                                value={formData.min_stock}
                                                onChange={(e) => handleInputChange('min_stock', e.target.value)}
                                                placeholder="0"
                                                className={errors.min_stock ? 'border-red-500' : ''}
                                            />
                                            {errors.min_stock && (
                                                <p className="text-sm text-red-600">{errors.min_stock}</p>
                                            )}
                                        </div>
                                        
                                        {/* Unit */}
                                        <div className="space-y-2">
                                            <Label htmlFor="unit">Satuan *</Label>
                                            <Select 
                                                value={formData.unit} 
                                                onValueChange={(value) => handleInputChange('unit', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih satuan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pcs">Pcs</SelectItem>
                                                    <SelectItem value="kg">Kg</SelectItem>
                                                    <SelectItem value="liter">Liter</SelectItem>
                                                    <SelectItem value="meter">Meter</SelectItem>
                                                    <SelectItem value="box">Box</SelectItem>
                                                    <SelectItem value="pack">Pack</SelectItem>
                                                    <SelectItem value="unit">Unit</SelectItem>
                                                    <SelectItem value="dozen">Lusin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.unit && (
                                                <p className="text-sm text-red-600">{errors.unit}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Supplier */}
                                        <div className="space-y-2">
                                            <Label htmlFor="supplier">Supplier</Label>
                                            <Input
                                                id="supplier"
                                                type="text"
                                                value={formData.supplier}
                                                onChange={(e) => handleInputChange('supplier', e.target.value)}
                                                placeholder="Nama supplier"
                                                className={errors.supplier ? 'border-red-500' : ''}
                                            />
                                            {errors.supplier && (
                                                <p className="text-sm text-red-600">{errors.supplier}</p>
                                            )}
                                        </div>
                                        
                                        {/* Location */}
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Lokasi Penyimpanan</Label>
                                            <Input
                                                id="location"
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => handleInputChange('location', e.target.value)}
                                                placeholder="Contoh: Gudang A, Rak 1"
                                                className={errors.location ? 'border-red-500' : ''}
                                            />
                                            {errors.location && (
                                                <p className="text-sm text-red-600">{errors.location}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Status */}
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status *</Label>
                                        <Select 
                                            value={formData.status} 
                                            onValueChange={(value) => handleInputChange('status', value)}
                                        >
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Aktif</SelectItem>
                                                <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <p className="text-sm text-red-600">{errors.status}</p>
                                        )}
                                    </div>
                                    
                                    {/* Submit Button */}
                                    <div className="flex gap-4 pt-6">
                                        <Button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="flex-1"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={goBack}
                                            disabled={isSubmitting}
                                        >
                                            Batal
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppShell>
        </>
    );
}