import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users,
  Store,
  Package,
  DollarSign,
  TrendingUp,
  Settings,
  BookOpen,
  UserCheck,
  BarChart3,
  Plus,
  Eye,
  Edit,
  Shield,
  Activity,
  Target,
  FileText,
  CheckCircle,
  XCircle,
  MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Removed useAuth import - admin has separate authentication
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'wouter';

interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingApprovals: number;
  activePrograms: number;
  totalMentors: number;
  totalResources: number;
  publishedResources: number;
}

interface Business {
  id: string;
  business_name: string;
  full_name: string;
  email: string;
  is_approved: boolean;
  created_at: string;
  total_products: number;
  total_sales: number;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_approved: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [adminUser, setAdminUser] = useState<any>(null);
  
  // Get admin token once at component level
  const adminToken = localStorage.getItem('admin_token');

  // Check for admin authentication on component mount
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    const adminUserData = localStorage.getItem('admin_user');
    
    if (!adminToken || !adminUserData) {
      setLocation('/admin/login');
      return;
    }
    
    // Verify token is still valid
    try {
      const userData = JSON.parse(adminUserData);
      if (!userData.username) {
        throw new Error('Invalid admin session');
      }
      setAdminUser(userData);
    } catch (error) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setLocation('/admin/login');
    }
  }, [setLocation]);

  const handleBusinessApproval = async (businessId: string, approved: boolean) => {
    const adminToken = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`/api/admin/businesses/${businessId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ approved })
      });

      if (!response.ok) throw new Error('Failed to update business status');

      toast({
        title: "Business Updated",
        description: `Business ${approved ? 'approved' : 'rejected'} successfully.`,
      });
      
      refetchBusinesses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUserEdit = async (userId: string, updates: Partial<User>) => {
    const adminToken = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update user');

      toast({
        title: "User Updated",
        description: "User information updated successfully.",
      });
      
      refetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUserStatusToggle = async (userId: string, isApproved: boolean) => {
    await handleUserEdit(userId, { is_approved: !isApproved });
  };

  const handleUserRoleChange = async (userId: string, newRole: string) => {
    await handleUserEdit(userId, { role: newRole });
  };

  const handleBusinessView = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (business) {
      alert(`Business Details:\n\nName: ${business.business_name}\nOwner: ${business.full_name}\nEmail: ${business.email}\nProducts: ${business.total_products}\nSales: ₵${business.total_sales}\nStatus: ${business.is_approved ? 'Approved' : 'Pending'}\nJoined: ${new Date(business.created_at).toLocaleDateString()}`);
    }
  };

  const handleUserView = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      alert(`User Details:\n\nName: ${user.full_name}\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.is_approved ? 'Active' : 'Inactive'}\nJoined: ${new Date(user.created_at).toLocaleDateString()}`);
    }
  };

  const handleAddBusiness = () => {
    toast({
      title: "Add Business",
      description: "Business creation form will be implemented soon. For now, users can register as vendors through the vendor registration page.",
    });
  };

  const handleAddUser = () => {
    toast({
      title: "Add User",
      description: "User creation form will be implemented soon. For now, users can register through the normal registration page.",
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    const adminToken = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete user');

      toast({
        title: "User Deleted",
        description: "User has been deleted successfully.",
      });
      
      refetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      return;
    }

    const adminToken = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`/api/admin/businesses/${businessId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete business');

      toast({
        title: "Business Deleted",
        description: "Business has been deleted successfully.",
      });
      
      refetchBusinesses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete business. Please try again.",
        variant: "destructive",
      });
    }
  };

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (!response.ok) throw new Error('Failed to fetch admin stats');
      return response.json();
    },
    enabled: !!adminToken
  });

  const { data: businesses = [], isLoading: businessesLoading, refetch: refetchBusinesses } = useQuery<Business[]>({
    queryKey: ['/api/admin/businesses'],
    queryFn: async () => {
      const response = await fetch('/api/admin/businesses', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (!response.ok) throw new Error('Failed to fetch businesses');
      return response.json();
    },
    enabled: !!adminToken
  });

  const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    enabled: !!adminToken
  });

  // If no admin session, render loading or redirect (useEffect will handle redirect)
  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Admin authentication is already handled by the useEffect and early return above

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      description: "from last month"
    },
    {
      title: "Active Businesses",
      value: stats?.totalVendors || 0,
      icon: Store,
      color: "text-ktu-orange",
      bgColor: "bg-orange-50",
      change: "+8%",
      description: "from last month"
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+25%",
      description: "from last month"
    },
    {
      title: "Platform Revenue",
      value: `₵${stats?.totalRevenue || 0}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+18%",
      description: "from last month"
    },
    {
      title: "Pending Approvals",
      value: stats?.pendingApprovals || 0,
      icon: UserCheck,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      urgent: true
    },
    {
      title: "Active Programs",
      value: stats?.activePrograms || 0,
      icon: Target,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Total Mentors",
      value: stats?.totalMentors || 0,
      icon: BookOpen,
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      title: "Published Resources",
      value: stats?.publishedResources || 0,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "System Health",
      value: "98.5%",
      icon: Activity,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ];

  const quickActions = [
    {
      title: "Mentorship Hub",
      description: "Manage mentors and programs comprehensively",
      icon: BookOpen,
      color: "bg-ktu-orange",
      action: "/admin/mentorship"
    },
    {
      title: "Community Discussions",
      description: "Manage and moderate forum discussions",
      icon: MessageCircle,
      color: "bg-blue-600",
      action: "/admin/community/discussions"
    },
    {
      title: "Manage Mentors",
      description: "View, add, and manage business mentors",
      icon: BookOpen,
      color: "bg-green-600",
      action: "/admin/mentors"
    },
    {
      title: "Manage Programs",
      description: "Create and manage training programs",
      icon: Target,
      color: "bg-ktu-deep-blue",
      action: "/admin/programs"
    },
    {
      title: "Manage Resources",
      description: "Add and organize business resources",
      icon: FileText,
      color: "bg-purple-600",
      action: "/admin/resources"
    },
    {
      title: "System Settings",
      description: "Configure platform-wide settings",
      icon: Settings,
      color: "bg-gray-600",
      action: "/admin/settings"
    }
  ];

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-ktu-grey py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(8)].map((_, i) => (
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
    <div className="min-h-screen bg-ktu-grey py-8">
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
              <h1 className="text-3xl font-bold text-ktu-deep-blue mb-2">
                KTU BizConnect Admin Dashboard
              </h1>
              <p className="text-ktu-dark-grey">
                Complete system oversight and management for the KTU entrepreneurship platform
              </p>
            </div>
            <div className="flex space-x-4">
              <Link to="/admin/reports">
                <Button variant="outline" className="text-ktu-deep-blue hover:text-ktu-orange">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
              </Link>
              <Link to="/admin/settings">
                <Button className="bg-ktu-orange hover:bg-ktu-orange-light text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -2, scale: 1.02 }}
            >
              <Card className={`relative overflow-hidden ${card.urgent ? 'ring-2 ring-yellow-400' : ''}`}>
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
                    <span className="text-2xl font-bold text-gray-900">
                      {card.value}
                    </span>
                    {card.change && (
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">
                          {card.change}
                        </span>
                        {card.description && (
                          <span className="text-xs text-gray-500">
                            {card.description}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-ktu-deep-blue">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={action.title} to={action.action}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-ktu-orange cursor-pointer transition-colors"
                    >
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-ktu-deep-blue mb-1">{action.title}</h3>
                      <p className="text-sm text-ktu-dark-grey">{action.description}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Management Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="businesses">Manage Businesses</TabsTrigger>
              <TabsTrigger value="users">Manage Users</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-ktu-deep-blue">Recent Business Registrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {businesses.slice(0, 5).map((business) => (
                        <div key={business.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div>
                            <p className="font-medium text-gray-900">{business.business_name}</p>
                            <p className="text-sm text-gray-500">{business.full_name}</p>
                          </div>
                          <Badge className={business.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {business.is_approved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-ktu-deep-blue">System Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">New user registrations today</span>
                        <span className="font-semibold">12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Products added today</span>
                        <span className="font-semibold">8</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Orders placed today</span>
                        <span className="font-semibold">24</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Revenue today</span>
                        <span className="font-semibold">₵2,450</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="businesses" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg text-ktu-deep-blue">Student Businesses Management</span>
                    <Button 
                      className="bg-ktu-orange hover:bg-ktu-orange-light text-white"
                      onClick={handleAddBusiness}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Business
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {businesses.map((business) => (
                      <div key={business.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{business.business_name}</h3>
                          <p className="text-sm text-gray-500">{business.full_name} • {business.email}</p>
                          <p className="text-xs text-gray-400">
                            {business.total_products} products • ₵{business.total_sales} sales
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={business.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {business.is_approved ? 'Approved' : 'Pending'}
                          </Badge>
                          {!business.is_approved && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleBusinessApproval(business.id, true)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleBusinessApproval(business.id, false)}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleBusinessView(business.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteBusiness(business.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg text-ktu-deep-blue">User Management</span>
                    <Button 
                      className="bg-ktu-orange hover:bg-ktu-orange-light text-white"
                      onClick={handleAddUser}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'vendor' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {user.role}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant={user.is_approved ? "destructive" : "default"}
                            onClick={() => handleUserStatusToggle(user.id, user.is_approved)}
                          >
                            {user.is_approved ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUserView(user.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}