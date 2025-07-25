import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, Star, Calendar, Clock, Users, MapPin,
  MessageCircle, Video, Phone, Mail, Award, BookOpen,
  TrendingUp, Target, Search, Filter, Plus, CheckCircle,
  ArrowRight, User, Building, Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MentorCard = ({ mentor, index }: { mentor: any; index: number }) => (
  <motion.div
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="ktu-card animate-card-lift h-full group">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarImage src={mentor.avatar} />
            <AvatarFallback className="bg-ktu-light-blue text-ktu-deep-blue text-lg">
              {mentor.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="font-semibold text-ktu-deep-blue text-lg mb-1 group-hover:text-ktu-orange transition-colors">
            {mentor.name}
          </h3>
          <p className="text-sm text-ktu-dark-grey mb-2">{mentor.title}</p>
          <p className="text-xs text-ktu-dark-grey mb-3">{mentor.company}</p>
          
          <div className="flex items-center justify-center mb-3">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium text-ktu-deep-blue">{mentor.rating}</span>
            <span className="text-xs text-ktu-dark-grey ml-1">({mentor.reviews} reviews)</span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ktu-dark-grey">Experience:</span>
            <span className="font-medium text-ktu-deep-blue">{mentor.experience} years</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ktu-dark-grey">Students Mentored:</span>
            <span className="font-medium text-ktu-deep-blue">{mentor.studentsCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ktu-dark-grey">Success Rate:</span>
            <span className="font-medium text-green-600">{mentor.successRate}%</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-ktu-dark-grey mb-2">Specializations:</p>
          <div className="flex flex-wrap gap-1">
            {mentor.specializations.slice(0, 3).map((spec: string) => (
              <Badge key={spec} variant="outline" className="text-xs text-ktu-orange border-ktu-orange">
                {spec}
              </Badge>
            ))}
            {mentor.specializations.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{mentor.specializations.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Button className="w-full bg-ktu-orange hover:bg-ktu-orange-light">
            <MessageCircle className="h-4 w-4 mr-2" />
            Book Session
          </Button>
          <Button variant="outline" className="w-full border-ktu-deep-blue text-ktu-deep-blue hover:bg-ktu-deep-blue hover:text-white">
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const ProgramCard = ({ program, index }: { program: any; index: number }) => (
  <motion.div
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="ktu-card animate-card-lift cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="ktu-orange-gradient p-3 rounded-full">
            <program.icon className="h-6 w-6 text-white" />
          </div>
          {program.featured && (
            <Badge className="bg-ktu-orange text-white">Featured</Badge>
          )}
        </div>
        
        <h3 className="font-semibold text-ktu-deep-blue text-lg mb-2 group-hover:text-ktu-orange transition-colors">
          {program.title}
        </h3>
        <p className="text-sm text-ktu-dark-grey mb-4 line-clamp-3">
          {program.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-ktu-dark-grey">
              <Clock className="h-4 w-4 mr-1" />
              Duration: {program.duration}
            </div>
            <div className="flex items-center text-ktu-dark-grey">
              <Users className="h-4 w-4 mr-1" />
              {program.participants} spots
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-ktu-dark-grey">
              <Calendar className="h-4 w-4 mr-1" />
              Starts: {program.startDate}
            </div>
            <div className="font-semibold text-ktu-deep-blue">
              {program.price === 0 ? 'Free' : `₵${program.price}`}
            </div>
          </div>
        </div>

        <Button className="w-full bg-ktu-orange hover:bg-ktu-orange-light">
          {program.price === 0 ? 'Join Program' : 'Enroll Now'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

export default function MentorshipHub() {
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mentors = [
    {
      id: 1,
      name: "Dr. Akosua Frimpong",
      title: "Senior Business Consultant",
      company: "Ghana Investment Promotion Centre",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b2b9af25?w=100&h=100&fit=crop&crop=face",
      rating: 4.9,
      reviews: 127,
      experience: 15,
      studentsCount: 89,
      successRate: 94,
      specializations: ["Business Strategy", "Market Entry", "Investment", "Scaling"],
      availability: "weekends",
      hourlyRate: 80
    },
    {
      id: 2,
      name: "Kwame Osei-Bonsu",
      title: "Tech Entrepreneur & Investor",
      company: "TechAdvance Ghana",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 4.8,
      reviews: 203,
      experience: 12,
      studentsCount: 156,
      successRate: 91,
      specializations: ["Technology", "Startups", "Funding", "Product Development"],
      availability: "evenings",
      hourlyRate: 100
    },
    {
      id: 3,
      name: "Ama Serwaa Nehemiah",
      title: "Digital Marketing Expert",
      company: "Pulse Ghana",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 4.7,
      reviews: 89,
      experience: 8,
      studentsCount: 67,
      successRate: 88,
      specializations: ["Digital Marketing", "Social Media", "Branding", "Content Strategy"],
      availability: "weekdays",
      hourlyRate: 60
    },
    {
      id: 4,
      name: "Samuel Appiah",
      title: "Financial Advisor",
      company: "Standard Chartered Bank Ghana",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 4.9,
      reviews: 145,
      experience: 18,
      studentsCount: 203,
      successRate: 96,
      specializations: ["Financial Planning", "Investment", "Banking", "Risk Management"],
      availability: "weekends",
      hourlyRate: 90
    },
    {
      id: 5,
      name: "Grace Owusu-Ansah",
      title: "E-commerce Specialist",
      company: "Jumia Ghana",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
      rating: 4.6,
      reviews: 78,
      experience: 6,
      studentsCount: 45,
      successRate: 85,
      specializations: ["E-commerce", "Logistics", "Online Sales", "Customer Service"],
      availability: "evenings",
      hourlyRate: 50
    },
    {
      id: 6,
      name: "Yaw Boakye",
      title: "Manufacturing Expert",
      company: "Ghana Standards Authority",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 4.8,
      reviews: 112,
      experience: 20,
      studentsCount: 134,
      successRate: 92,
      specializations: ["Manufacturing", "Quality Control", "Supply Chain", "Operations"],
      availability: "weekdays",
      hourlyRate: 75
    }
  ];

  const programs = [
    {
      id: 1,
      title: "KTU Startup Accelerator",
      description: "12-week intensive program to transform your business idea into a scalable startup. Includes mentorship, funding opportunities, and demo day presentation.",
      icon: TrendingUp,
      duration: "12 weeks",
      participants: 20,
      startDate: "April 1, 2025",
      price: 0,
      featured: true
    },
    {
      id: 2,
      title: "Digital Marketing Bootcamp",
      description: "Learn to build and execute effective digital marketing strategies for your business. Hands-on experience with real campaigns.",
      icon: Target,
      duration: "6 weeks",
      participants: 30,
      startDate: "March 15, 2025",
      price: 150,
      featured: true
    },
    {
      id: 3,
      title: "Financial Literacy for Entrepreneurs",
      description: "Master the fundamentals of business finance, from budgeting to investment decisions and financial planning.",
      icon: BookOpen,
      duration: "4 weeks",
      participants: 25,
      startDate: "March 22, 2025",
      price: 100,
      featured: false
    },
    {
      id: 4,
      title: "Women in Business Leadership",
      description: "Empowering female entrepreneurs with leadership skills, networking opportunities, and mentorship from successful businesswomen.",
      icon: Award,
      duration: "8 weeks",
      participants: 15,
      startDate: "April 8, 2025",
      price: 0,
      featured: true
    }
  ];

  const expertiseOptions = [
    { value: 'all', label: 'All Expertise' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Strategy', label: 'Strategy' }
  ];

  const availabilityOptions = [
    { value: 'all', label: 'Any Time' },
    { value: 'weekdays', label: 'Weekdays' },
    { value: 'evenings', label: 'Evenings' },
    { value: 'weekends', label: 'Weekends' }
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesExpertise = selectedExpertise === 'all' || 
                           mentor.specializations.some(spec => spec.includes(selectedExpertise));
    const matchesAvailability = selectedAvailability === 'all' || mentor.availability === selectedAvailability;
    return matchesSearch && matchesExpertise && matchesAvailability;
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
              Mentorship Hub
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-ktu-dark-grey mb-8"
            >
              Connect with experienced mentors and join programs designed to accelerate your entrepreneurial journey
            </motion.p>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
            >
              {[
                { label: "Expert Mentors", value: "50+", icon: GraduationCap },
                { label: "Success Rate", value: "92%", icon: TrendingUp },
                { label: "Students Mentored", value: "1,200+", icon: Users },
                { label: "Programs", value: "15+", icon: BookOpen }
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

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="mentors" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
            <TabsTrigger value="programs">Join Programs</TabsTrigger>
          </TabsList>

          <TabsContent value="mentors" className="space-y-8">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ktu-dark-grey h-4 w-4" />
                <Input
                  placeholder="Search mentors by name or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-ktu-light-blue focus:border-ktu-orange"
                />
              </div>
              <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
                <SelectTrigger className="w-full md:w-48 border-ktu-light-blue">
                  <SelectValue placeholder="Expertise" />
                </SelectTrigger>
                <SelectContent>
                  {expertiseOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                <SelectTrigger className="w-full md:w-48 border-ktu-light-blue">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mentors Grid */}
            {filteredMentors.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="h-16 w-16 mx-auto mb-4 text-ktu-dark-grey opacity-50" />
                <h3 className="text-lg font-semibold text-ktu-deep-blue mb-2">No mentors found</h3>
                <p className="text-ktu-dark-grey mb-4">Try adjusting your search criteria</p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedExpertise('all');
                    setSelectedAvailability('all');
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
          </TabsContent>

          <TabsContent value="programs" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-ktu-deep-blue mb-4">Mentorship Programs</h2>
              <p className="text-ktu-dark-grey max-w-2xl mx-auto">
                Join structured programs designed to accelerate your business growth with expert guidance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programs.map((program, index) => (
                <ProgramCard key={program.id} program={program} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Success Stories */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-ktu-deep-blue mb-4">Success Stories</h2>
            <p className="text-ktu-dark-grey max-w-2xl mx-auto">
              Hear from KTU students who transformed their businesses with mentorship
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Akosua Mensah",
                business: "Fashion Designer",
                story: "My mentor helped me scale from 5 to 50 customers in 3 months",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b2b9af25?w=60&h=60&fit=crop&crop=face"
              },
              {
                name: "Kofi Asante",
                business: "Tech Startup Founder",
                story: "Secured ₵50,000 funding after 6 months of mentorship",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
              },
              {
                name: "Ama Osei",
                business: "Food Service Owner",
                story: "Expanded to 3 locations with strategic guidance",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
              }
            ].map((story, index) => (
              <motion.div
                key={story.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="ktu-card text-center">
                  <CardContent className="p-6">
                    <Avatar className="w-16 h-16 mx-auto mb-4">
                      <AvatarImage src={story.avatar} />
                      <AvatarFallback className="bg-ktu-light-blue text-ktu-deep-blue">
                        {story.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-semibold text-ktu-deep-blue mb-1">{story.name}</h4>
                    <p className="text-sm text-ktu-dark-grey mb-3">{story.business}</p>
                    <p className="text-sm text-ktu-dark-grey italic">"{story.story}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="ktu-section-gradient py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-ktu-deep-blue mb-4">
            Ready to Accelerate Your Business?
          </h2>
          <p className="text-ktu-dark-grey mb-6 max-w-2xl mx-auto">
            Join thousands of KTU students who have transformed their entrepreneurial dreams into successful businesses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-ktu-orange hover:bg-ktu-orange-light">
              <Plus className="h-4 w-4 mr-2" />
              Become a Mentee
            </Button>
            <Button variant="outline" className="border-ktu-deep-blue text-ktu-deep-blue hover:bg-ktu-deep-blue hover:text-white">
              Apply as Mentor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}