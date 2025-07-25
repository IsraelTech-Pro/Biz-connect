import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Users, 
  Phone, 
  Mail, 
  MessageCircle,
  MapPin,
  Star,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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

export default function SimpleBusinesses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: businesses = [], isLoading } = useQuery<Business[]>({
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
                         business.business_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || business.business_category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(approvedBusinesses.map(b => b.business_category)));

  const handleContact = (email: string, businessName: string) => {
    window.location.href = `mailto:${email}?subject=Inquiry about ${businessName}`;
  };

  const handleWhatsApp = (number: string, businessName: string) => {
    const message = `Hello! I'm interested in learning more about ${businessName}.`;
    window.open(`https://wa.me/${number.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 to-orange-600 text-white py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              KTU Student Businesses
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Discover and connect with innovative student entrepreneurs at Koforidua Technical University
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search businesses, entrepreneurs, or services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-gray-900"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-md text-gray-900 min-w-48"
              >
                <option value="all">All Categories ({approvedBusinesses.length})</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category} ({approvedBusinesses.filter(b => b.business_category === category).length})
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Summary */}
      <section className="py-6 bg-white border-b">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">
              Showing {filteredBusinesses.length} of {approvedBusinesses.length} businesses
              {searchTerm && ` for "${searchTerm}"`}
              {categoryFilter !== 'all' && ` in ${categoryFilter}`}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-medium">{approvedBusinesses.length} Active Entrepreneurs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Business Grid */}
      <section className="py-12">
        <div className="container max-w-6xl mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <Card>
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No businesses found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'Try adjusting your search terms or category filter to find more businesses.' 
                  : 'Be the first to showcase your business on KTU BizConnect!'
                }
              </p>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                Register Your Business
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business, index) => (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index % 6) }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-blue-900 mb-2 hover:text-blue-700 transition-colors">
                            {business.business_name}
                          </CardTitle>
                          <Badge 
                            variant="secondary" 
                            className="mb-2 bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            {business.business_category}
                          </Badge>
                        </div>
                        <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs text-green-700 font-medium">Active</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex flex-col">
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                        {business.business_description}
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-700">
                          <Users className="w-4 h-4 mr-3 text-blue-600" />
                          <span className="font-medium">{business.full_name}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-3 text-gray-400" />
                          <span className="truncate">{business.email}</span>
                        </div>
                        
                        {business.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-3 text-gray-400" />
                            <span>{business.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 mt-auto">
                        <Button 
                          size="sm" 
                          onClick={() => handleContact(business.email, business.business_name)}
                          className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                        
                        {business.whatsapp_number && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleWhatsApp(business.whatsapp_number, business.business_name)}
                            className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white flex-1"
                          >
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
          )}
        </div>
      </section>
    </div>
  );
}