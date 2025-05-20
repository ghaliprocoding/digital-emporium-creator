
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productAPI, Product } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productAPI.getAllProducts,
  });
  
  // Filter products based on active tab (in a real app, this would be API-based)
  const filteredProducts = products.filter((product: Product) => {
    if (activeTab === 'all') return true;
    // This is a placeholder - in a real app, products would have categories
    return activeTab === 'popular';
  });

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-brand-600 to-accent py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Discover & Download Premium Digital Products
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90">
            Find the perfect digital resources created by talented creators from around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/search">Browse Products</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/register">Start Selling</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured products section */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Discover our handpicked selection of premium digital goods</p>
            </div>
            <Tabs defaultValue="all" className="mt-4 md:mt-0" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="new">Newest</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <span className="loader"></span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-lg text-destructive mb-4">Failed to load products</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.slice(0, 8).map((product: Product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <p className="text-lg text-muted-foreground mb-4">No products found</p>
                  </div>
                )}
              </div>
              
              {filteredProducts.length > 8 && (
                <div className="text-center mt-12">
                  <Button asChild size="lg" variant="outline">
                    <Link to="/search">View All Products</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-slate-50 py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to share your creations with the world?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of creators and start selling your digital products today.
            No technical skills required.
          </p>
          <Button asChild size="lg">
            <Link to="/register">Start Selling Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
