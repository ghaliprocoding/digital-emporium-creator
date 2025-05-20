
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { userAPI, productAPI } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserStore: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userAPI.getUserProfile(userId as string),
    enabled: !!userId,
  });
  
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['userStoreProducts', userId],
    queryFn: () => productAPI.getUserStoreProducts(userId as string),
    enabled: !!userId,
  });
  
  const isLoading = isLoadingUser || isLoadingProducts;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Store not found</h1>
          <p className="text-muted-foreground mb-6">This creator's store doesn't exist or has been removed.</p>
          <Button asChild>
            <a href="/">Return Home</a>
          </Button>
        </div>
      </div>
    );
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-brand-600 to-accent text-white py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-3xl font-bold">
                {user.storeName || `${user.name}'s Store`}
              </h1>
              {user.bio && (
                <p className="max-w-2xl text-white/90">{user.bio}</p>
              )}
              <p className="text-sm text-white/80">Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto max-w-6xl py-10 px-4 md:px-6">
        <h2 className="text-2xl font-bold mb-6">Products by {user.name}</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-4">This creator hasn't uploaded any products yet.</p>
            <Button asChild variant="outline">
              <a href="/">Browse Other Products</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStore;
