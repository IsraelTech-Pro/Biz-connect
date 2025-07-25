import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Store, BookOpen, MessageCircle, TrendingUp, Award, 
  ArrowRight, ChevronRight, Building2, Lightbulb, Network,
  Star, Heart, Eye, Clock, Briefcase, GraduationCap, Target,
  Rocket, Handshake, Globe, Shield, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import type { Product, User } from '@shared/schema';

// KTU BizConnect Business Card Component
const BusinessCard = ({ business }: { business: any }) => {
  return (
    <Link href={`/stores/${business.id}`} className="block h-full">
      <div className="ktu-card animate-card-lift h-full group">
        <div className="relative overflow-hidden">
          <img 
            src={business.image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop"} 
            alt={business.name}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <span className="bg-white/90 text-ktu-deep-blue px-2 py-1 rounded text-xs font-medium">
              {business.category}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-ktu-deep-blue mb-1 line-clamp-1">{business.name}</h3>
          <p className="text-sm text-ktu-dark-grey mb-2 line-clamp-2">{business.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs text-ktu-dark-grey">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>4.{Math.floor(Math.random() * 9)}</span>
            </div>
            <Button size="sm" variant="ghost" className="text-ktu-orange hover:text-ktu-orange hover:bg-ktu-light-blue">
              View <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Product Card for 6-per-row layout
const ProductCard = ({ product }: { product: any }) => {
  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <div className="ktu-card animate-card-lift h-full group">
        <div className="relative overflow-hidden">
          <img 
            src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop"} 
            alt={product.name}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2">
            <span className="bg-ktu-orange text-white text-xs px-2 py-1 rounded font-medium">
              ₵{product.price}
            </span>
          </div>
        </div>
        <div className="p-3">
          <h4 className="font-medium text-ktu-deep-blue text-sm mb-1 line-clamp-1">{product.name}</h4>
          <p className="text-xs text-ktu-dark-grey line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-ktu-dark-grey">4.{Math.floor(Math.random() * 9)}</span>
            </div>
            <Heart className="h-4 w-4 text-ktu-dark-grey hover:text-ktu-orange cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function KTUHome() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch real businesses data and randomize for homepage
  const { data: businessesData = [], isLoading: businessesLoading } = useQuery<User[]>({
    queryKey: ['/api/vendors'],
    queryFn: async () => {
      const response = await fetch('/api/vendors');
      if (!response.ok) throw new Error('Failed to fetch businesses');
      const data = await response.json();
      // Randomize the businesses for homepage display
      return data.sort(() => Math.random() - 0.5);
    }
  });

  // Fetch real products data and randomize for homepage  
  const { data: productsData = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      // Randomize the products for homepage display
      return data.sort(() => Math.random() - 0.5);
    }
  });

  // Hero slides with KTU focus
  const heroSlides = [
    {
      id: 1,
      title: "WELCOME TO KTU BIZCONNECT",
      subtitle: "Your Gateway to Student Entrepreneurship",
      description: "Connect, collaborate, and grow your business at Koforidua Technical University",
      bgGradient: "ktu-hero-gradient",
      ctaText: "GET STARTED"
    },
    {
      id: 2,
      title: "BUILD YOUR BUSINESS",
      subtitle: "From Idea to Success",
      description: "Access mentorship, resources, and a thriving community of student entrepreneurs",
      bgGradient: "ktu-orange-gradient", 
      ctaText: "EXPLORE NOW"
    },
    {
      id: 3,
      title: "CONNECT & NETWORK",
      subtitle: "Join the Community",
      description: "Meet fellow entrepreneurs, share experiences, and build lasting partnerships",
      bgGradient: "ktu-hero-gradient",
      ctaText: "JOIN TODAY"
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Quick action tiles
  const quickActions = [
    { 
      title: "STUDENT BUSINESSES", 
      subtitle: "Browse & Support", 
      icon: Store,
      color: "ktu-hero-gradient",
      link: "/businesses"
    },
    { 
      title: "MENTORSHIP HUB", 
      subtitle: "Learn & Grow", 
      icon: GraduationCap,
      color: "ktu-orange-gradient",
      link: "/mentorship"
    },
    { 
      title: "BUSINESS RESOURCES", 
      subtitle: "Tools & Guides", 
      icon: BookOpen,
      color: "ktu-hero-gradient",
      link: "/resources"
    },
    { 
      title: "COMMUNITY FORUM", 
      subtitle: "Connect & Share", 
      icon: MessageCircle,
      color: "ktu-orange-gradient",
      link: "/community"
    }
  ];

  // Featured categories
  const categories = [
    { 
      name: "Tech & Innovation", 
      bgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop",
      count: 45
    },
    { 
      name: "Fashion & Design", 
      bgImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop",
      count: 32
    },
    { 
      name: "Food & Catering", 
      bgImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop",
      count: 28
    },
    { 
      name: "Services", 
      bgImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
      count: 51
    },
    { 
      name: "Arts & Crafts", 
      bgImage: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=300&h=200&fit=crop",
      count: 19
    },
    { 
      name: "Digital Marketing", 
      bgImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
      count: 23
    }
  ];

  return (
    <div className="min-h-screen bg-ktu-grey">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 ${heroSlides[currentSlide].bgGradient} flex items-center justify-center`}
          >
            <div className="text-center text-white max-w-4xl px-4">
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold mb-4"
              >
                {heroSlides[currentSlide].title}
              </motion.h1>
              <motion.h2 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl md:text-2xl font-medium mb-4"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.h2>
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg mb-8 opacity-90"
              >
                {heroSlides[currentSlide].description}
              </motion.p>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button size="lg" className="bg-white text-ktu-deep-blue hover:bg-gray-100 font-semibold px-8">
                  {heroSlides[currentSlide].ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={action.link}>
                <Card className={`${action.color} text-white hover:scale-105 transition-transform cursor-pointer`}>
                  <CardContent className="p-4 text-center">
                    <action.icon className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                    <p className="text-xs opacity-90">{action.subtitle}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-ktu-deep-blue">Featured Student Businesses</h2>
          <Link href="/businesses">
            <Button variant="outline" className="border-ktu-orange text-ktu-orange hover:bg-ktu-orange hover:text-white">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {businessesLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-40 mb-2"></div>
                <div className="bg-gray-200 rounded h-4 mb-1"></div>
                <div className="bg-gray-200 rounded h-3"></div>
              </div>
            ))
          ) : (
            businessesData.slice(0, 6).map((business) => (
              <BusinessCard key={business.id} business={{
                id: business.id,
                name: business.business_name || business.full_name,
                description: business.business_description || "KTU Student Business",
                category: business.business_category || "Student Business",
                image: business.business_logo?.[0]?.url || business.profile_image?.[0]?.url || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop`
              }} />
            ))
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-ktu-deep-blue">Featured Products</h2>
          <Link href="/products">
            <Button variant="outline" className="border-ktu-orange text-ktu-orange hover:bg-ktu-orange hover:text-white">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {productsLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-40 mb-2"></div>
                <div className="bg-gray-200 rounded h-4 mb-1"></div>
                <div className="bg-gray-200 rounded h-3"></div>
              </div>
            ))
          ) : (
            productsData.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={{
                id: product.id,
                name: product.title,
                description: product.description,
                price: product.price,
                image: product.product_images?.[0]?.url || product.image_url || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop`
              }} />
            ))
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-ktu-deep-blue mb-6">Explore Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/businesses?category=${category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}>
                <Card className="relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform">
                  <div className="relative h-32">
                    <img 
                      src={category.bgImage} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ktu-deep-blue/80 to-transparent" />
                    <div className="absolute bottom-2 left-2 text-white">
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                      <p className="text-xs opacity-90">{category.count} businesses</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Businesses", value: "150+", icon: Store },
              { label: "Student Entrepreneurs", value: "300+", icon: Users },
              { label: "Success Stories", value: "50+", icon: Award },
              { label: "Mentors Available", value: "25+", icon: GraduationCap }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-ktu-orange" />
                <div className="text-2xl font-bold text-ktu-deep-blue">{stat.value}</div>
                <div className="text-ktu-dark-grey">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}