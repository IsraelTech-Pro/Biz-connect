import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, ShoppingCart, User, Menu, X, Store, Bell, MapPin, Phone, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';

const categories = [
  { name: 'Tech & Innovation', icon: '💻', color: 'bg-ktu-deep-blue' },
  { name: 'Fashion & Design', icon: '👔', color: 'bg-ktu-orange' },
  { name: 'Food & Catering', icon: '🍽️', color: 'bg-green-500' },
  { name: 'Education & Tutoring', icon: '📚', color: 'bg-indigo-500' },
  { name: 'Arts & Crafts', icon: '🎨', color: 'bg-purple-500' },
  { name: 'Digital Marketing', icon: '📱', color: 'bg-blue-500' },
  { name: 'Services', icon: '🔧', color: 'bg-gray-500' },
  { name: 'Health & Wellness', icon: '💊', color: 'bg-teal-500' },
];

export const Header = () => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false); // Close mobile search
      window.location.href = `/browse-products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleMobileSearch = () => {
    if (searchQuery.trim()) {
      setIsSearchFocused(false); // Close mobile search
      window.location.href = `/browse-products?search=${encodeURIComponent(searchQuery)}`;
    } else {
      // Toggle mobile search input visibility
      setIsSearchFocused(!isSearchFocused);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-ktu-deep-blue text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <Link to="/" className="font-bold hover:text-ktu-orange transition-colors">
                KTU BIZCONNECT
              </Link>
              <Link to="/student-businesses" className="hidden md:inline hover:text-ktu-orange transition-colors cursor-pointer">
                Student Entrepreneurs
              </Link>
              <Link to="/" className="hidden md:inline hover:text-ktu-orange transition-colors cursor-pointer">
                🏫 Campus Hub
              </Link>
              <Link to="/resources" className="hidden md:inline hover:text-ktu-orange transition-colors cursor-pointer">
                📚 Resources
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-bold">Need Help?</span>
              <Link to="/customer-support" className="text-ktu-orange font-bold hover:text-white transition-colors cursor-pointer">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 lg:h-16">
            {/* Mobile Menu + Logo */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="w-4 h-4 flex flex-col justify-between">
                  <span className="w-full h-0.5 bg-gray-600"></span>
                  <span className="w-full h-0.5 bg-gray-600"></span>
                  <span className="w-full h-0.5 bg-gray-600"></span>
                </div>
              </Button>
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="bg-ktu-orange p-1.5 lg:p-2 rounded">
                  <Store className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <span className="text-xl lg:text-2xl font-bold text-ktu-deep-blue">KTU <span className="text-ktu-orange">BizConnect</span></span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 lg:mx-8 hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center">
                  <Input
                    type="text"
                    placeholder="Search products, brands and categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full pl-4 pr-4 py-2 lg:py-3 border border-gray-300 rounded-l-md focus:border-orange-500 focus:ring-0 text-sm"
                  />
                  <Button
                    type="submit"
                    className="btn-orange-primary px-4 lg:px-6 py-2 lg:py-3 rounded-r-md border-none h-full"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-1">
              {/* Mobile Search */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden p-2"
                onClick={handleMobileSearch}
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Account */}
              <div className="relative group">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-orange-50 px-2 py-2">
                  <User className="h-4 w-4" />
                  <div className="text-left hidden lg:block">
                    <div className="text-xs text-gray-500">Account</div>
                    <div className="text-sm font-medium">
                      {user ? user.email.split('@')[0] : 'Sign in'}
                    </div>
                  </div>
                </Button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {user ? (
                    <>
                      {user.role === 'vendor' && (
                        <Link to="/vendor/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Dashboard
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/auth/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign In
                      </Link>
                      <Link to="/auth/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Dashboard */}
              {user && (
                <Link to={user.role === 'vendor' ? '/vendor/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/dashboard/buyer'}>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-orange-50 px-2 py-2">
                    <BarChart3 className="h-4 w-4" />
                    <div className="text-left hidden lg:block">
                      <div className="text-xs text-gray-500">Dashboard</div>
                      <div className="text-sm font-medium">
                        {user.role === 'vendor' ? 'Business' : user.role === 'admin' ? 'Admin' : 'Buyer'}
                      </div>
                    </div>
                  </Button>
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-orange-50 px-2 py-2 relative">
                  <ShoppingCart className="h-4 w-4" />
                  <div className="text-left hidden lg:block">
                    <div className="text-xs text-gray-500">Cart</div>
                    <div className="text-sm font-medium">
                      {getItemCount() > 0 ? `${getItemCount()}` : '0'}
                    </div>
                  </div>
                  {getItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 btn-orange-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {getItemCount()}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="bg-ktu-section-gradient border-b border-gray-200 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-8 py-3">
              <Link to="/businesses" className="text-ktu-deep-blue hover:text-ktu-orange transition-colors font-medium">
                Student Businesses
              </Link>
              <Link to="/products-listing" className="text-ktu-deep-blue hover:text-ktu-orange transition-colors font-medium">
                Products
              </Link>
              <Link to="/mentorship" className="text-ktu-deep-blue hover:text-ktu-orange transition-colors font-medium">
                Mentorship
              </Link>
              <Link to="/resources" className="text-ktu-deep-blue hover:text-ktu-orange transition-colors font-medium">
                Resources
              </Link>
              <Link to="/community" className="text-ktu-deep-blue hover:text-ktu-orange transition-colors font-medium">
                Community
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchFocused && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200 px-4 py-3"
            >
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center">
                  <Input
                    type="text"
                    placeholder="Search products, brands and categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-l-md focus:border-orange-500 focus:ring-0 text-sm"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    className="btn-orange-primary px-4 py-2 rounded-r-md border-none h-full"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>



      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-3">
              {user && (
                <Link
                  to={user.role === 'vendor' ? '/vendor/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/dashboard/buyer'}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-ktu-deep-blue hover:text-ktu-orange"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">📊</span>
                  <span className="text-sm font-medium">
                    {user.role === 'vendor' ? 'Business Dashboard' : user.role === 'admin' ? 'Admin Dashboard' : 'Buyer Dashboard'}
                  </span>
                </Link>
              )}
              <Link
                to="/businesses"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-ktu-deep-blue hover:text-ktu-orange"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">🏢</span>
                <span className="text-sm font-medium">Student Businesses</span>
              </Link>
              <Link
                to="/products-listing"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-ktu-deep-blue hover:text-ktu-orange"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">📦</span>
                <span className="text-sm font-medium">Products</span>
              </Link>
              <Link
                to="/mentorship"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-ktu-deep-blue hover:text-ktu-orange"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">👨‍🏫</span>
                <span className="text-sm font-medium">Mentorship</span>
              </Link>
              <Link
                to="/resources"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-ktu-deep-blue hover:text-ktu-orange"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">📚</span>
                <span className="text-sm font-medium">Resources</span>
              </Link>
              <Link
                to="/community"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-ktu-deep-blue hover:text-ktu-orange"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">💬</span>
                <span className="text-sm font-medium">Community</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};