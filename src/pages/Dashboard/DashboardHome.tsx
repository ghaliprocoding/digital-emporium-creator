
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { productAPI, Product } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['userProducts'],
    queryFn: productAPI.getUserProducts,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Manage your digital products and store settings</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/products/new">Add New Product</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{products.length}</CardTitle>
            <CardDescription>Total Products</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard/products" className="text-sm text-brand-600 hover:underline">
              View all products →
            </Link>
          </CardContent>
        </Card>
        {/* More cards with stats would go here in a real app */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">0</CardTitle>
            <CardDescription>Total Sales</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard/sales" className="text-sm text-brand-600 hover:underline">
              View sales report →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">$0.00</CardTitle>
            <CardDescription>Revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard/earnings" className="text-sm text-brand-600 hover:underline">
              View earnings →
            </Link>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Products</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loader"></span>
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">You haven't added any products yet</p>
              <Button asChild>
                <Link to="/dashboard/products/new">Add Your First Product</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        
        {products.length > 3 && (
          <div className="mt-6 text-center">
            <Button asChild variant="outline">
              <Link to="/dashboard/products">View All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
