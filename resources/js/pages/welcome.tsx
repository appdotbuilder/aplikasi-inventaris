import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Package, 
    Plus, 
    Search, 
    Filter, 
    AlertTriangle,
    TrendingUp,
    Package2,
    DollarSign,
    Eye,
    Edit,
    Trash2,

} from 'lucide-react';

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
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Stats {
    total_products: number;
    active_products: number;
    low_stock_products: number;
    total_value: number;
}

interface Props {
    products: PaginatedProducts;
    categories: string[];
    stats: Stats;
    filters: {
        search?: string;
        category?: string;
        status?: string;
        low_stock?: boolean;
    };
    [key: string]: unknown;
}

export default function Welcome({ products, categories, stats, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', { ...filters, search: searchTerm }, { preserveState: true });
    };
    
    const handleFilter = (key: string, value: string | boolean) => {
        router.get('/', { ...filters, [key]: value === '' ? undefined : value }, { 
            preserveState: true,
            replace: true 
        });
    };
    
    const clearFilters = () => {
        router.get('/', {}, { preserveState: true });
    };
    
    const handleDelete = (product: Product) => {
        if (confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) {
            router.delete(`/products/${product.id}`, {
                onSuccess: () => {
                    // Page will be reloaded automatically
                }
            });
        }
    };
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <>
            <Head title="📦 Sistem Inventaris - Kelola Stok Produk Anda" />
            
            <AppShell>
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                                    📦 Sistem Inventaris
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Kelola stok produk dan inventaris dengan mudah
                                </p>
                            </div>
                            <Link href="/products/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Tambah Produk
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
                                <Package className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_products}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.active_products} aktif
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Stok Menipis</CardTitle>
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {stats.low_stock_products}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Perlu restok
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Nilai</CardTitle>
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(stats.total_value)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Nilai inventaris
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Produk Aktif</CardTitle>
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {stats.active_products}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Siap jual
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filter & Pencarian
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4">
                                <form onSubmit={handleSearch} className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            type="text"
                                            placeholder="Cari produk berdasarkan nama, kode, atau kategori..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </form>
                                
                                <div className="flex gap-2">
                                    <Select
                                        value={filters.category || ''}
                                        onValueChange={(value) => handleFilter('category', value)}
                                    >
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Semua Kategori</SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    
                                    <Select
                                        value={filters.status || ''}
                                        onValueChange={(value) => handleFilter('status', value)}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Semua Status</SelectItem>
                                            <SelectItem value="active">Aktif</SelectItem>
                                            <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    
                                    <Button
                                        variant={filters.low_stock ? "default" : "outline"}
                                        onClick={() => handleFilter('low_stock', !filters.low_stock)}
                                        className="whitespace-nowrap"
                                    >
                                        <AlertTriangle className="w-4 h-4 mr-1" />
                                        Stok Menipis
                                    </Button>
                                    
                                    <Button variant="outline" onClick={clearFilters}>
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.data.map((product) => (
                            <Card key={product.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg leading-tight mb-1">
                                                {product.name}
                                            </CardTitle>
                                            <CardDescription className="text-sm">
                                                {product.code} • {product.category}
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-1 ml-2">
                                            <Badge 
                                                variant={product.status === 'active' ? 'default' : 'secondary'}
                                                className="text-xs"
                                            >
                                                {product.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                            </Badge>
                                            {product.is_low_stock && (
                                                <Badge variant="destructive" className="text-xs">
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                    Menipis
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="pt-0">
                                    <div className="space-y-3">
                                        <div className="text-2xl font-bold text-green-600">
                                            {formatCurrency(product.price)}
                                        </div>
                                        
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Stok:</span>
                                            <span className={`font-medium ${
                                                product.is_low_stock ? 'text-red-600' : 'text-green-600'
                                            }`}>
                                                {product.stock} {product.unit}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Min. Stok:</span>
                                            <span className="font-medium">{product.min_stock} {product.unit}</span>
                                        </div>
                                        
                                        {product.supplier && (
                                            <div className="text-sm text-gray-600 truncate">
                                                Supplier: {product.supplier}
                                            </div>
                                        )}
                                        
                                        {product.location && (
                                            <div className="text-sm text-gray-600">
                                                📍 {product.location}
                                            </div>
                                        )}
                                        
                                        <div className="flex gap-2 pt-2">
                                            <Link href={`/products/${product.id}`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    Detail
                                                </Button>
                                            </Link>
                                            <Link href={`/products/${product.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => handleDelete(product)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {products.data.length === 0 && (
                        <Card className="text-center py-12">
                            <CardContent>
                                <Package2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Tidak ada produk ditemukan
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {filters.search || filters.category || filters.status || filters.low_stock
                                        ? 'Coba ubah filter pencarian Anda'
                                        : 'Mulai dengan menambahkan produk pertama Anda'
                                    }
                                </p>
                                <div className="flex gap-2 justify-center">
                                    {(filters.search || filters.category || filters.status || filters.low_stock) && (
                                        <Button variant="outline" onClick={clearFilters}>
                                            Reset Filter
                                        </Button>
                                    )}
                                    <Link href="/products/create">
                                        <Button>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Tambah Produk
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination */}
                    {products.last_page > 1 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex gap-2">
                                {products.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </AppShell>
        </>
    );
}