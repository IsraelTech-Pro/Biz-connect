import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Star, TrendingUp, Users, Shield, Zap, ArrowRight, 
  Check, Heart, Award, Clock, ChevronLeft, ChevronRight, 
  Smartphone, Laptop, Headphones, Watch, Camera, Gamepad2,
  ShirtIcon, Home as HomeIcon, Car, Baby, Gift, Percent, Timer, Eye, ChevronDown, Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductCard } from '@/components/product-card';
import { Link } from 'wouter';
import type { Product, User } from '@shared/schema';

const heroSlides = [
  {
    id: 1,
    title: "CLEARANCE SALE",
    subtitle: "Kumasi Marketplace",
    discount: "UP TO 30%",
    bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
    buttonText: "SHOP NOW",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    title: "FLASH DEALS",
    subtitle: "Limited Time Offers",
    discount: "UP TO 70%",
    bgImage: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=400&fit=crop",
    buttonText: "GRAB NOW",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    title: "NEW ARRIVALS",
    subtitle: "Latest Fashion Trends",
    discount: "UP TO 50%",
    bgImage: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=400&fit=crop",
    buttonText: "EXPLORE",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
  }
];

const quickActionTiles = [
  { 
    title: "CLEARANCE SALE", 
    subtitle: "UP TO 70%", 
    color: "from-purple-600 to-blue-600",
    bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop"
  },
  { 
    title: "Save Big Now", 
    subtitle: "Best Deals", 
    color: "from-orange-500 to-yellow-500",
    bgImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop"
  },
  { 
    title: "Call to Order", 
    subtitle: "030 274 0642", 
    color: "from-blue-600 to-indigo-600",
    bgImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop"
  },
  { 
    title: "VENDORHUB FORCE", 
    subtitle: "MAKE EXTRA CASH", 
    color: "from-orange-500 to-yellow-500",
    bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop"
  }
];

const categoryTiles = [
  { 
    name: "Kumasi Marketplace", 
    bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop",
    overlay: "from-red-600 to-orange-600"
  },
  { 
    name: "Doorkom Sales", 
    bgImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
    overlay: "from-orange-500 to-yellow-500"
  },
  { 
    name: "Kumasi Marketplace", 
    bgImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
    overlay: "from-gray-800 to-gray-900"
  },
  { 
    name: "Discount @Checkout", 
    bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop",
    overlay: "from-yellow-500 to-orange-500"
  },
  { 
    name: "VENDORHUB GLOBAL", 
    bgImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
    overlay: "from-gray-800 to-gray-900"
  },
  { 
    name: "New this Week", 
    bgImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
    overlay: "from-green-600 to-teal-600"
  },
  { 
    name: "Trending Now", 
    bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop",
    overlay: "from-pink-600 to-purple-600"
  },
  { 
    name: "Beauty", 
    bgImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
    overlay: "from-pink-500 to-rose-500"
  }
];

