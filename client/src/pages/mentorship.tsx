import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Star, Calendar, Clock, Award, BookOpen, 
  ChevronRight, MessageCircle, Video, Phone, Mail,
  GraduationCap, Target, TrendingUp, Heart, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'wouter';

const MentorCard = ({ mentor, index }: { mentor: any; index: number }) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="ktu-card animate-card-lift h-full group cursor-pointer">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <img 
              src={mentor.image || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`} 
              alt={mentor.name}
              className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-ktu-light-blue group-hover:border-ktu-orange transition-colors"
            />
            <h3 className="font-semibold text-ktu-deep-blue group-hover:text-ktu-orange transition-colors">
              {mentor.name}
            </h3>
            <p className="text-sm text-ktu-orange font-medium">{mentor.expertise}</p>
            <p className="text-xs text-ktu-dark-grey">{mentor.company}</p>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ktu-dark-grey">Experience:</span>
              <span className="font-medium text-ktu-deep-blue">{mentor.experience}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ktu-dark-grey">Sessions:</span>
              <span className="font-medium text-ktu-deep-blue">{mentor.sessions} completed</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ktu-dark-grey">Rating:</span>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-ktu-deep-blue">{mentor.rating}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {mentor.skills.slice(0, 3).map((skill: string, index: number) => (
              <span key={index} className="text-xs bg-ktu-light-blue text-ktu-deep-blue px-2 py-1 rounded">
                {skill}
              </span>
            ))}
            {mentor.skills.length > 3 && (
              <span className="text-xs text-ktu-dark-grey">+{mentor.skills.length - 3} more</span>
            )}
          </div>
          
          <Button className="w-full bg-ktu-orange hover:bg-ktu-orange-light">
            Connect <MessageCircle className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function Mentorship() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'business', label: 'Business Strategy' },
    { value: 'tech', label: 'Technology' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'design', label: 'Design' },
    { value: 'operations', label: 'Operations' }
  ];

  const mentors = [
    {
      id: 1,
      name: "Dr. Kwame Asante",
      expertise: "Business Strategy",
      company: "KTU Business School",
      experience: "15+ years",
      sessions: 89,
      rating: 4.9,
      skills: ["Strategic Planning", "Market Analysis", "Growth Strategy", "Leadership"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Ms. Ama Osei",
      expertise: "Digital Marketing",
      company: "Creative Agency Ghana",
      experience: "8+ years",
      sessions: 67,
      rating: 4.8,
      skills: ["Social Media", "Content Marketing", "SEO", "Brand Strategy"],
      image: "https://images.unsplash.com/photo-1494790108755-2616b612e2d3?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Eng. Kofi Mensah",
      expertise: "Technology & Innovation",
      company: "Tech Solutions Ltd",
      experience: "12+ years",
      sessions: 134,
      rating: 4.9,
      skills: ["Software Development", "Product Management", "Innovation", "Tech Strategy"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Ms. Efua Donkor",
      expertise: "Finance & Investment",
      company: "Investment Partners",
      experience: "10+ years",
      sessions: 78,
      rating: 4.7,
      skills: ["Financial Planning", "Investment Strategy", "Budgeting", "Risk Management"],
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Mr. Yaw Osei",
      expertise: "Operations & Supply Chain",
      company: "Manufacturing Corp",
      experience: "14+ years",
      sessions: 95,
      rating: 4.8,
      skills: ["Operations Management", "Supply Chain", "Quality Control", "Process Improvement"],
      image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 6,
      name: "Ms. Akosua Boateng",
      expertise: "Creative Design",
      company: "Design Studio Ghana",
      experience: "7+ years",
      sessions: 56,
      rating: 4.9,
      skills: ["UI/UX Design", "Graphic Design", "Branding", "Creative Strategy"],
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || 
                          mentor.expertise.toLowerCase().includes(selectedCategory);
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
              Find Your Perfect Mentor
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-ktu-dark-grey mb-8"
            >
              Connect with experienced professionals and successful entrepreneurs who can guide your business journey at KTU
            </motion.p>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
            >
              {[
                { label: "Expert Mentors", value: "25+", icon: Users },
                { label: "Success Stories", value: "150+", icon: Award },
                { label: "Hours of Mentoring", value: "1,200+", icon: Clock },
                { label: "Average Rating", value: "4.8", icon: Star }
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

      {/* Search & Filters */}
      <section className="bg-white border-b border-ktu-light-blue">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Input
                placeholder="Search mentors by name, expertise, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-ktu-light-blue focus:border-ktu-orange"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 border-ktu-light-blue">
                <SelectValue placeholder="Category" />
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
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-ktu-section-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-ktu-deep-blue mb-4">
              How Mentorship Works
            </h2>
            <p className="text-ktu-dark-grey max-w-2xl mx-auto">
              Simple steps to connect with your ideal mentor and start your growth journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Browse & Connect",
                description: "Browse our expert mentors and send a connection request to your preferred mentor",
                icon: Users
              },
              {
                step: "02", 
                title: "Schedule Session",
                description: "Book a convenient time slot and choose your preferred communication method",
                icon: Calendar
              },
              {
                step: "03",
                title: "Learn & Grow",
                description: "Get personalized guidance, actionable insights, and ongoing support for your business",
                icon: TrendingUp
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-ktu-orange rounded-full flex items-center justify-center mx-auto">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-ktu-deep-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-ktu-deep-blue mb-3">{item.title}</h3>
                <p className="text-ktu-dark-grey">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-ktu-deep-blue">
            Available Mentors ({filteredMentors.length})
          </h2>
        </div>

        {filteredMentors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-ktu-dark-grey opacity-50" />
            <h3 className="text-lg font-semibold text-ktu-deep-blue mb-2">No mentors found</h3>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor, index) => (
              <MentorCard key={mentor.id} mentor={mentor} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-ktu-deep-blue mb-4">
            Ready to Become a Mentor?
          </h2>
          <p className="text-ktu-dark-grey mb-6 max-w-2xl mx-auto">
            Share your expertise and help the next generation of KTU student entrepreneurs succeed. 
            Make a lasting impact on their journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-ktu-orange hover:bg-ktu-orange-light">
              Apply as Mentor
            </Button>
            <Button variant="outline" className="border-ktu-deep-blue text-ktu-deep-blue hover:bg-ktu-deep-blue hover:text-white">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}