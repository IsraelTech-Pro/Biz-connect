import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Package, Eye, Upload, X, Save, Sparkles, Zap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { MultiImageUpload } from '@/components/ui/multi-image-upload';
import { AnimatedModal } from '@/components/ui/animated-modal';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import type { Product } from '@shared/schema';

const categories = [
  'Fashion', 'Electronics', 'Beauty', 'Home & Kitchen', 'Food & Beverages', 
  'Toys & Hobbies', 'Pet Products', 'Digital Products', 'Health & Wellness', 
  'DIY & Hardware', 'Other Categories'
];

export default function VendorProducts() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: '',
    tags: '',
    weight: '',
    dimensions: '',
    brand: '',
    sku: '',
    original_price: '',
    discount_percentage: '',
    flash_sale_end_date: '',
    low_stock_threshold: '',
    meta_title: '',
    meta_description: '',
    search_keywords: '',
    status: 'active',
    is_flash_sale: false,
    is_clearance: false,
    is_trending: false,
    is_new_this_week: false,
    is_top_selling: false,
    is_featured: false,
    is_hot_deal: false,
    is_dont_miss: false,
    is_featured_vendor: false
  });

  const [productImages, setProductImages] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/products?vendor=${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
    enabled: !!user?.id && !!token
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      setIsSubmitting(true);
      
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...productData,
          vendor_id: user?.id
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create product');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "🎉 Product Created!",
        description: "Your product has been created successfully and is now live.",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create product. Please try again.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      setIsSubmitting(true);
      
      return apiRequest('PUT', `/api/products/${id}`, {
        ...data,
        image_url: productImages[0] || data.image_url,
        product_images: productImages.length > 0 ? productImages.map((url, index) => ({
          url,
          alt: `Product image ${index + 1}`,
          primary: index === 0
        })) : []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "✨ Product Updated!",
        description: "Your product has been updated successfully.",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update product. Please try again.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Product Deleted",
        description: "Your product has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      stock_quantity: '',
      category: '',
      tags: '',
      weight: '',
      dimensions: '',
      brand: '',
      sku: '',
      original_price: '',
      discount_percentage: '',
      flash_sale_end_date: '',
      low_stock_threshold: '',
      meta_title: '',
      meta_description: '',
      search_keywords: '',
      status: 'active',
      is_flash_sale: false,
      is_clearance: false,
      is_trending: false,
      is_new_this_week: false,
      is_top_selling: false,
      is_featured: false,
      is_hot_deal: false,
      is_dont_miss: false,
      is_featured_vendor: false
    });
    setProductImages([]);
    setCurrentStep(1);
    setEditingProduct(null);
    setIsDialogOpen(false);
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    
    if (productImages.length === 0) {
      toast({
        title: "Images Required",
        description: "Please upload at least one product image.",
        variant: "destructive"
      });
      return;
    }
    
    const productData = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      category: formData.category,
      image_url: productImages[0] || '',
      product_images: productImages.map((url, index) => ({
        url,
        alt: `Product image ${index + 1}`,
        primary: index === 0
      })),
      brand: formData.brand || null,
      sku: formData.sku || null,
      weight: formData.weight || null,
      dimensions: formData.dimensions || null,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
      original_price: formData.original_price || null,
      discount_percentage: parseInt(formData.discount_percentage) || 0,
      flash_sale_end_date: formData.flash_sale_end_date ? new Date(formData.flash_sale_end_date) : null,
      low_stock_threshold: parseInt(formData.low_stock_threshold) || 10,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      search_keywords: formData.search_keywords ? formData.search_keywords.split(',').map(k => k.trim()).filter(k => k) : [],
      status: formData.status || 'active',
      is_flash_sale: formData.is_flash_sale,
      is_clearance: formData.is_clearance,
      is_trending: formData.is_trending,
      is_new_this_week: formData.is_new_this_week,
      is_top_selling: formData.is_top_selling,
      is_featured: formData.is_featured,
      is_hot_deal: formData.is_hot_deal,
      is_dont_miss: formData.is_dont_miss,
      is_featured_vendor: formData.is_featured_vendor,
      vendor_id: user?.id
    };

    console.log('Submitting product data:', productData);

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity.toString(),
      category: product.category,
      tags: product.tags ? product.tags.join(', ') : '',
      weight: product.weight || '',
      dimensions: product.dimensions || '',
      brand: product.brand || '',
      sku: product.sku || '',
      original_price: product.original_price || '',
      discount_percentage: product.discount_percentage?.toString() || '',
      flash_sale_end_date: product.flash_sale_end_date || '',
      low_stock_threshold: product.low_stock_threshold?.toString() || '',
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || '',
      search_keywords: product.search_keywords ? product.search_keywords.join(', ') : '',
      status: product.status || 'active',
      is_flash_sale: product.is_flash_sale || false,
      is_clearance: product.is_clearance || false,
      is_trending: product.is_trending || false,
      is_new_this_week: product.is_new_this_week || false,
      is_top_selling: product.is_top_selling || false,
      is_featured: product.is_featured || false,
      is_hot_deal: product.is_hot_deal || false,
      is_dont_miss: product.is_dont_miss || false,
      is_featured_vendor: product.is_featured_vendor || false
    });
    
    // Set existing images - handle both old image_url format and new product_images format
    const existingImages = [];
    if (product.product_images && Array.isArray(product.product_images)) {
      existingImages.push(...product.product_images.map(img => img.url));
    } else if (product.image_url) {
      existingImages.push(product.image_url);
    }
    setProductImages(existingImages);
    setCurrentStep(1);
    setIsDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(productId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/vendor/dashboard">
                <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-black">My Products</h1>
            <p className="text-gray-600 mt-2">Manage your product inventory</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
              onClick={() => setIsDialogOpen(true)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </motion.div>
        </div>

        {/* Modern Animated Modal */}
        <AnimatedModal
          isOpen={isDialogOpen}
          onClose={resetForm}
          title={editingProduct ? 'Edit Product' : 'Create New Product'}
          size="2xl"
        >
          <div className="min-h-[600px]">
            {/* Step Progress Bar */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        currentStep >= step 
                          ? 'btn-orange-primary text-white shadow-lg' 
                          : 'bg-gray-200 text-gray-500'
                      }`}
                      animate={{
                        scale: currentStep === step ? 1.1 : 1,
                        boxShadow: currentStep === step ? '0 4px 12px rgba(249, 115, 22, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {step}
                    </motion.div>
                    {step < 3 && (
                      <div className={`w-16 h-1 rounded-full mx-2 transition-all duration-300 ${
                        currentStep > step ? 'btn-orange-primary' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Labels */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-16 text-sm">
                <span className={`transition-colors ${currentStep >= 1 ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>
                  Product Details
                </span>
                <span className={`transition-colors ${currentStep >= 2 ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>
                  Images
                </span>
                <span className={`transition-colors ${currentStep >= 3 ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>
                  Product Details & Tags
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="title" className="text-sm font-medium">Product Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter product title"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your product in detail..."
                        rows={4}
                        className="mt-1"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="price" className="text-sm font-medium">Price (₵) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="0.00"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="original_price" className="text-sm font-medium">Original Price (₵)</Label>
                        <Input
                          id="original_price"
                          type="number"
                          step="0.01"
                          value={formData.original_price}
                          onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                          placeholder="0.00"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="discount_percentage" className="text-sm font-medium">Discount %</Label>
                        <Input
                          id="discount_percentage"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.discount_percentage}
                          onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                          placeholder="0"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="stock_quantity" className="text-sm font-medium">Stock Quantity *</Label>
                        <Input
                          id="stock_quantity"
                          type="number"
                          value={formData.stock_quantity}
                          onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                          placeholder="0"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="low_stock_threshold" className="text-sm font-medium">Low Stock Threshold</Label>
                        <Input
                          id="low_stock_threshold"
                          type="number"
                          value={formData.low_stock_threshold}
                          onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                          placeholder="10"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="brand" className="text-sm font-medium">Brand</Label>
                        <Input
                          id="brand"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          placeholder="Product brand"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sku" className="text-sm font-medium">SKU</Label>
                        <Input
                          id="sku"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          placeholder="Product SKU"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="weight" className="text-sm font-medium">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.01"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          placeholder="0.00"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dimensions" className="text-sm font-medium">Dimensions</Label>
                        <Input
                          id="dimensions"
                          value={formData.dimensions}
                          onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                          placeholder="L x W x H"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Images */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <MultiImageUpload
                      images={productImages}
                      onImagesChange={setProductImages}
                      maxImages={5}
                      token={token}
                    />
                  </motion.div>
                )}

                {/* Step 3: Product Details & Tags */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="Comma separated tags (e.g., electronics, mobile, smartphone)"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="low_stock_threshold" className="text-sm font-medium">Low Stock Alert Threshold</Label>
                      <Input
                        id="low_stock_threshold"
                        type="number"
                        value={formData.low_stock_threshold}
                        onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                        placeholder="Alert when stock falls below this number"
                        className="mt-1"
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-900">Product Review Process</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Your product will be reviewed by our team for quality and compliance. 
                            Promotional categories, pricing strategies, and SEO optimization are handled by our marketing team.
                          </p>
                        </div>
                      </div>
                    </div>


                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t">
                <div>
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center space-x-2"
                    >
                      <span>Previous</span>
                    </Button>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="btn-orange-primary  text-white"
                      disabled={
                        (currentStep === 1 && (!formData.title || !formData.category || !formData.description || !formData.price || !formData.stock_quantity)) ||
                        (currentStep === 2 && productImages.length === 0)
                      }
                    >
                      <span>Next</span>
                      <Zap className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {editingProduct ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {editingProduct ? 'Update Product' : 'Create Product'}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AnimatedModal>

        {/* Products Grid */}
        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-6">Start building your store by adding your first product</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <Card className="h-full">
                    <CardHeader className="p-0">
                      <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        <img
                          src={product.image_url || '/api/placeholder/400/400'}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            className="bg-white/90 hover:bg-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-500/90 hover:bg-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg truncate">{product.title}</h3>
                        <Badge variant="secondary" className="ml-2">
                          {product.category}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-orange-600">₵{product.price}</span>
                        <span className="text-sm text-gray-500">Stock: {product.stock_quantity}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}