import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Plus,
  Settings,
  BarChart3,
  Users,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  pendingPayouts: number;
  viewsThisMonth: number;
  averageRating: number;
}

interface RecentOrder {
  id: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  product_count: number;
}

interface Product {
  id: string;
  title: string;
  price: number;
  stock_quantity: number;
  status: string;
  created_at: string;
  product_images?: Array<{ url: string; alt: string; primary: boolean }>;
}

export default function VendorDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not a vendor
  useEffect(() => {
    if (user && user.role !== 'vendor') {
      setLocation('/');
    }
  }, [user, setLocation]);

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/vendor/dashboard/stats'],
    enabled: !!user && user.role === 'vendor'
  });

  // Fetch recent orders
  const { data: recentOrders, isLoading: ordersLoading } = useQuery<RecentOrder[]>({
    queryKey: ['/api/vendor/orders/recent'],
    enabled: !!user && user.role === 'vendor'
  });

  // Fetch vendor products
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/vendor/products'],
    enabled: !!user && user.role === 'vendor'
  });

  if (!user || user.role !== 'vendor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need to be a vendor to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/vendor/register">
              <Button className="w-full">Become a Vendor</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.business_name || user?.full_name}!
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/vendor/products">
                <Button variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Manage Products
                </Button>
              </Link>
              <Link href="/vendor/settings">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : stats?.totalProducts || 0}
              </div>
              <p className="text-xs text-gray-600">Active listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : stats?.totalOrders || 0}
              </div>
              <p className="text-xs text-gray-600">All time orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₵{statsLoading ? '0.00' : stats?.totalSales?.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-gray-600">Revenue earned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '0.0' : stats?.averageRating?.toFixed(1) || '0.0'}
              </div>
              <p className="text-xs text-gray-600">Customer rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your store efficiently</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/vendor/products" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Product
                    </Button>
                  </Link>
                  <Link href="/vendor/orders" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      View All Orders
                    </Button>
                  </Link>
                  <Link href="/vendor/analytics" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  </Link>
                  <Link href="/vendor/settings" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Store Settings
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Store Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Store Performance</CardTitle>
                  <CardDescription>This month's highlights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Store Views</span>
                    </div>
                    <span className="font-semibold">
                      {statsLoading ? '...' : stats?.viewsThisMonth || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Pending Payouts</span>
                    </div>
                    <span className="font-semibold">
                      ₵{statsLoading ? '0.00' : stats?.pendingPayouts?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Active Products</span>
                    </div>
                    <span className="font-semibold">
                      {statsLoading ? '...' : products?.filter(p => p.status === 'active').length || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Products</CardTitle>
                  <CardDescription>Manage your product catalog</CardDescription>
                </div>
                <Link href="/vendor/products">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products && products.length > 0 ? (
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                          {product.product_images && product.product_images.length > 0 ? (
                            <img 
                              src={product.product_images[0].url} 
                              alt={product.product_images[0].alt}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{product.title}</h4>
                          <p className="text-sm text-gray-600">₵{product.price.toFixed(2)}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                              {product.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Stock: {product.stock_quantity}
                            </span>
                          </div>
                        </div>
                        <Link href={`/vendor/products`}>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </Link>
                      </div>
                    ))}
                    {products.length > 5 && (
                      <div className="text-center pt-4">
                        <Link href="/vendor/products">
                          <Button variant="outline">View All Products</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first product to your store.</p>
                    <Link href="/vendor/products">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Product
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your latest customer orders</CardDescription>
                </div>
                <Link href="/vendor/orders">
                  <Button variant="outline">View All Orders</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentOrders && recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(order.status)}
                          <div>
                            <h4 className="font-semibold">Order #{order.id.slice(0, 8)}</h4>
                            <p className="text-sm text-gray-600">
                              {order.customer_name} • {order.product_count} item(s)
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₵{order.total_amount.toFixed(2)}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600">Orders will appear here when customers start buying from your store.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Store Analytics</CardTitle>
                <CardDescription>Detailed insights into your store performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-600 mb-4">
                    Detailed analytics including sales charts, customer insights, and performance metrics will be available soon.
                  </p>
                  <Link href="/vendor/analytics">
                    <Button variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Full Analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}