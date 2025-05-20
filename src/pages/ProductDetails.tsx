
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getProductById(id as string),
    enabled: !!id,
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }
  
  if (error || !product) {
    return <Navigate to="/not-found" />;
  }
  
  const isOwner = user && product.creator && user._id === product.creator._id;
  
  const handleDownload = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to download this product",
      });
      return;
    }
    
    // In a real app, this would validate purchase first
    window.open(product.fileUrl, '_blank');
  };
  
  return (
    <div className="min-h-screen py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden">
            <img 
              src={product.imageUrl || '/placeholder.svg'} 
              alt={product.title} 
              className="w-full h-auto object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-brand-600">${product.price.toFixed(2)}</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>About the Creator</CardTitle>
                <CardDescription>
                  {product.creator && (
                    <Link 
                      to={`/store/${product.creator._id}`}
                      className="text-brand-600 hover:underline"
                    >
                      {product.creator.name}
                    </Link>
                  )}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/store/${product.creator?._id}`}>
                    Visit Creator's Store
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            {isOwner ? (
              <div className="flex flex-col gap-3">
                <Button asChild className="w-full">
                  <Link to={`/dashboard/products/edit/${product._id}`}>
                    Edit Product
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={handleDownload}>
                  Download Your File
                </Button>
              </div>
            ) : (
              <Button className="w-full" size="lg" onClick={handleDownload}>
                {isAuthenticated ? 'Download Now' : 'Sign In to Download'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
