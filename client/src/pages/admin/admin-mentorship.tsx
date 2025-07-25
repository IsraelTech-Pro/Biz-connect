import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  Building,
  Briefcase,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Mentor Form Component
const MentorForm = ({ mentor, onClose, onSuccess }: { 
  mentor?: any; 
  onClose: () => void; 
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState({
    full_name: mentor?.full_name || '',
    email: mentor?.email || '',
    phone: mentor?.phone || '',
    company: mentor?.company || '',
    position: mentor?.position || '',
    expertise: mentor?.expertise || '',
    bio: mentor?.bio || '',
    years_experience: mentor?.years_experience || '',
    specializations: mentor?.specializations || '',
    availability: mentor?.availability || 'weekends',
    status: mentor?.status || 'active',
    profile_image: mentor?.profile_image || '',
    linkedin_url: mentor?.linkedin_url || '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/admin/mentors', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mentors'] });
      toast({ title: 'Success', description: 'Mentor created successfully' });
      onSuccess();
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create mentor', variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/admin/mentors/${mentor.id}`, { method: 'PUT', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mentors'] });
      toast({ title: 'Success', description: 'Mentor updated successfully' });
      onSuccess();
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update mentor', variant: 'destructive' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      years_experience: parseInt(formData.years_experience)
    };
    
    if (mentor) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => handleChange('position', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="expertise">Expertise</Label>
          <Input
            id="expertise"
            value={formData.expertise}
            onChange={(e) => handleChange('expertise', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="years_experience">Years of Experience</Label>
          <Input
            id="years_experience"
            type="number"
            value={formData.years_experience}
            onChange={(e) => handleChange('years_experience', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="availability">Availability</Label>
          <Select value={formData.availability} onValueChange={(value) => handleChange('availability', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekdays">Weekdays</SelectItem>
              <SelectItem value="evenings">Evenings</SelectItem>
              <SelectItem value="weekends">Weekends</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="specializations">Specializations (comma-separated)</Label>
          <Input
            id="specializations"
            value={formData.specializations}
            onChange={(e) => handleChange('specializations', e.target.value)}
            placeholder="e.g., Business Strategy, Marketing, Finance"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            rows={4}
            required
          />
        </div>
        <div>
          <Label htmlFor="profile_image">Profile Image URL</Label>
          <Input
            id="profile_image"
            value={formData.profile_image}
            onChange={(e) => handleChange('profile_image', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input
            id="linkedin_url"
            value={formData.linkedin_url}
            onChange={(e) => handleChange('linkedin_url', e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={createMutation.isPending || updateMutation.isPending}
          className="bg-ktu-orange hover:bg-ktu-orange-light"
        >
          {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Mentor'}
        </Button>
      </div>
    </form>
  );
};

// Program Form Component
const ProgramForm = ({ program, onClose, onSuccess }: { 
  program?: any; 
  onClose: () => void; 
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: program?.title || '',
    description: program?.description || '',
    duration: program?.duration || '',
    max_participants: program?.max_participants || '',
    program_type: program?.program_type || 'mentorship',
    start_date: program?.start_date ? new Date(program.start_date).toISOString().slice(0, 16) : '',
    end_date: program?.end_date ? new Date(program.end_date).toISOString().slice(0, 16) : '',
    requirements: program?.requirements || '',
    outcomes: program?.outcomes || '',
    status: program?.status || 'upcoming',
    mentor_id: program?.mentor_id || '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch mentors for dropdown
  const { data: mentors = [] } = useQuery({
    queryKey: ['/api/mentors'],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/admin/programs', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/programs'] });
      toast({ title: 'Success', description: 'Program created successfully' });
      onSuccess();
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create program', variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/admin/programs/${program.id}`, { method: 'PUT', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/programs'] });
      toast({ title: 'Success', description: 'Program updated successfully' });
      onSuccess();
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update program', variant: 'destructive' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      max_participants: parseInt(formData.max_participants),
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
    };
    
    if (program) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="title">Program Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            required
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            placeholder="e.g., 12 weeks"
            required
          />
        </div>
        <div>
          <Label htmlFor="max_participants">Max Participants</Label>
          <Input
            id="max_participants"
            type="number"
            value={formData.max_participants}
            onChange={(e) => handleChange('max_participants', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="program_type">Program Type</Label>
          <Select value={formData.program_type} onValueChange={(value) => handleChange('program_type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mentorship">Mentorship</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="bootcamp">Bootcamp</SelectItem>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="seminar">Seminar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="datetime-local"
            value={formData.start_date}
            onChange={(e) => handleChange('start_date', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="datetime-local"
            value={formData.end_date}
            onChange={(e) => handleChange('end_date', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="mentor_id">Assigned Mentor</Label>
          <Select value={formData.mentor_id} onValueChange={(value) => handleChange('mentor_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a mentor" />
            </SelectTrigger>
            <SelectContent>
              {mentors.map((mentor: any) => (
                <SelectItem key={mentor.id} value={mentor.id}>
                  {mentor.full_name} - {mentor.expertise}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="requirements">Requirements</Label>
          <Textarea
            id="requirements"
            value={formData.requirements}
            onChange={(e) => handleChange('requirements', e.target.value)}
            rows={3}
            placeholder="List program requirements..."
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="outcomes">Expected Outcomes</Label>
          <Textarea
            id="outcomes"
            value={formData.outcomes}
            onChange={(e) => handleChange('outcomes', e.target.value)}
            rows={3}
            placeholder="List expected outcomes..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={createMutation.isPending || updateMutation.isPending}
          className="bg-ktu-orange hover:bg-ktu-orange-light"
        >
          {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Program'}
        </Button>
      </div>
    </form>
  );
};

export default function AdminMentorship() {
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  const [editingProgram, setEditingProgram] = useState(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch mentors and programs
  const { data: mentors = [], isLoading: mentorsLoading } = useQuery({
    queryKey: ['/api/mentors'],
  });

  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ['/api/programs'],
  });

  const deleteMentorMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/mentors/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mentors'] });
      toast({ title: 'Success', description: 'Mentor deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete mentor', variant: 'destructive' });
    }
  });

  const deleteProgramMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/programs/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/programs'] });
      toast({ title: 'Success', description: 'Program deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete program', variant: 'destructive' });
    }
  });

  const handleEditMentor = (mentor: any) => {
    setEditingMentor(mentor);
    setShowMentorForm(true);
  };

  const handleEditProgram = (program: any) => {
    setEditingProgram(program);
    setShowProgramForm(true);
  };

  const handleDeleteMentor = (id: string) => {
    if (confirm('Are you sure you want to delete this mentor?')) {
      deleteMentorMutation.mutate(id);
    }
  };

  const handleDeleteProgram = (id: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      deleteProgramMutation.mutate(id);
    }
  };

  const resetForms = () => {
    setShowMentorForm(false);
    setShowProgramForm(false);
    setEditingMentor(null);
    setEditingProgram(null);
  };

  return (
    <div className="min-h-screen bg-ktu-grey p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ktu-deep-blue mb-2">Mentorship Management</h1>
          <p className="text-ktu-dark-grey">Manage mentors and programs for KTU BizConnect</p>
        </div>

        <Tabs defaultValue="mentors" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="mentors">Mentors</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
          </TabsList>

          <TabsContent value="mentors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-ktu-deep-blue">Mentors ({mentors.length})</h2>
              <Dialog open={showMentorForm} onOpenChange={setShowMentorForm}>
                <DialogTrigger asChild>
                  <Button className="bg-ktu-orange hover:bg-ktu-orange-light">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Mentor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingMentor ? 'Edit Mentor' : 'Add New Mentor'}
                    </DialogTitle>
                  </DialogHeader>
                  <MentorForm
                    mentor={editingMentor}
                    onClose={resetForms}
                    onSuccess={resetForms}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {mentorsLoading ? (
              <div className="text-center py-8">Loading mentors...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor: any) => (
                  <Card key={mentor.id} className="ktu-card">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={mentor.profile_image} />
                          <AvatarFallback className="bg-ktu-light-blue text-ktu-deep-blue">
                            {mentor.full_name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-ktu-deep-blue">{mentor.full_name}</CardTitle>
                          <p className="text-sm text-ktu-dark-grey">{mentor.position}</p>
                          <p className="text-xs text-ktu-dark-grey">{mentor.company}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-4 w-4 text-ktu-dark-grey" />
                          <span className="text-ktu-dark-grey truncate">{mentor.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-ktu-dark-grey" />
                          <span className="text-ktu-dark-grey">{mentor.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Briefcase className="h-4 w-4 text-ktu-dark-grey" />
                          <span className="text-ktu-dark-grey">{mentor.years_experience} years experience</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-ktu-dark-grey" />
                          <span className="text-ktu-dark-grey capitalize">{mentor.availability}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {mentor.specializations?.split(',').slice(0, 2).map((spec: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {spec.trim()}
                            </Badge>
                          ))}
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`w-fit ${mentor.status === 'active' ? 'border-green-500 text-green-700' : 'border-gray-500 text-gray-700'}`}
                        >
                          {mentor.status}
                        </Badge>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditMentor(mentor)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteMentor(mentor.id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="programs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-ktu-deep-blue">Programs ({programs.length})</h2>
              <Dialog open={showProgramForm} onOpenChange={setShowProgramForm}>
                <DialogTrigger asChild>
                  <Button className="bg-ktu-orange hover:bg-ktu-orange-light">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Program
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProgram ? 'Edit Program' : 'Add New Program'}
                    </DialogTitle>
                  </DialogHeader>
                  <ProgramForm
                    program={editingProgram}
                    onClose={resetForms}
                    onSuccess={resetForms}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {programsLoading ? (
              <div className="text-center py-8">Loading programs...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {programs.map((program: any) => {
                  const mentor = mentors.find((m: any) => m.id === program.mentor_id);
                  const startDate = new Date(program.start_date).toLocaleDateString();
                  const endDate = new Date(program.end_date).toLocaleDateString();
                  
                  return (
                    <Card key={program.id} className="ktu-card">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg text-ktu-deep-blue mb-2">{program.title}</CardTitle>
                            <Badge 
                              variant="outline" 
                              className={`mb-2 ${
                                program.status === 'active' ? 'border-green-500 text-green-700' : 
                                program.status === 'upcoming' ? 'border-blue-500 text-blue-700' :
                                program.status === 'completed' ? 'border-gray-500 text-gray-700' :
                                'border-red-500 text-red-700'
                              }`}
                            >
                              {program.status}
                            </Badge>
                          </div>
                          <Badge variant="secondary" className="capitalize">
                            {program.program_type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-ktu-dark-grey mb-4 line-clamp-3">
                          {program.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="h-4 w-4 text-ktu-dark-grey" />
                            <span className="text-ktu-dark-grey">Duration: {program.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Users className="h-4 w-4 text-ktu-dark-grey" />
                            <span className="text-ktu-dark-grey">
                              {program.participants_count || 0}/{program.max_participants} participants
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-ktu-dark-grey" />
                            <span className="text-ktu-dark-grey">{startDate} - {endDate}</span>
                          </div>
                          {mentor && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Star className="h-4 w-4 text-ktu-dark-grey" />
                              <span className="text-ktu-dark-grey">Mentor: {mentor.full_name}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProgram(program)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProgram(program.id)}
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}