const VendorHubProductCard = ({ product, discountPercent = 0 }: { product: Product; discountPercent?: number }) => {
  const originalPrice = parseFloat(product.price);
  const currentPrice = discountPercent > 0 ? originalPrice * (1 - discountPercent / 100) : originalPrice;
  const itemsLeft = Math.floor(Math.random() * 50) + 1;
  const rating = (Math.random() * 2 + 3).toFixed(1);
  const ratingCount = Math.floor(Math.random() * 500) + 50;
  
  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <div className="product-card-vendorhub">
        <div className="relative overflow-hidden">
          <img 
            src={product.image_url || "/api/placeholder/140/140"} 
            alt={product.title}
            className="w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {discountPercent > 0 && (
            <div className="discount-badge animate-pulse">
              -{discountPercent}%
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="card-content">
          <div className="flex-grow">
            <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight mb-2">
              {product.title.length > 25 ? product.title.substring(0, 25) + '...' : product.title}
            </h3>
            
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(parseFloat(rating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">({ratingCount})</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <span className="text-orange-600 font-bold text-sm">GH₵ {currentPrice.toFixed(2)}</span>
              {discountPercent > 0 && (
                <span className="text-gray-400 line-through text-xs">GH₵ {originalPrice.toFixed(2)}</span>
              )}
            </div>
            
            <div className="text-xs text-gray-500 font-medium">
              {itemsLeft} items left
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ProductSection = ({ 
  title, 
  products, 
  discountRange, 
  seeAllLink, 
  bgColor = "bg-red-500",
  showTimer = false 
}: {
  title: string;
  products: Product[];
  discountRange: [number, number];
  seeAllLink: string;
  bgColor?: string;
  showTimer?: boolean;
}) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 46, seconds: 25 });

  useEffect(() => {
    if (showTimer) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else if (prev.hours > 0) {
            return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
          }
          return prev;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showTimer]);

  return (
    <div className="section-spacing">
      <div className="mobile-padding">
        <div className={`vendorhub-section-header ${title.toLowerCase().includes('flash') ? 'flash-sales' : ''} ${title.toLowerCase().includes('clearance') ? 'clearance' : ''} ${title.toLowerCase().includes('fashion') ? 'fashion' : ''}`}>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
              {showTimer && <Zap className="w-6 h-6 text-yellow-300 animate-pulse" />}
              <h2 className="text-base lg:text-xl font-bold">{title}</h2>
            </div>
            <div className="flex items-center space-x-4">
              {showTimer && (
                <div className="countdown-timer">
                  <span className="text-xs">TIME LEFT: </span>
                  <span className="font-mono font-bold text-xs">
                    {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              )}
              <Link href={seeAllLink} className="text-white hover:text-yellow-200 text-xs lg:text-sm font-medium">
                See All
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="product-section-container">
        <div className="mobile-padding py-6">
          <div className="product-grid animate-fade-in-up">
            {products.map((product, index) => (
              <VendorHubProductCard 
                key={`${product.id}-${title.replace(/\s+/g, '-').toLowerCase()}-${index}`} 
                product={product} 
                discountPercent={discountRange[0] + (product.id.charCodeAt(0) % (discountRange[1] - discountRange[0]))} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'discount'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: vendors = [], isLoading: vendorsLoading } = useQuery<User[]>({
    queryKey: ['/api/vendors'],
  });

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading VendorHub deals...</p>
        </div>
      </div>
    );
  }

  // Enhanced product filtering and sorting
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const price = parseFloat(product.price);
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'price':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'rating':
        return Math.random() - 0.5; // Simulate rating sort
      case 'discount':
        return Math.random() - 0.5; // Simulate discount sort
      default:
        return 0;
    }
  });

  // Ensure we have enough products by repeating if necessary for scrolling
  const extendedProducts = sortedProducts.length > 0 ? 
    [...sortedProducts, ...sortedProducts, ...sortedProducts, ...sortedProducts].slice(0, 200) : [];

  const flashSaleProducts = extendedProducts.slice(0, 24);
  const topSellingProducts = extendedProducts.slice(24, 48);
  const clearanceProducts = extendedProducts.slice(48, 72);
  const womensFashionProducts = extendedProducts.slice(72, 96);
  const appliancesProducts = extendedProducts.slice(96, 120);
  const phoneProducts = extendedProducts.slice(120, 144);
  const mensProducts = extendedProducts.slice(144, 168);
  const beautyProducts = extendedProducts.slice(168, 192);

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'beauty', label: 'Beauty & Personal Care' },
    { value: 'books', label: 'Books & Media' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'toys', label: 'Toys & Games' }
  ];

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 1000]);
    setSortBy('name');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="app-container">
        {/* Blue Call to Order Bar - Mobile Only */}
        <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium lg:hidden">
          Call to Order: 030 274 0642
        </div>

      {/* Hero Banner */}
      <div className="mobile-padding section-spacing">
        <div className="relative mobile-hero rounded-lg overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center p-4 lg:p-8"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroSlides[currentSlide].bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="text-white space-y-2 lg:space-y-4 text-center">
                <h1 className="text-xl lg:text-4xl font-bold">{heroSlides[currentSlide].title}</h1>
                <p className="text-base lg:text-xl opacity-90">{heroSlides[currentSlide].subtitle}</p>
                <div className="btn-orange-primary px-3 py-1 rounded-lg inline-block">
                  <span className="text-white font-bold text-sm">{heroSlides[currentSlide].discount}</span>
                </div>
                <p className="text-xs opacity-75">T & C's Apply</p>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Slide Navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Filters Section */}
      <div className="mobile-padding section-spacing">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <Store className="w-5 h-5 mr-2 text-orange-500" />
              VendorHub Marketplace
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              <span>Filters</span>
            </Button>
          </div>

          {/* Quick Search */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Eye className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1.5 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                      className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="name">Name A-Z</option>
                    <option value="price">Price Low to High</option>
                    <option value="rating">Best Rated</option>
                    <option value="discount">Best Deals</option>
                  </select>
                </div>

                {/* View Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
                  <div className="flex space-x-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="flex-1"
                    >
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="flex-1"
                    >
                      List
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    Reset All
                  </Button>
                  <Button size="sm" className="btn-orange-primary">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="mobile-padding section-spacing">
        <div className="quick-actions-grid">
          {quickActionTiles.map((tile, index) => (
            <div 
              key={index}
              className="category-tile h-20 lg:h-24 cursor-pointer"
              style={{
                backgroundImage: `url(${tile.bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className={`category-overlay bg-gradient-to-br ${tile.color} bg-opacity-80`}>
                <div className="text-center">
                  <div className="font-bold text-xs mb-1">{tile.title}</div>
                  <div className="text-xs opacity-90">{tile.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Sales Section */}
      <ProductSection
        title="Flash Sales"
        products={flashSaleProducts}
        discountRange={[20, 70]}
        seeAllLink="/browse-products?flash=true"
        bgColor="bg-red-500"
        showTimer={true}
      />

      {/* Main Categories */}
      <div className="mobile-padding section-spacing">
        <div className="category-grid">
          {categoryTiles.map((category, index) => (
            <div 
              key={index}
              className="category-tile h-20 lg:h-24 cursor-pointer"
              style={{
                backgroundImage: `url(${category.bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className={`category-overlay bg-gradient-to-br ${category.overlay} bg-opacity-80`}>
                <div className="font-bold text-xs text-center">{category.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Selling Items */}
      <ProductSection
        title="Top selling items"
        products={topSellingProducts}
        discountRange={[5, 30]}
        seeAllLink="/browse-products?sort=bestselling"
        bgColor="btn-orange-primary"
      />

      {/* Clearance Sales */}
      <ProductSection
        title="Deals you Don't Want to Miss | Clearance Sales"
        products={clearanceProducts}
        discountRange={[15, 50]}
        seeAllLink="/browse-products?deals=true"
        bgColor="bg-purple-600"
      />

      {/* Women's Fashion */}
      <ProductSection
        title="Women's Fashion | Clearance Sales"
        products={womensFashionProducts}
        discountRange={[10, 40]}
        seeAllLink="/browse-products?category=fashion"
        bgColor="bg-pink-600"
      />

      {/* Appliances */}
      <ProductSection
        title="Washers & Dryers | Clearance Sales"
        products={appliancesProducts}
        discountRange={[10, 35]}
        seeAllLink="/browse-products?category=appliances"
        bgColor="bg-blue-600"
      />

      {/* Phone Deals */}
      <ProductSection
        title="Hot Phone Deals | Clearance Sales"
        products={phoneProducts}
        discountRange={[5, 25]}
        seeAllLink="/browse-products?category=phones"
        bgColor="bg-green-600"
      />

      {/* Men's Fashion */}
      <ProductSection
        title="Men's Sneakers | Clearance Sales"
        products={mensProducts}
        discountRange={[20, 50]}
        seeAllLink="/browse-products?category=sneakers"
        bgColor="bg-indigo-600"
      />

      {/* Beauty Products */}
      <ProductSection
        title="Beauty & Personal Care | Clearance Sales"
        products={beautyProducts}
        discountRange={[15, 45]}
        seeAllLink="/browse-products?category=beauty"
        bgColor="bg-rose-600"
      />
      </div>
    </div>
  );
}