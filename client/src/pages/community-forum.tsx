import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, ThumbsUp, Reply, Share2, Pin, Clock, 
  User, Eye, Star, Plus, Search, Filter, TrendingUp,
  BookOpen, Lightbulb, HelpCircle, Users, Calendar,
  Award, CheckCircle, ArrowUp, MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PostCard = ({ post, index }: { post: any; index: number }) => (
  <motion.div
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="ktu-card hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback className="bg-ktu-light-blue text-ktu-deep-blue">
              {post.author.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-ktu-deep-blue">{post.author.name}</h4>
                <Badge variant="outline" className="text-xs text-ktu-orange border-ktu-orange">
                  {post.author.badge}
                </Badge>
                {post.pinned && <Pin className="h-4 w-4 text-ktu-orange" />}
              </div>
              <div className="flex items-center text-xs text-ktu-dark-grey">
                <Clock className="h-3 w-3 mr-1" />
                {post.timeAgo}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-ktu-deep-blue mb-2 hover:text-ktu-orange cursor-pointer transition-colors">
              {post.title}
            </h3>
            
            <p className="text-ktu-dark-grey mb-4 line-clamp-3">
              {post.content}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge className="bg-ktu-light-blue text-ktu-deep-blue">
                  {post.category}
                </Badge>
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-ktu-dark-grey">
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.replies}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const CategoryCard = ({ category, index }: { category: any; index: number }) => (
  <motion.div
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="ktu-card animate-card-lift cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="ktu-orange-gradient p-3 rounded-full group-hover:scale-110 transition-transform">
            <category.icon className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-ktu-deep-blue group-hover:text-ktu-orange transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-ktu-dark-grey">{category.description}</p>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-bold text-ktu-deep-blue">{category.postCount}</p>
            <p className="text-xs text-ktu-dark-grey">posts</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function CommunityForum() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    {
      name: "General Discussion",
      description: "Share ideas and connect with fellow entrepreneurs",
      icon: MessageCircle,
      postCount: 124
    },
    {
      name: "Business Ideas",
      description: "Brainstorm and get feedback on business concepts",
      icon: Lightbulb,
      postCount: 89
    },
    {
      name: "Success Stories",
      description: "Celebrate wins and share inspiring journeys",
      icon: Award,
      postCount: 67
    },
    {
      name: "Q&A Help",
      description: "Get answers to your business questions",
      icon: HelpCircle,
      postCount: 156
    },
    {
      name: "Networking",
      description: "Find collaborators and build connections",
      icon: Users,
      postCount: 78
    },
    {
      name: "Events & Meetups",
      description: "KTU business events and gatherings",
      icon: Calendar,
      postCount: 34
    }
  ];

  const posts = [
    {
      id: 1,
      title: "Successfully launched my first product - lessons learned",
      content: "After 6 months of development, I finally launched my mobile app for KTU students. Here are the key lessons I learned about customer validation, pricing, and marketing to fellow students...",
      author: {
        name: "Kwame Asante",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        badge: "Verified Vendor"
      },
      category: "Success Stories",
      tags: ["mobile-app", "validation", "launch"],
      likes: 23,
      replies: 12,
      views: 156,
      timeAgo: "2 hours ago",
      pinned: true
    },
    {
      id: 2,
      title: "Looking for a co-founder for my fintech startup",
      content: "I'm building a mobile money solution specifically for students and small businesses in Ghana. Looking for someone with technical background to join as co-founder...",
      author: {
        name: "Ama Wilson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b2b9af25?w=40&h=40&fit=crop&crop=face",
        badge: "Student Entrepreneur"
      },
      category: "Networking",
      tags: ["fintech", "co-founder", "mobile-money"],
      likes: 18,
      replies: 8,
      views: 89,
      timeAgo: "5 hours ago",
      pinned: false
    },
    {
      id: 3,
      title: "How to validate your business idea before building?",
      content: "I have an idea for a food delivery service specifically for KTU campus, but I'm not sure if there's enough demand. What are some effective ways to validate this before investing time and money?",
      author: {
        name: "Joseph Mensah",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        badge: "New Member"
      },
      category: "Q&A Help",
      tags: ["validation", "food-delivery", "research"],
      likes: 15,
      replies: 24,
      views: 234,
      timeAgo: "1 day ago",
      pinned: false
    },
    {
      id: 4,
      title: "KTU Entrepreneurship Workshop - March 15th",
      content: "The Business Development Center is organizing a workshop on 'Scaling Your Student Business'. Guest speakers include successful KTU alumni entrepreneurs. Registration opens tomorrow!",
      author: {
        name: "KTU BizConnect Team",
        avatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop",
        badge: "Official"
      },
      category: "Events & Meetups",
      tags: ["workshop", "scaling", "networking"],
      likes: 45,
      replies: 6,
      views: 312,
      timeAgo: "2 days ago",
      pinned: true
    },
    {
      id: 5,
      title: "Struggling with pricing - any advice?",
      content: "I make custom jewelry and accessories, but I'm having trouble pricing my products competitively while maintaining good profit margins. How do you handle pricing in your businesses?",
      author: {
        name: "Grace Addo",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        badge: "Student Entrepreneur"
      },
      category: "Q&A Help",
      tags: ["pricing", "jewelry", "profit-margins"],
      likes: 12,
      replies: 18,
      views: 145,
      timeAgo: "3 days ago",
      pinned: false
    },
    {
      id: 6,
      title: "Business idea: Campus laundry service - thoughts?",
      content: "I'm thinking of starting a pickup and delivery laundry service for students living on campus. Has anyone tried something similar? What challenges should I expect?",
      author: {
        name: "Samuel Osei",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
        badge: "New Member"
      },
      category: "Business Ideas",
      tags: ["laundry", "campus-service", "logistics"],
      likes: 8,
      replies: 15,
      views: 98,
      timeAgo: "4 days ago",
      pinned: false
    }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'replies', label: 'Most Replied' },
    { value: 'views', label: 'Most Viewed' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat.name, label: cat.name }))
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              Community Forum
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-ktu-dark-grey mb-8"
            >
              Connect, share ideas, and grow together with the KTU entrepreneurship community
            </motion.p>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <Button className="bg-ktu-orange hover:bg-ktu-orange-light">
                <Plus className="h-4 w-4 mr-2" />
                Start New Discussion
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Forum Stats */}
      <section className="bg-ktu-section-gradient py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Active Members", value: "1,247", icon: Users },
              { label: "Total Posts", value: "3,456", icon: MessageCircle },
              { label: "Questions Answered", value: "892", icon: CheckCircle },
              { label: "Success Stories", value: "67", icon: Award }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-ktu-orange" />
                <div className="text-2xl font-bold text-ktu-deep-blue">{stat.value}</div>
                <div className="text-sm text-ktu-dark-grey">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-ktu-deep-blue mb-4">Discussion Categories</h2>
          <p className="text-ktu-dark-grey max-w-2xl mx-auto">
            Browse by category to find relevant discussions and connect with like-minded entrepreneurs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {categories.map((category, index) => (
            <CategoryCard key={category.name} category={category} index={index} />
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ktu-dark-grey h-4 w-4" />
            <Input
              placeholder="Search discussions..."
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
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 border-ktu-light-blue">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-ktu-dark-grey opacity-50" />
              <h3 className="text-lg font-semibold text-ktu-deep-blue mb-2">No posts found</h3>
              <p className="text-ktu-dark-grey mb-4">Try adjusting your search terms or browse different categories</p>
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
            filteredPosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))
          )}
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-ktu-deep-blue mb-6">Community Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Be Respectful",
                  description: "Treat all community members with respect and kindness"
                },
                {
                  title: "Stay On Topic",
                  description: "Keep discussions relevant to entrepreneurship and business"
                },
                {
                  title: "Help Others",
                  description: "Share your knowledge and support fellow entrepreneurs"
                }
              ].map((guideline, index) => (
                <motion.div
                  key={guideline.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="ktu-orange-gradient p-4 rounded-full w-16 h-16 mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-ktu-deep-blue mb-2">{guideline.title}</h3>
                  <p className="text-sm text-ktu-dark-grey">{guideline.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}