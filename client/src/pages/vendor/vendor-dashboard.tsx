import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ShoppingBag, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Users, 
  Star,
  Clock,
  Eye,
  BarChart3,
  Calendar,
  Activity,
  Zap,
  Sparkles,
  Settings,
  Plus,
  MessageSquare,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';

interface VendorStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  pendingPayouts: number;
}

interface RecentOrder {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  buyer_name?: string;
}

export default function VendorDashboard() {
  const { user, token } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [animationKey, setAnimationKey] = useState(0);

  const { data: stats, isLoading: statsLoading } = useQuery<VendorStats>({
    queryKey: ['/api/vendors', user?.id, 'stats'],
    queryFn: async () => {
      const response = await fetch(`/api/vendors/${user?.id}/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },
    enabled: !!user?.id && !!token
  });

  const { data: recentOrders = [], isLoading: ordersLoading } = useQuery<RecentOrder[]>({
    queryKey: ['/api/orders', 'vendor', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/orders?vendor=${user?.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const orders = await response.json();
      return orders.slice(0, 5);
    },
    enabled: !!user?.id && !!token
  });

  const { data: products = [] } = useQuery({
    queryKey: ['/api/products', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/products?vendor=${user?.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },
    enabled: !!user?.id && !!token
  });

  const { data: recentPayments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['/api/vendors', user?.id, 'payments'],
    queryFn: async () => {
      const response = await fetch(`/api/vendors/${user?.id}/payments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const payments = await response.json();
      return payments.slice(0, 5);
    },
    enabled: !!user?.id && !!token
  });

  const { data: payouts = [] } = useQuery({
    queryKey: ['/api/vendors', user?.id, 'payouts'],
    queryFn: async () => {
      const response = await fetch(`/api/vendors/${user?.id}/payouts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },
    enabled: !!user?.id && !!token
  });

  // Trigger animation when stats change
  useEffect(() => {
    if (stats) {
      setAnimationKey(prev => prev + 1);
    }
  }, [stats]);

  const statCards = [
    {
      title: "Total Sales",
      value: stats?.totalSales || 0,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      prefix: "₵",
      trend: "+12.5%",
      description: "vs last month",
      trendUp: true
    },
    {
      title: "Total Orders", 
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+8.3%",
      description: "vs last month",
      trendUp: true
    },
    {
      title: "Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "+2",
      description: "new this month",
      trendUp: true
    },
    {
      title: "Pending Payouts",
      value: stats?.pendingPayouts || 0,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      prefix: "₵",
      description: "awaiting processing",
      trendUp: false
    }
  ];

  const quickActions = [
    { title: "Add Product", icon: Plus, color: "text-blue-600", bgColor: "bg-blue-100", href: "/vendor/products" },
    { title: "View Orders", icon: MessageSquare, color: "text-green-600", bgColor: "bg-green-100", href: "/vendor/orders" },
    { title: "Analytics", icon: BarChart3, color: "text-purple-600", bgColor: "bg-purple-100", href: "/vendor/analytics" },
    { title: "Settings", icon: Settings, color: "text-orange-600", bgColor: "bg-orange-100", href: "/vendor/settings" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black mb-2">
                Welcome back, {user?.business_name || user?.full_name}! 
                <motion.span
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block ml-2"
                >
                  👋
                </motion.span>
              </h1>
              <p className="text-gray-600">Here's what's happening with your store today</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Link href="/vendor/analytics">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Activity className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatePresence>
            {statCards.map((card, index) => (
              <motion.div
                key={`${card.title}-${animationKey}`}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -2, scale: 1.01 }}
                className="group"
              >
                <Card className="relative overflow-hidden bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                      {card.title}
                      <div className={`p-2 rounded-lg ${card.bgColor}`}>
                        <card.icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline space-x-2">
                      <motion.span
                        key={card.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-2xl font-bold text-gray-900"
                      >
                        {card.prefix}{typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                      </motion.span>
                      {card.trend && (
                        <div className="flex items-center space-x-1">
                          {card.trendUp ? (
                            <ChevronUp className="w-3 h-3 text-green-500" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-red-500" />
                          )}
                          <span className={`text-xs ${card.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                            {card.trend}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-orange-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={action.href}>
                  <Card className="cursor-pointer hover:shadow-md transition-all duration-200 group">
                    <CardContent className="p-4 text-center">
                      <div className={`inline-flex p-3 rounded-lg ${action.bgColor} mb-3 group-hover:scale-105 transition-transform`}>
                        <action.icon className={`w-6 h-6 ${action.color}`} />
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm">{action.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders and Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center text-lg">
                    <ShoppingBag className="w-5 h-5 mr-2 text-gray-700" />
                    Recent Orders
                  </span>
                  <Link href="/vendor/orders">
                    <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900">
                      <Eye className="w-4 h-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center justify-between py-3 border-b">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {recentOrders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Order #{order.id.slice(-8)}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <span className="font-semibold text-gray-900">₵{order.total_amount || order.amount}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent orders found</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* My Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center text-lg">
                    <Package className="w-5 h-5 mr-2 text-gray-700" />
                    My Products
                  </span>
                  <Link href="/vendor/products/grid">
                    <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900">
                      <Eye className="w-4 h-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No products yet</p>
                    <p className="text-sm text-gray-400 mb-4">Add your first product to start selling</p>
                    <Link href="/vendor/products">
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {products.slice(0, 5).map((product: any, index: number) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.title}</p>
                              <p className="text-sm text-gray-500">{product.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge className={product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {product.status}
                            </Badge>
                            <span className="font-semibold text-gray-900">₵{product.price}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Payments and Payouts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center text-lg">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Recent Payments
                  </span>
                  <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center justify-between py-3 border-b">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                ) : recentPayments.length > 0 ? (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {recentPayments.map((payment: any, index: number) => (
                        <motion.div
                          key={payment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {payment.paystack_reference || payment.reference}
                              </p>
                              <p className="text-sm text-gray-500">
                                {payment.payment_method} • {new Date(payment.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge className={payment.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {payment.status}
                            </Badge>
                            <span className="font-semibold text-gray-900">₵{payment.amount}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent payments found</p>
                    <p className="text-sm text-gray-400">Payments will appear here when customers make purchases</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Payouts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center text-lg">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Payouts
                  </span>
                  <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payouts.length > 0 ? (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {payouts.slice(0, 5).map((payout: any, index: number) => (
                        <motion.div
                          key={payout.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                              <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {payout.transaction_id || `Payout #${payout.id.slice(-8)}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                {payout.momo_number} • {new Date(payout.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge className={payout.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {payout.status}
                            </Badge>
                            <span className="font-semibold text-gray-900">₵{payout.amount}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No payouts yet</p>
                    <p className="text-sm text-gray-400">Payouts will appear here when you receive payments</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">4.8</div>
                  <div className="text-sm opacity-90 flex items-center justify-center mt-1">
                    <Star className="w-4 h-4 mr-1" />
                    Average Rating
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">89%</div>
                  <div className="text-sm opacity-90 flex items-center justify-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Conversion Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">2.4k</div>
                  <div className="text-sm opacity-90 flex items-center justify-center mt-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Monthly Views
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}