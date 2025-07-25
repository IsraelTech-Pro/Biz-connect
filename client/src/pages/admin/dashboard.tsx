import { useQuery } from '@tanstack/react-query';
import { Users, ShoppingCart, TrendingUp, Wallet, Store, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import type { User, Order } from '@shared/schema';

interface PlatformStats {
  totalVendors: number;
  totalOrders: number;
  platformRevenue: number;
  pendingPayouts: number;
}

export default function AdminDashboard() {
  const { token } = useAuth();

  const { data: stats } = useQuery<PlatformStats>({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.json();
    },
    enabled: !!token
  });

  const { data: pendingVendors = [] } = useQuery<User[]>({
    queryKey: ['/api/vendors/pending'],
    queryFn: async () => {
      const response = await fetch('/api/vendors/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.json();
    },
    enabled: !!token
  });

  const { data: recentOrders = [] } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.json();
    },
    enabled: !!token
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform overview and management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Vendors</p>
                  <p className="text-2xl font-bold text-black">{stats?.totalVendors || 0}</p>
                </div>
                <Store className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-black">{stats?.totalOrders || 0}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Platform Revenue</p>
                  <p className="text-2xl font-bold text-black">₵{stats?.platformRevenue ? stats.platformRevenue.toFixed(2) : '0.00'}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
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
          {/* Pending Vendor Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pending Vendor Approvals</span>
                <Badge variant="secondary">{pendingVendors.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingVendors.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p>No pending approvals</p>
                  </div>
                ) : (
                  pendingVendors.slice(0, 5).map((vendor) => (
                    <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 btn-orange-primary rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-black">{vendor.store_name || 'Unnamed Store'}</p>
                          <p className="text-sm text-gray-600">{vendor.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p>No recent orders</p>
                  </div>
                ) : (
                  recentOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold text-black">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">
                          {order.buyer_email} • {formatDate(order.created_at || '')}
                        </p>
                        <p className="text-sm font-medium text-orange-500">
                          ₵{parseFloat(order.amount).toFixed(2)}
                        </p>
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
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="bg-blue-500 hover:bg-blue-600 justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Vendors
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 justify-start">
                <ShoppingCart className="h-4 w-4 mr-2" />
                View All Orders
              </Button>
              <Button className="bg-purple-500 hover:bg-purple-600 justify-start">
                <Wallet className="h-4 w-4 mr-2" />
                Process Payouts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
