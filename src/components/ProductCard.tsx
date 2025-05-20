
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/services/api';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/products/${product._id}`}>
      <Card className="overflow-hidden product-card border-0 shadow-md h-full flex flex-col">
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={product.imageUrl || '/placeholder.svg'} 
            alt={product.title}
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
        <CardContent className="p-4 flex-grow">
          <h3 className="font-semibold text-lg line-clamp-2 mb-1">{product.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <p className="font-medium text-brand-600">${product.price.toFixed(2)}</p>
          {product.creator && (
            <p className="text-xs text-muted-foreground">By {product.creator.name}</p>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
