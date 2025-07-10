import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Package,
  Calendar,
  Clock,
  CheckCircle,
  User,
  Mail,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  amount: string;
  currency: string;
  item: string;
  reference: string;
  status: string;
  paid_at: string;
  buyer_name: string;
  buyer_email: string;
  channel: string;
  created_at: string;
}

interface Payout {
  id: string;
  amount: string;
  reference: string;
  status: string;
  paid_at: string;
  transfer_code: string;
  reason: string;
  created_at: string;
}

interface VendorStats {
  total_orders: number;
  total_sales: number;
  successful_orders: number;
  pending_orders: number;
  total_payouts: number;
  total_paid: number;
  pending_amount: number;
  total_products: number;
}

export default function VendorDashboard() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['vendor-transactions'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/vendor/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },
    enabled: !!token
  });

  const { data: payouts = [], isLoading: payoutsLoading } = useQuery({
    queryKey: ['vendor-payouts'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/vendor/payouts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch payouts');
      return response.json();
    },
    enabled: !!token
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['vendor-stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/vendor/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
    enabled: !!token
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: string | number) => {
    return `GH₵${parseFloat(amount.toString()).toFixed(2)}`;
  };

  const syncData = async () => {
    try {
      const response = await fetch('/api/sync/transactions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        toast({
          title: "Data Synced",
          description: "Transaction data has been synchronized with Paystack."
        });
        
        // Refresh the data
        window.location.reload();
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync data. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (transactionsLoading || payoutsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.business_name || user?.full_name}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={syncData}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Sync Data</span>
                </Button>
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  <Package className="w-4 h-4 mr-1" />
                  Vendor Account
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Sales</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats?.total_sales || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.successful_orders || 0} successful orders
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_orders || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.pending_orders || 0} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_products || 0}</div>
                  <p className="text-xs text-muted-foreground">Active products</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {formatCurrency(stats?.pending_amount || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total paid: {formatCurrency(stats?.total_paid || 0)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No sales yet. Your transactions will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction: Transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{transaction.item}</div>
                            <div className="text-sm text-gray-600">{transaction.buyer_name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(transaction.amount)}</div>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Sales Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sales yet</h3>
                    <p className="text-gray-600">Your sales transactions will appear here once customers make purchases.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Item</th>
                          <th className="text-left py-3 px-4 font-medium">Buyer</th>
                          <th className="text-left py-3 px-4 font-medium">Amount</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium">Date</th>
                          <th className="text-left py-3 px-4 font-medium">Reference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction: Transaction) => (
                          <tr key={transaction.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="font-medium">{transaction.item}</div>
                              <div className="text-sm text-gray-600">{transaction.channel}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <div>
                                  <div className="font-medium">{transaction.buyer_name}</div>
                                  <div className="text-sm text-gray-600">{transaction.buyer_email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-medium">{formatCurrency(transaction.amount)}</div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={getStatusColor(transaction.status)}>
                                {getStatusIcon(transaction.status)}
                                <span className="ml-1 capitalize">{transaction.status}</span>
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm">
                                {format(new Date(transaction.paid_at || transaction.created_at), 'MMM dd, yyyy')}
                              </div>
                              <div className="text-xs text-gray-600">
                                {format(new Date(transaction.paid_at || transaction.created_at), 'hh:mm a')}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm font-mono text-gray-600">
                                {transaction.reference}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
              </CardHeader>
              <CardContent>
                {payouts.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payouts yet</h3>
                    <p className="text-gray-600">Your payout history will appear here once transfers are processed.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Amount</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium">Date</th>
                          <th className="text-left py-3 px-4 font-medium">Reference</th>
                          <th className="text-left py-3 px-4 font-medium">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payouts.map((payout: Payout) => (
                          <tr key={payout.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="font-medium">{formatCurrency(payout.amount)}</div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={getStatusColor(payout.status)}>
                                {getStatusIcon(payout.status)}
                                <span className="ml-1 capitalize">{payout.status}</span>
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm">
                                {format(new Date(payout.paid_at || payout.created_at), 'MMM dd, yyyy')}
                              </div>
                              <div className="text-xs text-gray-600">
                                {format(new Date(payout.paid_at || payout.created_at), 'hh:mm a')}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm font-mono text-gray-600">
                                {payout.reference}
                              </div>
                              {payout.transfer_code && (
                                <div className="text-xs text-gray-500">
                                  {payout.transfer_code}
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm text-gray-600">
                                {payout.reason || 'Vendor payout'}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}