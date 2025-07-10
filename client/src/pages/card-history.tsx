import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  CreditCard, 
  Calendar,
  Filter,
  Search,
  Package,
  User,
  Phone,
  MessageSquare,
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-context';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  item: string;
  reference: string;
  status: string;
  paid_at: string;
  delivery_time?: string;
  vendor_name?: string;
  vendor_phone?: string;
  vendor_whatsapp?: string;
  channel: string;
  created_at: string;
  type: 'incoming' | 'outgoing';
  payment_method?: string;
  mobile_number?: string;
  network_provider?: string;
  buyer_name?: string;
  buyer_email?: string;
  buyer_phone?: string;
  product_id?: string;
}

export default function CardHistory() {
  const { user, token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Fetch buyer transactions (payments made)
  const { data: buyerTransactions = [] } = useQuery<Transaction[]>({
    queryKey: ['/api/dashboard/buyer/transactions', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/buyer/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch buyer transactions');
      const data = await response.json();
      return data.map((t: any) => ({ ...t, type: 'outgoing' }));
    },
    enabled: !!user?.id && !!token
  });

  // Fetch vendor transactions (payments received)
  const { data: vendorTransactions = [] } = useQuery<Transaction[]>({
    queryKey: ['/api/vendors', user?.id, 'payments'],
    queryFn: async () => {
      const response = await fetch(`/api/vendors/${user?.id}/payments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch vendor transactions');
      const data = await response.json();
      return data.map((t: any) => ({ ...t, type: 'incoming' }));
    },
    enabled: !!user?.id && !!token && (user?.role === 'vendor' || user?.role === 'admin')
  });

  // Combine all transactions
  const allTransactions = [...buyerTransactions, ...vendorTransactions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'failed': return <XCircle className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'incoming' ? 'text-green-600' : 'text-red-600';
  };

  const getTypeIcon = (type: string) => {
    return type === 'incoming' ? 
      <ArrowDownLeft className="w-4 h-4 text-green-600" /> : 
      <ArrowUpRight className="w-4 h-4 text-red-600" />;
  };

  const totalIncoming = vendorTransactions
    .filter(t => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutgoing = buyerTransactions
    .filter(t => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-orange-600" />
                <span>Card History</span>
              </h1>
              <p className="text-gray-600 mt-1">Complete transaction history for your account</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Received</p>
                <p className="text-lg font-semibold text-green-600">₵{totalIncoming.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-lg font-semibold text-red-600">₵{totalOutgoing.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by reference, item, or vendor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="incoming">Received</SelectItem>
                  <SelectItem value="outgoing">Sent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        {filteredTransactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No transactions found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Your transaction history will appear here'
              }
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <Card className="border-l-4 border-l-orange-500">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(transaction.type)}
                          <div>
                            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                              <span>{transaction.item}</span>
                              {transaction.product_id && (
                                <Link to={`/products/${transaction.product_id}`}>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </Link>
                              )}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm text-gray-500">
                                {transaction.reference}
                              </span>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="text-sm text-gray-500">
                                {new Date(transaction.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(transaction.status)} flex items-center space-x-1`}>
                            {getStatusIcon(transaction.status)}
                            <span className="capitalize">{transaction.status}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium">Amount</span>
                          </div>
                          <p className={`text-lg font-bold ${getTypeColor(transaction.type)}`}>
                            {transaction.type === 'incoming' ? '+' : '-'}₵{transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.channel || transaction.payment_method || 'Unknown'}
                            {transaction.network_provider && ` (${transaction.network_provider.toUpperCase()})`}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium">
                              {transaction.type === 'incoming' ? 'From' : 'To'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {transaction.type === 'incoming' 
                              ? transaction.buyer_name || transaction.buyer_email || 'N/A'
                              : transaction.vendor_name || 'N/A'
                            }
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.type === 'incoming' 
                              ? transaction.buyer_phone || transaction.buyer_email || 'N/A'
                              : transaction.vendor_phone || 'N/A'
                            }
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium">Transaction Date</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.paid_at || transaction.created_at).toLocaleString()}
                          </p>
                          {transaction.type === 'incoming' && transaction.vendor_whatsapp && (
                            <a
                              href={`https://wa.me/${transaction.vendor_whatsapp.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-green-600 hover:text-green-700"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span className="text-sm">WhatsApp</span>
                            </a>
                          )}
                        </div>
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