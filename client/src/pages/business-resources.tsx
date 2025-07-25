import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, FileText, Video, Download, ExternalLink, 
  Search, Filter, Star, Clock, Eye, Users,
  TrendingUp, Calculator, Lightbulb, Target,
  Briefcase, PieChart, Calendar, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ResourceCard = ({ resource, index }: { resource: any; index: number }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'guide': return BookOpen;
      case 'template': return FileText;
      case 'video': return Video;
      case 'tool': return Calculator;
      default: return FileText;
    }
  };

  const Icon = getIcon(resource.type);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="ktu-card animate-card-lift h-full group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-full ${resource.featured ? 'ktu-orange-gradient' : 'bg-ktu-light-blue'}`}>
              <Icon className={`h-6 w-6 ${resource.featured ? 'text-white' : 'text-ktu-deep-blue'}`} />
            </div>
            {resource.featured && (
              <Badge className="bg-ktu-orange text-white">Featured</Badge>
            )}
          </div>
          
          <h3 className="font-semibold text-ktu-deep-blue mb-2 group-hover:text-ktu-orange transition-colors">
            {resource.title}
          </h3>
          <p className="text-sm text-ktu-dark-grey mb-4 line-clamp-3">
            {resource.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-ktu-dark-grey mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                <span>{resource.views}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                <span>{resource.rating}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{resource.duration}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-ktu-deep-blue border-ktu-light-blue">
              {resource.category}
            </Badge>
            <Button size="sm" className="bg-ktu-orange hover:bg-ktu-orange-light">
              {resource.type === 'video' ? 'Watch' : resource.type === 'tool' ? 'Use Tool' : 'Read'}
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CategoryCard = ({ category, index }: { category: any; index: number }) => (
  <motion.div
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="ktu-card animate-card-lift cursor-pointer group">
      <CardContent className="p-6 text-center">
        <div className="ktu-orange-gradient p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
          <category.icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="font-semibold text-ktu-deep-blue mb-2 group-hover:text-ktu-orange transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-ktu-dark-grey mb-3">{category.description}</p>
        <Badge variant="outline" className="text-ktu-orange border-ktu-orange">
          {category.resourceCount} resources
        </Badge>
      </CardContent>
    </Card>
  </motion.div>
);

export default function BusinessResources() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    {
      name: "Business Planning",
      description: "Create solid foundations for your venture",
      icon: Target,
      resourceCount: 12
    },
    {
      name: "Financial Management",
      description: "Master budgeting and financial planning",
      icon: PieChart,
      resourceCount: 8
    },
    {
      name: "Marketing & Sales",
      description: "Grow your customer base effectively",
      icon: TrendingUp,
      resourceCount: 15
    },
    {
      name: "Legal & Compliance",
      description: "Navigate regulations and requirements",
      icon: CheckCircle,
      resourceCount: 6
    },
    {
      name: "Digital Tools",
      description: "Leverage technology for growth",
      icon: Calculator,
      resourceCount: 10
    },
    {
      name: "Networking",
      description: "Build valuable connections",
      icon: Users,
      resourceCount: 7
    }
  ];

  const resources = [
    {
      id: 1,
      title: "KTU Student Business Plan Template",
      description: "Comprehensive business plan template specifically designed for KTU student entrepreneurs, including market analysis sections for the local economy.",
      type: "template",
      category: "Business Planning",
      rating: 4.9,
      views: 1247,
      duration: "30 min read",
      featured: true
    },
    {
      id: 2,
      title: "Financial Planning for Students",
      description: "Learn how to manage finances as a student entrepreneur, including budgeting, cash flow management, and securing funding.",
      type: "guide",
      category: "Financial Management",
      rating: 4.7,
      views: 892,
      duration: "45 min read",
      featured: true
    },
    {
      id: 3,
      title: "Social Media Marketing Masterclass",
      description: "Complete video series on building your brand presence on social media platforms popular in Ghana.",
      type: "video",
      category: "Marketing & Sales",
      rating: 4.8,
      views: 2134,
      duration: "2.5 hours",
      featured: true
    },
    {
      id: 4,
      title: "Business Registration in Ghana",
      description: "Step-by-step guide to registering your business in Ghana, including all required documents and procedures.",
      type: "guide",
      category: "Legal & Compliance",
      rating: 4.6,
      views: 743,
      duration: "25 min read",
      featured: false
    },
    {
      id: 5,
      title: "Customer Survey Template",
      description: "Ready-to-use customer survey templates to understand your target market and improve your products.",
      type: "template",
      category: "Marketing & Sales",
      rating: 4.5,
      views: 567,
      duration: "15 min setup",
      featured: false
    },
    {
      id: 6,
      title: "Profit Margin Calculator",
      description: "Interactive tool to calculate profit margins, break-even points, and pricing strategies for your products.",
      type: "tool",
      category: "Financial Management",
      rating: 4.8,
      views: 1089,
      duration: "5 min use",
      featured: false
    },
    {
      id: 7,
      title: "Networking Events Calendar",
      description: "Stay updated with KTU and regional business networking events, workshops, and entrepreneurship meetups.",
      type: "tool",
      category: "Networking",
      rating: 4.4,
      views: 445,
      duration: "Ongoing",
      featured: false
    },
    {
      id: 8,
      title: "E-commerce Setup Guide",
      description: "Complete guide to setting up your online store, from choosing platforms to payment integration.",
      type: "guide",
      category: "Digital Tools",
      rating: 4.7,
      views: 823,
      duration: "1 hour read",
      featured: false
    },
    {
      id: 9,
      title: "Pitch Deck Template",
      description: "Professional pitch deck template for presenting your business idea to investors and stakeholders.",
      type: "template",
      category: "Business Planning",
      rating: 4.6,
      views: 934,
      duration: "20 min customize",
      featured: false
    }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'guide', label: 'Guides' },
    { value: 'template', label: 'Templates' },
    { value: 'video', label: 'Videos' },
    { value: 'tool', label: 'Tools' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat.name, label: cat.name }))
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const featuredResources = resources.filter(r => r.featured);

  return (
    <div className="min-h-screen bg-ktu-grey">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl md:text-5xl font-bold text-ktu-deep-blue mb-6"
            >
              Business Resources Hub
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-ktu-dark-grey mb-8"
            >
              Access comprehensive tools, guides, and templates to grow your KTU student business
            </motion.p>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
            >
              {[
                { label: "Guides", value: "25+", icon: BookOpen },
                { label: "Templates", value: "15+", icon: FileText },
                { label: "Video Courses", value: "10+", icon: Video },
                { label: "Business Tools", value: "8+", icon: Calculator }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-ktu-orange" />
                  <div className="text-2xl font-bold text-ktu-deep-blue">{stat.value}</div>
                  <div className="text-sm text-ktu-dark-grey">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-ktu-section-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-ktu-deep-blue mb-4">
              Resource Categories
            </h2>
            <p className="text-ktu-dark-grey max-w-2xl mx-auto">
              Browse resources by category to find exactly what you need for your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={category.name} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-ktu-deep-blue mb-4">
              Featured Resources
            </h2>
            <p className="text-ktu-dark-grey max-w-2xl mx-auto">
              Hand-picked resources to help you succeed as a KTU student entrepreneur
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((resource, index) => (
              <ResourceCard key={resource.id} resource={resource} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* All Resources */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-ktu-deep-blue mb-6">All Resources</h2>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ktu-dark-grey h-4 w-4" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-ktu-light-blue focus:border-ktu-orange"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 border-ktu-light-blue">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48 border-ktu-light-blue">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-ktu-dark-grey opacity-50" />
            <h3 className="text-lg font-semibold text-ktu-deep-blue mb-2">No resources found</h3>
            <p className="text-ktu-dark-grey mb-4">Try adjusting your search terms or filters</p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedType('all');
              }}
              className="bg-ktu-orange hover:bg-ktu-orange-light"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <ResourceCard key={resource.id} resource={resource} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-ktu-deep-blue mb-4">
            Need a Specific Resource?
          </h2>
          <p className="text-ktu-dark-grey mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Let us know what resources would help your business grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-ktu-orange hover:bg-ktu-orange-light">
              Request Resource
            </Button>
            <Button variant="outline" className="border-ktu-deep-blue text-ktu-deep-blue hover:bg-ktu-deep-blue hover:text-white">
              Suggest a Topic
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}