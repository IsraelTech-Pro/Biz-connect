import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Store, MapPin, Star, Package, Users, ShoppingBag, ArrowLeft, Grid3X3, List, Share2, Copy, Download, QrCode } from "lucide-react";
import { User, Product } from "@/shared/schema";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import QRCode from 'qrcode';

export default function VendorDetail() {
  const { id } = useParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const { data: vendor, isLoading: vendorLoading } = useQuery({
    queryKey: [`/api/users/${id}`],
    enabled: !!id,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  // Get the store URL for sharing
  const storeUrl = `${window.location.origin}/vendor/${id}`;

  // Generate QR code
  const generateQRCode = async () => {
    setIsGeneratingQR(true);
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(storeUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingQR(false);
    }
  };

  // Copy business URL to clipboard
  const copyStoreUrl = async () => {
    try {
      await navigator.clipboard.writeText(storeUrl);
      toast({
        title: "Success",
        description: "Business URL copied to clipboard!",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Error",
        description: "Failed to copy URL. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Download QR code
  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.download = `${vendor?.business_name || vendor?.full_name || 'student-business'}-qr.png`;
    link.href = qrCodeUrl;
    link.click();
    
    toast({
      title: "Success",
      description: "QR code downloaded successfully!",
    });
  };

  // Share via Web Share API or fallback
  const shareStore = async () => {
    const shareData = {
      title: `${vendor?.business_name || `${vendor?.full_name}'s Business`} - KTU BizConnect`,
      text: `Check out this amazing student business on KTU BizConnect! ${vendor?.business_description || 'Quality products from KTU student entrepreneur'}`,
      url: storeUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Success",
          description: "Business shared successfully!",
        });
      } catch (error) {
        console.error('Error sharing:', error);
        setIsShareModalOpen(true);
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  // Generate QR code when modal opens
  useEffect(() => {
    if (isShareModalOpen && !qrCodeUrl) {
      generateQRCode();
    }
  }, [isShareModalOpen]);

  if (vendorLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="app-container">
          <div className="mobile-padding py-6">
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded mb-6"></div>
              <div className="h-8 bg-gray-200 rounded mb-4 w-64"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-48"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-40 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="app-container">
          <div className="mobile-padding py-6">
            <div className="text-center">
              <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Vendor not found
              </h3>
              <p className="text-gray-500">
                The vendor you're looking for doesn't exist.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const productsList = products || [];
  const vendorProducts = productsList.filter((product: Product) => product.vendor_id === id);

  const rating = (Math.random() * 2 + 3).toFixed(1);
  const sales = Math.floor(Math.random() * 1000) + 100;
  const followers = Math.floor(Math.random() * 500) + 100;

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  const sortProducts = (products: Product[]) => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'rating':
          return Math.random() - 0.5;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'popular':
        default:
          return Math.random() - 0.5;
      }
    });
  };

  const sortedProducts = sortProducts(vendorProducts);

  const VendorHubProductCard = ({ product }: { product: Product }) => {
    const discountPercent = Math.floor(Math.random() * 40) + 10;
    const originalPrice = parseFloat(product.price) * (1 + discountPercent / 100);
    const itemsLeft = Math.floor(Math.random() * 50) + 1;
    const productRating = (Math.random() * 2 + 3).toFixed(1);
    const ratingCount = Math.floor(Math.random() * 500) + 50;
    
    return (
      <Link to={`/products/${product.id}`} className="block h-full">
        <div className="ktu-card animate-card-lift h-full group">
          <div className="relative overflow-hidden">
            <img 
              src={product.image_url || "/api/placeholder/140/140"} 
              alt={product.title}
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2">
              <span className="bg-ktu-orange text-white text-xs px-2 py-1 rounded font-medium">
                GH₵{product.price}
              </span>
            </div>
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              <button className="p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors text-ktu-dark-grey">
                <Heart className="h-3 w-3" />
              </button>
              <button className="p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors text-ktu-dark-grey">
                <ShoppingBag className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="p-3">
            <div className="mb-2">
              <span className="text-xs text-ktu-orange font-medium">{vendor?.business_name || 'KTU Vendor'}</span>
            </div>
            <h4 className="font-medium text-ktu-deep-blue text-sm mb-1 line-clamp-1 group-hover:text-ktu-orange transition-colors">
              {product.title}
            </h4>
            <p className="text-xs text-ktu-dark-grey line-clamp-2 mb-2">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-ktu-dark-grey">
                  {productRating}
                </span>
                <span className="text-xs text-ktu-dark-grey">
                  ({ratingCount})
                </span>
              </div>
              <span className="text-xs text-ktu-dark-grey">
                {itemsLeft} left
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="app-container">
        {/* Blue Call to Order Banner - Mobile Only */}
        <div className="md:hidden bg-blue-600 text-white py-2 px-4 text-sm font-medium text-center">
          📞 Call to Order - 0302 740 642
        </div>

        <div className="mobile-padding py-6">
          {/* Back Button */}
          <Link to="/student-businesses" className="inline-flex items-center text-sm text-gray-600 hover:text-orange-600 mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Student Businesses
          </Link>

          {/* Vendor Header */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            {/* Store Banner */}
            <div className="h-48 relative" style={{
              backgroundImage: vendor.banner_url && typeof vendor.banner_url === 'object' && vendor.banner_url.url 
                ? `url(${vendor.banner_url.url})` 
                : 'linear-gradient(to right, #fb923c, #ea580c)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-end justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-full overflow-hidden">
                      {vendor.profile_picture && typeof vendor.profile_picture === 'object' && vendor.profile_picture.url ? (
                        <img 
                          src={vendor.profile_picture.url} 
                          alt={vendor.profile_picture.alt || "Store logo"}
                          className="w-8 h-8 object-cover"
                        />
                      ) : (
                        <Store className="w-8 h-8 text-orange-600" />
                      )}
                    </div>
                    <div className="text-white">
                      <h1 className="text-2xl font-bold">
                        {vendor.business_name || `${vendor.full_name}'s Store`}
                      </h1>
                      <p className="text-orange-100">
                        {vendor.business_description || 'Quality products from trusted vendor'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {vendor.status === 'approved' && (
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Verified
                      </div>
                    )}
                    <Button
                      onClick={shareStore}
                      className="btn-orange-primary flex items-center space-x-2 text-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share Business</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Stats */}
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center text-orange-600 mb-2">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{vendorProducts.length}</div>
                  <div className="text-sm text-gray-500">Products</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-yellow-600 mb-2">
                    <Star className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{rating}</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-green-600 mb-2">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{followers}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-blue-600 mb-2">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{sales}</div>
                  <div className="text-sm text-gray-500">Sales</div>
                </div>
              </div>

              {/* Store Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Business Information</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Ghana
                      </div>
                      <div className="flex items-center">
                        <Store className="w-4 h-4 mr-2" />
                        Active since 2024
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>{vendor.email}</div>
                      <div>{vendor.phone || 'Phone not available'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Business Products</h2>
                  <p className="text-sm text-gray-600">
                    {vendorProducts.length} products available
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:border-orange-500 focus:ring-0"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {sortedProducts.length > 0 ? (
                <div className="product-section-container">
                  <div className="mobile-padding py-6">
                    <div className="product-grid">
                      {sortedProducts.map((product) => (
                        <VendorHubProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No products yet
                  </h3>
                  <p className="text-gray-500">
                    This vendor hasn't added any products to their store yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Share Modal */}
        <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-orange-600" />
                <span>Share Store</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Store URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store URL
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={storeUrl}
                    readOnly
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={copyStoreUrl}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code
                </label>
                <div className="flex flex-col items-center space-y-4">
                  {isGeneratingQR ? (
                    <div className="w-[300px] h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Generating QR code...</p>
                      </div>
                    </div>
                  ) : qrCodeUrl ? (
                    <div className="relative">
                      <img 
                        src={qrCodeUrl} 
                        alt="Store QR Code" 
                        className="w-[300px] h-[300px] border border-gray-200 rounded-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                        <Button
                          onClick={downloadQRCode}
                          variant="secondary"
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-[300px] h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">QR code will appear here</p>
                      </div>
                    </div>
                  )}
                  
                  {qrCodeUrl && (
                    <Button
                      onClick={downloadQRCode}
                      className="btn-orange-primary flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download QR Code</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Share Instructions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">How to share:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Copy the store URL and share it directly</li>
                  <li>• Download the QR code and share as an image</li>
                  <li>• When someone scans the QR code, they'll visit your store</li>
                  <li>• Perfect for business cards, flyers, or social media</li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}