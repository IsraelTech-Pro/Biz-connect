import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  CreditCard, 
  ShoppingBag, 
  Calendar, 
  Phone, 
  MessageSquare,
  ExternalLink,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  amount: string;
  currency: string;
  email: string;
  item: string;
  reference: string;
  status: string;
  paid_at: string;
  delivery_time: string;
  vendor_name: string;
  vendor_phone: string;
  vendor_whatsapp: string;
  channel: string;
  created_at: string;
}

interface BuyerStats {
  total_transactions: number;
  total_spent: number;
  successful_payments: number;
  pending_payments: number;
}

export default function BuyerDashboard() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['buyer-transactions'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/buyer/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },
    enabled: !!token
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['buyer-stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/buyer/stats', {
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

  const contactVendor = (vendorPhone: string, vendorWhatsapp: string, item: string) => {
    const message = `Hi! I made a purchase for "${item}" and would like to inquire about the delivery status.`;
    const phoneNumber = vendorWhatsapp || vendorPhone;
    
    if (phoneNumber) {
      const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      toast({
        title: "Contact Info Not Available",
        description: "Vendor contact information is not available.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: string) => {
    return `GH₵${parseFloat(amount).toFixed(2)}`;
  };

  if (transactionsLoading || statsLoading) {
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
                <h1 className="text-2xl font-bold text-gray-900">Buyer Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.full_name}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  Buyer Account
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats?.total_spent || '0')}
              </div>
              <p className="text-xs text-muted-foreground">All time purchases</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_transactions || 0}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats?.successful_payments || 0}
              </div>
              <p className="text-xs text-muted-foreground">Completed orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.pending_payments || 0}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <ShoppingBag className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Cart Dashboard</h3>
              <p className="text-sm text-gray-500 mb-3">View cart and order history</p>
              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={() => window.location.href = '/cart-dashboard'}
              >
                Open Dashboard
              </Button>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Payment Methods</h3>
              <p className="text-sm text-gray-500 mb-3">Manage payment options</p>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = '/payment-methods'}
              >
                Manage
              </Button>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Track Orders</h3>
              <p className="text-sm text-gray-500 mb-3">Monitor delivery status</p>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = '/track-orders'}
              >
                Track
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Payment History</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{transactions.length} transactions</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-gray-600">Your purchase history will appear here once you make your first order.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Item</th>
                      <th className="text-left py-3 px-4 font-medium">Vendor</th>
                      <th className="text-left py-3 px-4 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Delivery</th>
                      <th className="text-left py-3 px-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction: Transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium">{transaction.item}</div>
                            <div className="text-sm text-gray-600">
                              Ref: {transaction.reference}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium">{transaction.vendor_name}</div>
                            {transaction.vendor_phone && (
                              <div className="text-sm text-gray-600 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {transaction.vendor_phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium">
                            {formatCurrency(transaction.amount)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {transaction.currency}
                          </div>
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
                          {transaction.delivery_time ? (
                            <div className="text-sm">
                              <div className="flex items-center text-green-600">
                                <Calendar className="w-3 h-3 mr-1" />
                                {format(new Date(transaction.delivery_time), 'MMM dd')}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              Not specified
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {transaction.status === 'success' && (transaction.vendor_phone || transaction.vendor_whatsapp) ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => contactVendor(
                                transaction.vendor_phone,
                                transaction.vendor_whatsapp,
                                transaction.item
                              )}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Contact
                            </Button>
                          ) : (
                            <div className="text-sm text-gray-500">
                              No contact info
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}