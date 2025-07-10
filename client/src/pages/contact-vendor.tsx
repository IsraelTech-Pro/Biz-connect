import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  User,
  Building,
  Sparkles,
  Star,
  ShoppingCart,
  Package
} from 'lucide-react';
import type { Product } from '@shared/schema';

interface VendorInfo {
  id: string;
  business_name: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  location?: string;
  bio?: string;
  rating?: number;
  total_orders?: number;
  response_time?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface ContactVendorPageProps {
  vendorId?: string;
  orderItems?: CartItem[];
  deliveryRequest?: boolean;
}

const ContactVendorPage: React.FC<ContactVendorPageProps> = () => {
  const [, params] = useRoute('/contact-vendor/:vendorId');
  const [, setLocation] = useLocation();
  const [vendorInfo, setVendorInfo] = useState<VendorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderReference, setOrderReference] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const vendorId = params?.vendorId;
  
  // Parse URL parameters for item data
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('itemId');
  const quantity = urlParams.get('quantity') || '1';

  useEffect(() => {
    const fetchVendorInfo = async () => {
      if (!vendorId) return;
      
      try {
        const response = await fetch(`/api/users/${vendorId}`);
        if (response.ok) {
          const data = await response.json();
          setVendorInfo(data);
        }
      } catch (error) {
        console.error('Error fetching vendor info:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchItemData = async () => {
      // If specific item ID is provided, fetch that item
      if (itemId) {
        try {
          const response = await fetch(`/api/products/${itemId}`);
          if (response.ok) {
            const product = await response.json();
            setCartItems([{
              product,
              quantity: parseInt(quantity)
            }]);
          }
        } catch (error) {
          console.error('Error fetching item data:', error);
        }
      } else {
        // Retrieve cart items from localStorage
        try {
          // First check for delivery items (from checkout modal)
          let cartData = localStorage.getItem('deliveryItems');
          console.log('Delivery items from localStorage:', cartData);
          
          if (!cartData) {
            // Fallback to regular cart
            cartData = localStorage.getItem('cart');
            console.log('Cart data from localStorage:', cartData);
          }
          
          if (cartData) {
            const cart = JSON.parse(cartData);
            console.log('Parsed cart data:', cart);
            
            // Handle different cart data structures
            if (Array.isArray(cart)) {
              setCartItems(cart);
            } else if (cart.items && Array.isArray(cart.items)) {
              setCartItems(cart.items);
            } else if (typeof cart === 'object' && cart !== null) {
              // Convert object to array if it's a single item
              setCartItems([cart]);
            }
            
            // Clear delivery items after loading to prevent stale data
            if (localStorage.getItem('deliveryItems')) {
              localStorage.removeItem('deliveryItems');
            }
          } else {
            console.log('No cart data found in localStorage');
          }
        } catch (error) {
          console.error('Error retrieving cart:', error);
        }
      }
    };

    fetchVendorInfo();
    fetchItemData();
    
    // Generate order reference
    setOrderReference(Math.random().toString(36).substr(2, 9).toUpperCase());
  }, [vendorId, itemId, quantity]);

  const handleCall = () => {
    window.open(`tel:${vendorInfo?.phone || '055 103 5300'}`);
  };

  const handleWhatsApp = () => {
    let whatsappNumber = vendorInfo?.whatsapp || vendorInfo?.phone || '0551035300';
    
    // Clean the number and format for international use
    whatsappNumber = whatsappNumber.replace(/[^0-9]/g, '');
    
    // Add Ghana country code if number starts with 0
    if (whatsappNumber.startsWith('0')) {
      whatsappNumber = '233' + whatsappNumber.substring(1);
    }
    
    let itemDetails = '';
    if (cartItems.length > 0) {
      itemDetails = '\n\nItems to Purchase:\n';
      cartItems.forEach((item, index) => {
        const product = item.product || item;
        const quantity = item.quantity || 1;
        const currentUrl = window.location.origin;
        const productUrl = `${currentUrl}/products/${product.id}`;
        itemDetails += `${index + 1}. ${product.title} (Qty: ${quantity}) - GH₵ ${(product.price * quantity).toFixed(2)}\n   View: ${productUrl}\n`;
      });
      itemDetails += `\nTotal: GH₵ ${total.toFixed(2)} (${itemCount} items)`;
    }
    
    const message = `Hello ${vendorInfo?.business_name || 'Vendor'}! I'm interested in your products and would like to arrange delivery.\n\nOrder Reference: ${orderReference}${itemDetails}\n\nPlease contact me to discuss delivery arrangements. Thank you!`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`);
  };

  const handleEmail = () => {
    const subject = `Delivery Request - Order ${orderReference}`;
    
    let itemDetails = '';
    if (cartItems.length > 0) {
      itemDetails = '\n\nItems to Purchase:\n';
      cartItems.forEach((item, index) => {
        const product = item.product || item;
        const quantity = item.quantity || 1;
        const currentUrl = window.location.origin;
        const productUrl = `${currentUrl}/products/${product.id}`;
        itemDetails += `${index + 1}. ${product.title} (Qty: ${quantity}) - GH₵ ${(product.price * quantity).toFixed(2)}\n   View: ${productUrl}\n`;
      });
      itemDetails += `\nTotal: GH₵ ${total.toFixed(2)} (${itemCount} items)`;
    }
    
    const body = `Hello ${vendorInfo?.business_name || 'Vendor'},\n\nI would like to arrange delivery for my order.\n\nOrder Reference: ${orderReference}${itemDetails}\n\nPlease contact me to discuss delivery arrangements.\n\nThank you!`;
    window.open(`mailto:${vendorInfo?.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  // Calculate cart totals using the same logic as checkout modal
  const calculateCartTotals = () => {
    if (!cartItems || cartItems.length === 0) {
      return { subtotal: 0, total: 0, itemCount: 0 };
    }

    const subtotal = cartItems.reduce((sum, item) => {
      const product = item.product || item; // Handle different cart data structures
      const quantity = item.quantity || 1;
      return sum + (product.price * quantity);
    }, 0);

    const itemCount = cartItems.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      return sum + quantity;
    }, 0);

    return {
      subtotal,
      total: subtotal, // No delivery fee for now
      itemCount
    };
  };

  const { subtotal, total, itemCount } = calculateCartTotals();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => setLocation('/')}
            variant="ghost"
            className="mb-4 text-orange-500 hover:text-orange-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shopping
          </Button>
          
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: 0.2
              }}
              className="relative mx-auto mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0.3, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 w-20 h-20 bg-orange-400 rounded-full opacity-30"
              />
            </motion.div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2">
              Delivery Request Sent!
            </h1>
            <p className="text-gray-600 text-lg">
              Contact {vendorInfo?.business_name || 'the vendor'} to arrange delivery
            </p>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 mb-8"
        >
          <div className="flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-orange-500 mr-2" />
            <span className="font-semibold text-orange-800">What happens next?</span>
          </div>
          <p className="text-gray-700 text-center leading-relaxed">
            {vendorInfo?.business_name || 'The vendor'} will contact you within 24 hours to arrange delivery and payment details.
          </p>
          <div className="mt-4 text-center">
            <Badge variant="outline" className="bg-white text-orange-600 border-orange-300">
              Order Reference: #{orderReference}
            </Badge>
          </div>
        </motion.div>

        {/* Cart Summary */}
        {cartItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Order Summary ({itemCount} items)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {cartItems.map((item, index) => {
                    const product = item.product || item; // Handle different cart data structures
                    const quantity = item.quantity || 1;
                    const imageUrl = product.product_images?.[0]?.url || product.image_url || '/placeholder-product.jpg';
                    
                    return (
                      <div key={index} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={imageUrl} 
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div>
                            <h4 className="font-medium text-gray-800">{product.title}</h4>
                            <p className="text-sm text-gray-600">Qty: {quantity}</p>
                            <p className="text-xs text-blue-600 truncate">
                              Product ID: {product.id}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            GH₵ {(product.price * quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            GH₵ {product.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">Total:</span>
                      <span className="text-xl font-bold text-orange-600">
                        GH₵ {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  No Cart Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 text-center">
                  No items found in your cart. The vendor will help you with product selection.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Vendor Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {/* Vendor Details */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Vendor Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {vendorInfo?.business_name || 'Business Name'}
                  </h3>
                  <p className="text-gray-600 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {vendorInfo?.full_name || 'Owner Name'}
                  </p>
                </div>
                
                {vendorInfo?.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {vendorInfo.location}
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{vendorInfo?.rating || 4.5}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {vendorInfo?.total_orders || 150}+ orders
                  </div>
                </div>
                
                <div className="flex items-center text-green-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Usually responds within {vendorInfo?.response_time || '2 hours'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Methods */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardTitle>Contact Methods</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Button
                  onClick={handleCall}
                  className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Phone className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Call Now</div>
                    <div className="text-sm opacity-90">
                      {vendorInfo?.phone || '055 103 5300'}
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={handleWhatsApp}
                  className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">WhatsApp</div>
                    <div className="text-sm opacity-90">Quick response</div>
                  </div>
                </Button>

                <Button
                  onClick={handleEmail}
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Mail className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Email</div>
                    <div className="text-sm opacity-90">Send details</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">💡 Tips for contacting the vendor</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700">
              <ul className="space-y-2">
                <li>• Mention your order reference number: #{orderReference}</li>
                <li>• Provide your preferred delivery time and location</li>
                <li>• Ask about payment options (cash, mobile money, etc.)</li>
                <li>• Confirm delivery fees and estimated time</li>
                <li>• Request product availability confirmation</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactVendorPage;