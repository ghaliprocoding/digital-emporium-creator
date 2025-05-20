
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-brand-600">404</h1>
        <p className="text-2xl font-semibold mt-4 mb-2">Page Not Found</p>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/search">Browse Products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
