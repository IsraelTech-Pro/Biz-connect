import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, FileText, Video, Download, ExternalLink, 
  Search, Filter, Star, Clock, Eye, Users,
  TrendingUp, Calculator, Lightbulb, Target,
  Briefcase, PieChart, Calendar, CheckCircle,
  FileDown, Play, Wrench
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Types from backend schema
interface Resource {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  resource_type: string;
  file_url?: string;
  external_link?: string;
  tags: string[];
  difficulty_level: string;
  estimated_time?: string;
  status: string;
  views: number;
  downloads: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

const ResourceCard = ({ resource, index }: { resource: Resource; index: number }) => {
  const { toast } = useToast();
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'guide': return BookOpen;
      case 'template': return FileText;
      case 'video': return Video;
      case 'webinar': return Play;
      case 'tool': return Calculator;
      case 'checklist': return CheckCircle;
      case 'ebook': return BookOpen;
      default: return FileText;
    }
  };

  const Icon = getIcon(resource.resource_type);

  const handleDownload = async () => {
    if (resource.external_link) {
      window.open(resource.external_link, '_blank');
      return;
    }
    
    if (!resource.file_url) {
      toast({
        title: "No file available",
        description: "This resource doesn't have a downloadable file.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/resources/${resource.id}/download`);
      if (response.ok) {
        // If it's a redirect, let the browser handle it
        if (response.redirected) {
          window.location.href = response.url;
        } else {
          // For direct file downloads
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${resource.title.replace(/[^a-zA-Z0-9]/g, '_')}.${resource.file_url.split('.').pop()}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
        
        toast({
          title: "Download started",
          description: `Downloading ${resource.title}`,
        });
      } else {
        toast({
          title: "Download failed",
          description: "Could not download the resource file.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download error",
        description: "An error occurred while downloading the file.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="ktu-card animate-card-lift h-full group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-full bg-ktu-light-blue">
              <Icon className="h-6 w-6 text-ktu-deep-blue" />
            </div>
            <Badge className={`${resource.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' : 
              resource.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'}`}>
              {resource.difficulty_level}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-ktu-deep-blue mb-2 group-hover:text-ktu-orange transition-colors">
            {resource.title}
          </h3>
          <p className="text-sm text-ktu-dark-grey mb-4 line-clamp-3">
            {resource.description}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-xs text-ktu-dark-grey">
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {resource.views || 0}
              </div>
              <div className="flex items-center">
                <Download className="h-3 w-3 mr-1" />
                {resource.downloads || 0}
              </div>
              {resource.estimated_time && (
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {resource.estimated_time}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-ktu-orange border-ktu-orange text-xs">
                {resource.category.replace('-', ' ')}
              </Badge>
              <Badge variant="outline" className="text-ktu-deep-blue border-ktu-deep-blue text-xs">
                {resource.resource_type}
              </Badge>
            </div>
            <Button 
              size="sm" 
              className="bg-ktu-orange hover:bg-ktu-orange-light"
              onClick={handleDownload}
            >
              {resource.external_link ? (
                <>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </>
              )}
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

  // Fetch real resources from database
  const { data: resources = [], isLoading, isError } = useQuery({
    queryKey: ['/api/resources'],
    queryFn: async () => {
      const response = await fetch('/api/resources');
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      return response.json();
    }
  });

  // Categories with real resource counts
  const categoryCounts = resources.reduce((acc: Record<string, number>, resource: Resource) => {
    acc[resource.category] = (acc[resource.category] || 0) + 1;
    return acc;
  }, {});

  const categories = [
    {
      name: "Business Planning",
      key: "business-plan",
      description: "Create solid foundations for your venture",
      icon: Target,
      resourceCount: categoryCounts['business-plan'] || 0
    },
    {
      name: "Financial Management", 
      key: "finance",
      description: "Master budgeting and financial planning",
      icon: PieChart,
      resourceCount: categoryCounts['finance'] || 0
    },
    {
      name: "Marketing & Sales",
      key: "marketing",
      description: "Grow your customer base effectively",
      icon: TrendingUp,
      resourceCount: categoryCounts['marketing'] || 0
    },
    {
      name: "Legal & Compliance",
      key: "legal",
      description: "Navigate regulations and requirements",
      icon: CheckCircle,
      resourceCount: categoryCounts['legal'] || 0
    },
    {
      name: "Technology & Digital Tools",
      key: "technology",
      description: "Leverage technology for growth",
      icon: Calculator,
      resourceCount: categoryCounts['technology'] || 0
    },
    {
      name: "Personal Development",
      key: "personal-development",
      description: "Build leadership and personal skills",
      icon: Users,
      resourceCount: categoryCounts['personal-development'] || 0
    },
    {
      name: "Operations",
      key: "operations", 
      description: "Streamline business operations",
      icon: Briefcase,
      resourceCount: categoryCounts['operations'] || 0
    }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'guide', label: 'Guides' },
    { value: 'template', label: 'Templates' },
    { value: 'video', label: 'Videos' },
    { value: 'webinar', label: 'Webinars' },
    { value: 'tool', label: 'Tools' },
    { value: 'checklist', label: 'Checklists' },
    { value: 'ebook', label: 'eBooks' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat.key, label: cat.name }))
  ];

  // Filter resources based on current selections
  const filteredResources = resources.filter((resource: Resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.resource_type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Get statistics for hero section
  const resourceStats = {
    totalGuides: resources.filter((r: Resource) => r.resource_type === 'guide').length,
    totalTemplates: resources.filter((r: Resource) => r.resource_type === 'template').length,
    totalVideos: resources.filter((r: Resource) => r.resource_type === 'video' || r.resource_type === 'webinar').length,
    totalTools: resources.filter((r: Resource) => r.resource_type === 'tool').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ktu-grey flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ktu-orange"></div>
          <p className="mt-4 text-ktu-deep-blue">Loading resources...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-ktu-grey flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ktu-deep-blue mb-4">Error Loading Resources</h2>
          <p className="text-ktu-dark-grey">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

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
                { label: "Guides", value: `${resourceStats.totalGuides}+`, icon: BookOpen },
                { label: "Templates", value: `${resourceStats.totalTemplates}+`, icon: FileText },
                { label: "Video Courses", value: `${resourceStats.totalVideos}+`, icon: Video },
                { label: "Business Tools", value: `${resourceStats.totalTools}+`, icon: Calculator }
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
              <CategoryCard key={category.key} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* All Resources */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-ktu-deep-blue mb-6">All Resources ({filteredResources.length})</h2>
          
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
            {filteredResources.map((resource: Resource, index: number) => (
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