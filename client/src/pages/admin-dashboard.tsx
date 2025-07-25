import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Users, Store, Package, DollarSign, TrendingUp, 
  Eye, Edit, Trash2, Plus, Search, Filter, 
  CheckCircle, XCircle, Clock, BarChart3,
  GraduationCap, BookOpen, MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch all data
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: vendors = [], isLoading: vendorsLoading } = useQuery({
    queryKey: ['/api/vendors'],
  });

  // Calculate statistics
  const stats = {
    totalUsers: (users as any[]).length,
    totalVendors: (vendors as any[]).length,
    totalProducts: (products as any[]).length,
    activeVendors: (vendors as any[]).filter((v: any) => v.is_approved).length,
    pendingVendors: (vendors as any[]).filter((v: any) => !v.is_approved).length,
    totalSales: (products as any[]).reduce((sum: number, p: any) => sum + parseFloat(p.price || 0), 0)
  };

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="ktu-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ktu-dark-grey">{title}</p>
              <p className="text-2xl font-bold text-ktu-deep-blue">{value}</p>
              {change && (
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {change}
                </p>
              )}
            </div>
            <div className={`p-3 rounded-full ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const VendorRow = ({ vendor, index }: any) => (
    <motion.tr
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="hover:bg-ktu-light-blue/20"
    >
      <TableCell>
        <div className="flex items-center space-x-3">
          <img 
            src={vendor.profile_picture?.url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`}
            alt={vendor.full_name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-ktu-deep-blue">{vendor.full_name}</p>
            <p className="text-sm text-ktu-dark-grey">{vendor.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium text-ktu-deep-blue">{vendor.business_name}</p>
          <p className="text-sm text-ktu-dark-grey line-clamp-1">{vendor.business_description}</p>
        </div>
      </TableCell>
      <TableCell>
        <Badge 
          variant={vendor.is_approved ? "default" : "secondary"}
          className={vendor.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
        >
          {vendor.is_approved ? "Approved" : "Pending"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" className="text-ktu-orange hover:text-ktu-orange">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-ktu-deep-blue hover:text-ktu-deep-blue">
            <Edit className="h-4 w-4" />
          </Button>
          {!vendor.is_approved && (
            <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-600">
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </motion.tr>
  );

  const ProductRow = ({ product, index }: any) => (
    <motion.tr
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="hover:bg-ktu-light-blue/20"
    >
      <TableCell>
        <div className="flex items-center space-x-3">
          <img 
            src={product.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50&h=50&fit=crop"}
            alt={product.title}
            className="w-12 h-12 rounded object-cover"
          />
          <div>
            <p className="font-medium text-ktu-deep-blue">{product.title}</p>
            <p className="text-sm text-ktu-dark-grey">{product.category}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="font-medium text-ktu-deep-blue">{product.brand}</p>
      </TableCell>
      <TableCell>
        <p className="font-bold text-ktu-orange">₵{parseFloat(product.price).toFixed(2)}</p>
      </TableCell>
      <TableCell>
        <Badge 
          variant={product.stock_quantity > 0 ? "default" : "secondary"}
          className={product.stock_quantity > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
        >
          {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" className="text-ktu-orange hover:text-ktu-orange">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-ktu-deep-blue hover:text-ktu-deep-blue">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </motion.tr>
  );

  if (usersLoading || productsLoading || vendorsLoading) {
    return (
      <div className="min-h-screen bg-ktu-grey flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ktu-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ktu-grey">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-ktu-light-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-ktu-deep-blue">KTU BizConnect Admin</h1>
                <p className="text-ktu-dark-grey mt-1">Manage student entrepreneurs and business ecosystem</p>
              </div>
              <Badge className="bg-ktu-orange text-white">
                <GraduationCap className="w-4 h-4 mr-2" />
                System Administrator
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vendors">Student Vendors</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">All Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Users" 
                value={stats.totalUsers} 
                icon={Users} 
                color="bg-ktu-deep-blue"
                change="+12% this month"
              />
              <StatCard 
                title="Student Vendors" 
                value={stats.totalVendors} 
                icon={Store} 
                color="bg-ktu-orange" 
                change="+8% this month"
              />
              <StatCard 
                title="Total Products" 
                value={stats.totalProducts} 
                icon={Package} 
                color="bg-green-500" 
                change="+23% this month"
              />
              <StatCard 
                title="Total Value" 
                value={`₵${stats.totalSales.toFixed(2)}`} 
                icon={DollarSign} 
                color="bg-purple-500" 
                change="+15% this month"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Approve Vendors", subtitle: `${stats.pendingVendors} pending`, icon: CheckCircle, color: "ktu-orange-gradient" },
                { title: "Review Products", subtitle: "Manage catalog", icon: Package, color: "ktu-hero-gradient" },
                { title: "Mentorship Hub", subtitle: "Manage mentors", icon: GraduationCap, color: "ktu-orange-gradient" },
                { title: "Business Resources", subtitle: "Content management", icon: BookOpen, color: "ktu-hero-gradient" }
              ].map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`ktu-card animate-card-lift cursor-pointer ${action.color}`}>
                    <CardContent className="p-6 text-center text-white">
                      <action.icon className="h-8 w-8 mx-auto mb-3" />
                      <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                      <p className="text-sm opacity-90">{action.subtitle}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <Card className="ktu-card">
              <CardHeader>
                <CardTitle className="text-ktu-deep-blue">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(vendors as any[]).slice(0, 5).map((vendor: any, index: number) => (
                    <div key={vendor.id} className="flex items-center justify-between p-3 hover:bg-ktu-light-blue/20 rounded">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={vendor.profile_picture?.url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`}
                          alt={vendor.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-ktu-deep-blue">{vendor.full_name}</p>
                          <p className="text-xs text-ktu-dark-grey">Registered new business: {vendor.business_name}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-ktu-orange border-ktu-orange">
                        New
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vendors" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ktu-dark-grey h-4 w-4" />
                <Input
                  placeholder="Search student vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-ktu-light-blue focus:border-ktu-orange"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48 border-ktu-light-blue">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vendors Table */}
            <Card className="ktu-card">
              <CardHeader>
                <CardTitle className="text-ktu-deep-blue">Student Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(vendors as any[])
                      .filter((vendor: any) => {
                        const matchesSearch = vendor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            vendor.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesStatus = filterStatus === 'all' || 
                                            (filterStatus === 'approved' && vendor.is_approved) ||
                                            (filterStatus === 'pending' && !vendor.is_approved);
                        return matchesSearch && matchesStatus;
                      })
                      .map((vendor: any, index: number) => (
                        <VendorRow key={vendor.id} vendor={vendor} index={index} />
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            {/* Products Table */}
            <Card className="ktu-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-ktu-deep-blue">Product Catalog</CardTitle>
                  <Button className="bg-ktu-orange hover:bg-ktu-orange-light">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(products as any[]).map((product: any, index: number) => (
                      <ProductRow key={product.id} product={product} index={index} />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* Users Management */}
            <Card className="ktu-card">
              <CardHeader>
                <CardTitle className="text-ktu-deep-blue">All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-16 w-16 mx-auto mb-4 text-ktu-dark-grey opacity-50" />
                  <h3 className="text-lg font-semibold text-ktu-deep-blue mb-2">User Management</h3>
                  <p className="text-ktu-dark-grey mb-4">Comprehensive user management features coming soon</p>
                  <Button className="bg-ktu-orange hover:bg-ktu-orange-light">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;