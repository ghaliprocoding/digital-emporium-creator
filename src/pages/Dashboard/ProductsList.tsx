
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { productAPI, Product } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Pencil, Trash } from 'lucide-react';

const ProductsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['userProducts'],
    queryFn: productAPI.getUserProducts,
  });
  
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => productAPI.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
      console.error('Delete error:', error);
    },
  });
  
  const filteredProducts = searchTerm.trim()
    ? products.filter((product: Product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  const handleDelete = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Button asChild>
          <Link to="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center border rounded-md p-1 w-full max-w-sm">
        <Search className="h-4 w-4 mx-2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <span className="loader"></span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="p-8 text-center">
          {searchTerm ? (
            <>
              <p className="mb-4 text-muted-foreground">No products found matching "{searchTerm}"</p>
              <Button variant="outline" onClick={() => setSearchTerm('')}>Clear Search</Button>
            </>
          ) : (
            <>
              <p className="mb-4 text-muted-foreground">You haven't added any products yet</p>
              <Button asChild>
                <Link to="/dashboard/products/new">Add Your First Product</Link>
              </Button>
            </>
          )}
        </Card>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product: Product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-slate-100 overflow-hidden">
                        <img 
                          src={product.imageUrl || '/placeholder.svg'} 
                          alt={product.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="max-w-[200px] truncate">{product.title}</div>
                    </div>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{new Date(product.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/dashboard/products/edit/${product._id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setProductToDelete(product._id as string)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your
                              product and remove it from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
