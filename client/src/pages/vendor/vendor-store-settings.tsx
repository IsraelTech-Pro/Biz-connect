import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Store, 
  Image, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Settings,
  CheckCircle,
  AlertCircle,
  Upload
} from 'lucide-react';

const storeSettingsSchema = z.object({
  business_name: z.string().min(2, 'Business name must be at least 2 characters'),
  business_description: z.string().min(20, 'Business description must be at least 20 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  momo_number: z.string().min(10, 'Mobile Money number must be at least 10 characters'),
  profile_picture: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
  banner_url: z.string().url('Please enter a valid banner URL').optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal('')),
});

type StoreSettingsForm = z.infer<typeof storeSettingsSchema>;

export default function VendorStoreSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('general');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<StoreSettingsForm>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      business_name: user?.business_name || '',
      business_description: user?.business_description || '',
      phone: user?.phone || '',
      address: user?.address || '',
      momo_number: user?.momo_number || '',
      profile_picture: user?.profile_picture || '',
      banner_url: user?.banner_url || '',
      bio: user?.bio || '',
    },
  });

  const updateStoreMutation = useMutation({
    mutationFn: async (data: StoreSettingsForm) => {
      return await apiRequest(`/api/users/${user!.id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Store settings updated!",
        description: "Your store information has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating store settings",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: StoreSettingsForm) => {
    updateStoreMutation.mutate(data);
  };

  if (!user || user.role !== 'vendor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible to vendors.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">
            Store <span className="text-gradient">Settings</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Customize your store appearance and manage your business information
          </p>
        </div>

        {/* Approval Status */}
        <Card className="mb-8 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                user.is_approved ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {user.is_approved ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-black">
                  {user.is_approved ? 'Store Approved' : 'Pending Approval'}
                </h3>
                <p className="text-sm text-gray-600">
                  {user.is_approved 
                    ? 'Your store is live and customers can purchase your products.'
                    : 'Your store is under review. You can still manage your products and settings.'
                  }
                </p>
              </div>
              <Badge 
                className={user.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
              >
                {user.is_approved ? 'Active' : 'Pending'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Store className="w-5 h-5" />
                  <span>Business Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="business_name">Business Name</Label>
                      <Input
                        id="business_name"
                        {...register('business_name')}
                        placeholder="Enter your business name"
                        className="mt-1"
                      />
                      {errors.business_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.business_name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        placeholder="+233 24 123 4567"
                        className="mt-1"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="business_description">Business Description</Label>
                    <Textarea
                      id="business_description"
                      {...register('business_description')}
                      placeholder="Describe your business, what you sell, and what makes you unique..."
                      className="mt-1"
                      rows={4}
                    />
                    {errors.business_description && (
                      <p className="text-red-500 text-sm mt-1">{errors.business_description.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Business Address</Label>
                    <Textarea
                      id="address"
                      {...register('address')}
                      placeholder="Enter your business address"
                      className="mt-1"
                      rows={3}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <Textarea
                      id="bio"
                      {...register('bio')}
                      placeholder="Tell customers about yourself and your business story..."
                      className="mt-1"
                      rows={3}
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={updateStoreMutation.isPending}
                  >
                    {updateStoreMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Image className="w-5 h-5" />
                  <span>Store Appearance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="profile_picture">Profile Picture URL</Label>
                    <Input
                      id="profile_picture"
                      {...register('profile_picture')}
                      placeholder="https://example.com/profile.jpg"
                      className="mt-1"
                    />
                    {errors.profile_picture && (
                      <p className="text-red-500 text-sm mt-1">{errors.profile_picture.message}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      This will be displayed as your store logo
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="banner_url">Banner Image URL</Label>
                    <Input
                      id="banner_url"
                      {...register('banner_url')}
                      placeholder="https://example.com/banner.jpg"
                      className="mt-1"
                    />
                    {errors.banner_url && (
                      <p className="text-red-500 text-sm mt-1">{errors.banner_url.message}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      This will be displayed as your store banner
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-black mb-2">Preview</h4>
                    <div className="space-y-4">
                      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-500 ml-2">Banner Preview</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <Store className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-black">{user.business_name}</p>
                          <p className="text-sm text-gray-600">{user.business_description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={updateStoreMutation.isPending}
                  >
                    {updateStoreMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="momo_number">Mobile Money Number</Label>
                    <Input
                      id="momo_number"
                      {...register('momo_number')}
                      placeholder="0241234567"
                      className="mt-1"
                    />
                    {errors.momo_number && (
                      <p className="text-red-500 text-sm mt-1">{errors.momo_number.message}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      This number will be used for payment transfers
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Payment Information</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Payments are processed weekly</li>
                      <li>• Minimum payout amount: ₵50.00</li>
                      <li>• Platform commission: 5%</li>
                      <li>• Payouts are sent to your Mobile Money number</li>
                    </ul>
                  </div>

                  <Button 
                    type="submit" 
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={updateStoreMutation.isPending}
                  >
                    {updateStoreMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}