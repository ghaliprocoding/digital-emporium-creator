
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { userAPI } from '@/services/api';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Upload } from 'lucide-react';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  storeName: z.string().optional(),
  bio: z.string().max(300, { message: 'Bio must not exceed 300 characters.' }).optional(),
  profileImage: z.instanceof(File).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(user?.profileImage || null);
  const [uploading, setUploading] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      storeName: user?.storeName || '',
      bio: user?.bio || '',
    },
  });
  
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        storeName: user.storeName || '',
        bio: user.bio || '',
      });
      setImagePreview(user.profileImage || null);
    }
  }, [user, form]);
  
  const updateProfileMutation = useMutation({
    mutationFn: (data: FormData) => userAPI.updateUserProfile(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    form.setValue('profileImage', file);
    
    const reader = new FileReader();
    reader.onloadstart = () => setUploading(true);
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };
  
  const onSubmit = async (values: ProfileFormValues) => {
    const formData = new FormData();
    formData.append('name', values.name);
    
    if (values.storeName) {
      formData.append('storeName', values.storeName);
    }
    
    if (values.bio) {
      formData.append('bio', values.bio);
    }
    
    if (values.profileImage) {
      formData.append('profileImage', values.profileImage);
    }
    
    updateProfileMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your profile and store information</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your account settings and store preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center gap-6 mb-6">
                {uploading ? (
                  <div className="h-20 w-20 rounded-full flex items-center justify-center bg-muted">
                    <span className="loader" style={{ width: '24px', height: '24px' }}></span>
                  </div>
                ) : (
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={imagePreview || undefined} alt={user?.name} />
                    <AvatarFallback className="text-lg">
                      {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <Button 
                    type="button"
                    variant="outline"
                    className="relative mb-2"
                  >
                    Change Avatar
                    <Input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Recommended: Square image, at least 300x300px
                  </p>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your store name (optional)" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be displayed on your public store page.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell potential customers about yourself and your products..." 
                        className="min-h-28"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum 300 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
