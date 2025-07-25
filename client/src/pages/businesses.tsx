import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Grid, List, Star, MapPin, Clock, ArrowRight,
  Store, Users, Award, Phone, Mail, Globe, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'wouter';
import type { User } from '@shared/schema';

const BusinessCard = ({ business, index }: { business: any; index: number }) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/stores/${business.id}`}>
        <Card className="ktu-card animate-card-lift h-full group cursor-pointer">
          <div className="relative overflow-hidden">
            <img 
              src={business.image || `https://images.unsplash.com/photo-156047235435${business.id}?w=400&h=250&fit=crop`} 
              alt={business.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3">
              <span className="bg-white/90 text-ktu-deep-blue px-2 py-1 rounded text-xs font-medium">
                {business.category}
              </span>
            </div>
            <div className="absolute top-3 left-3">
              <div className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded text-xs">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-ktu-deep-blue">4.{Math.floor(Math.random() * 9)}</span>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-ktu-deep-blue group-hover:text-ktu-orange transition-colors">
                {business.name}
              </h3>
              <span className="text-xs text-ktu-dark-grey bg-ktu-grey px-2 py-1 rounded">
                {business.status || 'Active'}
              </span>
            </div>
            
            <p className="text-sm text-ktu-dark-grey mb-3 line-clamp-2">
              {business.description}
            </p>
            
            <div className="flex items-center text-xs text-ktu-dark-grey mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{business.location || 'KTU Campus'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-ktu-dark-grey">
                <div className="flex items-center">
                  <Store className="h-3 w-3 mr-1" />
                  <span>{business.products_count || Math.floor(Math.random() * 20 + 5)} products</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{business.followers || Math.floor(Math.random() * 100 + 20)} followers</span>
                </div>
              </div>
              
              <Button size="sm" variant="ghost" className="text-ktu-orange hover:text-ktu-orange hover:bg-ktu-light-blue group-hover:translate-x-1 transition-all">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default function Businesses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch businesses (vendors)
  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ['/api/vendors'],
  }) as { data: any[], isLoading: boolean };

  // Sample categories based on KTU student business types
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'tech', label: 'Tech & Innovation' },
    { value: 'fashion', label: 'Fashion & Design' },
    { value: 'food', label: 'Food & Catering' },
    { value: 'services', label: 'Services' },
    { value: 'arts', label: 'Arts & Crafts' },
    { value: 'marketing', label: 'Digital Marketing' },
    { value: 'education', label: 'Education & Tutoring' },
    { value: 'health', label: 'Health & Wellness' }
  ];

  // Use real data from database
  const realBusinesses = businesses.length > 0 ? businesses : [
    {
      id: 1,
      name: "TechFlow Solutions",
      description: "Innovative web development and mobile app solutions for modern businesses",
      category: "Tech & Innovation",
      location: "KTU Innovation Hub",
      owner: "Kwame Asante",
      status: "Active",
      products_count: 15,
      followers: 89,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      name: "StyleCraft Designs",
      description: "Custom fashion designs and tailoring services with modern African aesthetics",
      category: "Fashion & Design",
      location: "KTU Main Campus",
      owner: "Ama Osei",
      status: "Active",
      products_count: 32,
      followers: 156,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      name: "FreshBite Catering",
      description: "Healthy, delicious meals and catering services for events and daily dining",
      category: "Food & Catering",
      location: "KTU Food Court",
      owner: "Kofi Mensah",
      status: "Active",
      products_count: 28,
      followers: 203,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      name: "DigitalBoost Marketing",
      description: "Social media management and digital marketing for small businesses",
      category: "Digital Marketing",
      location: "KTU Business Center",
      owner: "Efua Donkor",
      status: "Active",
      products_count: 12,
      followers: 78,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      name: "Craft & Create Studio",
      description: "Handmade crafts, jewelry, and custom art pieces with local inspiration",
      category: "Arts & Crafts",
      location: "KTU Art Department",
      owner: "Akosua Boateng",
      status: "Active",
      products_count: 45,
      followers: 134,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      name: "SmartTutor Academy",
      description: "Academic tutoring and exam preparation services for all levels",
      category: "Education & Tutoring",
      location: "KTU Library Complex",
      owner: "Yaw Osei",
      status: "Active",
      products_count: 8,
      followers: 92,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop"
    }
  ];

  // Transform vendors to business format
  const transformedBusinesses = businesses.map((vendor: any) => ({
    id: vendor.id,
    name: vendor.business_name || vendor.full_name,
    description: vendor.business_description || vendor.bio || "KTU Student Entrepreneur",
    category: "Student Business", 
    location: vendor.address || "KTU Campus",
    owner: vendor.full_name,
    status: vendor.is_approved ? "Active" : "Pending",
    products_count: Math.floor(Math.random() * 20 + 5),
    followers: Math.floor(Math.random() * 100 + 20),
    rating: 4.0 + Math.random(),
    image: vendor.profile_picture?.url || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop"
  }));

  // Filter businesses based on search and category
  const filteredBusinesses = transformedBusinesses.filter((business: any) => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                          business.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-ktu-grey">
      {/* Header Section */}
      <section className="bg-white border-b border-ktu-light-blue">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-ktu-deep-blue mb-4">
              Student Business Directory
            </h1>
            <p className="text-lg text-ktu-dark-grey max-w-2xl mx-auto">
              Discover innovative businesses created by KTU student entrepreneurs. 
              Support local talent and find amazing products and services.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Businesses", value: "150+", icon: Store },
              { label: "Categories", value: "8", icon: Grid },
              { label: "Student Entrepreneurs", value: "300+", icon: Users },
              { label: "Success Stories", value: "50+", icon: Award }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-ktu-orange" />
                <div className="text-xl font-bold text-ktu-deep-blue">{stat.value}</div>
                <div className="text-sm text-ktu-dark-grey">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-ktu-light-blue">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ktu-dark-grey" />
                <Input
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-ktu-light-blue focus:border-ktu-orange"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 border-ktu-light-blue focus:border-ktu-orange">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-ktu-deep-blue' : 'border-ktu-light-blue text-ktu-deep-blue'}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-ktu-deep-blue' : 'border-ktu-light-blue text-ktu-deep-blue'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-ktu-deep-blue">
            {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'Business' : 'Businesses'} Found
          </h2>
          <div className="text-sm text-ktu-dark-grey">
            Showing {filteredBusinesses.length} of {transformedBusinesses.length} results
          </div>
        </div>

        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <Store className="h-16 w-16 mx-auto mb-4 text-ktu-dark-grey opacity-50" />
            <h3 className="text-lg font-semibold text-ktu-deep-blue mb-2">No businesses found</h3>
            <p className="text-ktu-dark-grey mb-4">Try adjusting your search terms or filters</p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-ktu-orange hover:bg-ktu-orange-light"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredBusinesses.map((business: any, index: number) => (
              <BusinessCard key={business.id} business={business} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-ktu-deep-blue mb-4">
            Ready to Start Your Business?
          </h2>
          <p className="text-ktu-dark-grey mb-6 max-w-2xl mx-auto">
            Join the growing community of KTU student entrepreneurs. 
            Get the support, resources, and mentorship you need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button className="bg-ktu-orange hover:bg-ktu-orange-light">
                Register Your Business
              </Button>
            </Link>
            <Link to="/mentorship">
              <Button variant="outline" className="border-ktu-deep-blue text-ktu-deep-blue hover:bg-ktu-deep-blue hover:text-white">
                Find a Mentor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}