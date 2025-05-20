
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productAPI, Product } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);
  
  // Get all products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productAPI.getAllProducts,
  });
  
  // Filter products based on search term
  const filteredProducts = queryParam
    ? products.filter((product: Product) =>
        product.title.toLowerCase().includes(queryParam.toLowerCase()) ||
        product.description.toLowerCase().includes(queryParam.toLowerCase())
      )
    : products;
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm });
    } else {
      setSearchParams({});
    }
  };
  
  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  return (
    <div className="min-h-screen py-10 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loader"></span>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                {queryParam 
                  ? `Search results for "${queryParam}" (${filteredProducts.length})` 
                  : 'All Products'}
              </h2>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground mb-4">
                  No products found matching your search.
                </p>
                <Button onClick={() => setSearchParams({})}>View All Products</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product: Product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
