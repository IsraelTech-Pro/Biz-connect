import { useQuery } from '@tanstack/react-query';
import { TrendingUp, ShoppingBag, Package, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@shared/schema';

interface VendorStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  pendingPayouts: number;
}

export default function VendorDashboard() {
  const { user } = useAuth();

  const { data: stats } = useQuery<VendorStats>({
    queryKey: [`/api/vendors/${user?.id}/stats`],
    enabled: !!user?.id,
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });

  const recentOrders = orders.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Vendor Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.store_name || user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Sales</p>
                  <p className="text-2xl font-bold text-black">₵{stats?.totalSales ? stats.totalSales.toFixed(2) : '0.00'}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Orders</p>
                  <p className="text-2xl font-bold text-black">{stats?.totalOrders || 0}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Products</p>
                  <p className="text-2xl font-bold text-black">{stats?.totalProducts || 0}</p>
                </div>
                <Package className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending Payouts</p>
                  <p className="text-2xl font-bold text-black">₵{stats?.pendingPayouts ? stats.pendingPayouts.toFixed(2) : '0.00'}</p>
                </div>
                <Wallet className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No orders yet
                  </div>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold text-black">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">₵{parseFloat(order.amount).toFixed(2)}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mobile Money Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Mobile Money Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 btn-orange-primary rounded-full flex items-center justify-center">
                    <i className="fas fa-mobile-alt text-white"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-black">MTN Mobile Money</p>
                    <p className="text-sm text-gray-600">Receive payouts instantly</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">MoMo Number</p>
                    <p className="text-gray-600">{user?.momo_number || 'Not set'}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${user?.momo_verified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-sm ${user?.momo_verified ? 'text-green-600' : 'text-red-600'}`}>
                      {user?.momo_verified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
