
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productAPI, Product } from '@/services/api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Upload } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().min(0.01, { message: 'Price must be at least $0.01.' }),
  imageFile: z.instanceof(File).optional(),
  productFile: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  
  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
    },
  });
  
  // Fetch product data if editing
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getProductById(id as string),
    enabled: isEditing,
  });
  
  // Update form when product data is fetched
  useEffect(() => {
    if (product && isEditing) {
      form.reset({
        title: product.title,
        description: product.description,
        price: product.price,
      });
      setImagePreview(product.imageUrl);
    }
  }, [product, form, isEditing]);
  
  // Create or update product mutation
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (isEditing) {
        return productAPI.updateProduct(id as string, data);
      } else {
        return productAPI.createProduct(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ['product', id] });
      }
      toast({
        title: "Success",
        description: isEditing ? "Product updated successfully" : "Product created successfully",
      });
      navigate('/dashboard/products');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: isEditing ? "Failed to update product" : "Failed to create product",
        variant: "destructive",
      });
      console.error('Product mutation error:', error);
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('price', values.price.toString());
    
    if (values.imageFile) {
      formData.append('image', values.imageFile);
    }
    
    if (values.productFile) {
      formData.append('productFile', values.productFile);
    }
    
    mutation.mutate(formData);
  };
  
  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    form.setValue('imageFile', file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadstart = () => setUploadingImage(true);
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle product file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingFile(true);
    form.setValue('productFile', file);
    setTimeout(() => setUploadingFile(false), 500); // Simulate upload timing
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
        <p className="text-muted-foreground">{isEditing ? 'Update your digital product details' : 'Create a new digital product to sell'}</p>
      </div>
      
      {isLoadingProduct ? (
        <div className="flex justify-center items-center py-20">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your product..." 
                          className="min-h-28"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="9.99" 
                          step="0.01"
                          min="0.01"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormItem>
                    <FormLabel>Product Preview Image</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        {uploadingImage ? (
                          <div className="h-24 w-24 rounded border flex items-center justify-center bg-muted">
                            <span className="loader" style={{ width: '24px', height: '24px' }}></span>
                          </div>
                        ) : imagePreview ? (
                          <div className="h-24 w-24 rounded border overflow-hidden">
                            <img 
                              src={imagePreview}
                              alt="Preview" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-24 w-24 rounded border flex items-center justify-center bg-muted">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <Button 
                            type="button"
                            variant="outline"
                            className="relative"
                            disabled={uploadingImage}
                          >
                            {imagePreview ? 'Change Image' : 'Upload Image'}
                            <Input 
                              type="file" 
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a preview image for your product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Product File</FormLabel>
                    <FormControl>
                      <div>
                        <Button 
                          type="button"
                          variant="outline"
                          className="relative w-full h-24 flex flex-col items-center justify-center gap-2"
                          disabled={uploadingFile}
                        >
                          {uploadingFile ? (
                            <span className="loader" style={{ width: '24px', height: '24px' }}></span>
                          ) : (
                            <>
                              <Upload className="h-8 w-8" />
                              <span>
                                {form.watch('productFile')?.name || 
                                 (isEditing && !form.watch('productFile') ? 'Current file will be kept' : 'Upload your product file')}
                              </span>
                            </>
                          )}
                          <Input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                          />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload the digital product file that customers will download.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => navigate('/dashboard/products')}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tips for Success</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <strong>Great Title:</strong> Be descriptive and include keywords relevant to your product.
              </li>
              <li>
                <strong>Detailed Description:</strong> Clearly explain what your product offers and its benefits.
              </li>
              <li>
                <strong>Eye-catching Image:</strong> Use high-quality images that showcase your product.
              </li>
              <li>
                <strong>Fair Pricing:</strong> Research similar products to set a competitive price point.
              </li>
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
