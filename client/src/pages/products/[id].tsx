import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Star, ShoppingCart, ArrowLeft, Package, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import type { Product } from '@shared/schema';

export default function ProductDetail() {
  const [, params] = useRoute('/products/:id');
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${params?.id}`],
    enabled: !!params?.id,
  });

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">Product not found</div>
            <Link href="/products">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/products">
            <Button variant="ghost" className="text-gray-600 hover:text-black">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <img
              src={product.image_url || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600"}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">{product.title}</h1>
              <p className="text-gray-600">by Vendor Store</p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">(4.5 from 23 reviews)</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-orange-500">
                  ₵{parseFloat(product.price).toFixed(2)}
                </span>
                <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                  {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Category: {product.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Free delivery within Accra</span>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full btn-orange-primary text-white  text-lg py-6"
                disabled={product.stock_quantity <= 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
