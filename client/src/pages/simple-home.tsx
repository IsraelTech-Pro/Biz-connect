import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  MessageCircle, 
  TrendingUp,
  Search,
  MapPin,
  Phone,
  Mail,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

interface Business {
  id: string;
  business_name: string;
  business_description: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  business_category: string;
  is_approved: boolean;
}

export default function SimpleHome() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: businesses = [] } = useQuery<Business[]>({
    queryKey: ['/api/vendors'],
    queryFn: async () => {
      const response = await fetch('/api/vendors');
      if (!response.ok) throw new Error('Failed to fetch businesses');
      return response.json();
    }
  });

  const approvedBusinesses = businesses.filter(b => b.is_approved);
  
  const filteredBusinesses = approvedBusinesses.filter(business => {
    const matchesSearch = business.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.business_description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || business.business_category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(approvedBusinesses.map(b => b.business_category)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-orange-600 text-white py-16">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              KTU BizConnect
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Connecting KTU Student Entrepreneurs with Opportunities
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/businesses">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3">
                  <Users className="w-5 h-5 mr-2" />
                  Browse Businesses
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3">
                  Join as Entrepreneur
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">{approvedBusinesses.length}</h3>
                  <p className="text-gray-600">Active Businesses</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  <BookOpen className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">{categories.length}</h3>
                  <p className="text-gray-600">Business Categories</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">Growing</h3>
                  <p className="text-gray-600">Student Network</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section className="py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Student Businesses
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Discover innovative ventures by KTU student entrepreneurs
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-80"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Business Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.slice(0, 6).map((business, index) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-blue-900 mb-2">
                          {business.business_name}
                        </CardTitle>
                        <Badge variant="secondary" className="mb-2">
                          {business.business_category}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">New</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {business.business_description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{business.full_name}</span>
                      </div>
                      {business.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{business.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      {business.whatsapp_number && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredBusinesses.length > 6 && (
            <div className="text-center mt-12">
              <Link to="/businesses">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
                  View All Businesses
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Showcase Your Business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join the KTU entrepreneurial community and connect with customers, mentors, and fellow entrepreneurs.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
                Get Started Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}