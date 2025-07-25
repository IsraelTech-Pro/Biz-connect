import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Link as LinkIcon, 
  Tag, 
  Plus,
  ArrowLeft 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

export default function AddResource() {
  const [, navigate] = useLocation();
  const { token } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'business-plan',
    resource_type: 'guide',
    file_url: '',
    external_link: '',
    tags: '',
    difficulty_level: 'beginner',
    estimated_time: '',
    status: 'published'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add resource');
      }

      toast({
        title: "Success",
        description: "Resource added successfully!",
      });

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error adding resource:', error);
      toast({
        title: "Error",
        description: "Failed to add resource. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ktu-grey py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ktu-deep-blue mb-2">Add Business Resource</h1>
              <p className="text-ktu-dark-grey">Create a new resource to help KTU student entrepreneurs</p>
            </div>
            <Link to="/admin/dashboard">
              <Button variant="outline" className="text-ktu-deep-blue hover:text-ktu-orange">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-ktu-deep-blue">Resource Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="title" className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Resource Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., How to Write a Business Plan"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      Category
                    </Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ktu-orange focus:border-ktu-orange"
                    >
                      <option value="business-plan">Business Planning</option>
                      <option value="marketing">Marketing & Sales</option>
                      <option value="finance">Finance & Funding</option>
                      <option value="legal">Legal & Compliance</option>
                      <option value="operations">Operations</option>
                      <option value="technology">Technology</option>
                      <option value="personal-development">Personal Development</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="resource_type">Resource Type</Label>
                    <select
                      id="resource_type"
                      name="resource_type"
                      value={formData.resource_type}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ktu-orange focus:border-ktu-orange"
                    >
                      <option value="guide">Guide</option>
                      <option value="template">Template</option>
                      <option value="checklist">Checklist</option>
                      <option value="video">Video</option>
                      <option value="webinar">Webinar</option>
                      <option value="ebook">E-book</option>
                      <option value="tool">Tool</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty_level">Difficulty Level</Label>
                    <select
                      id="difficulty_level"
                      name="difficulty_level"
                      value={formData.difficulty_level}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ktu-orange focus:border-ktu-orange"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="estimated_time">Estimated Reading Time</Label>
                    <Input
                      id="estimated_time"
                      name="estimated_time"
                      value={formData.estimated_time}
                      onChange={handleInputChange}
                      placeholder="e.g., 15 minutes, 1 hour"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Brief description of what this resource covers..."
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={8}
                    placeholder="Full content of the resource (you can use markdown formatting)..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="file_url" className="flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      File URL (optional)
                    </Label>
                    <Input
                      id="file_url"
                      name="file_url"
                      value={formData.file_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/resource.pdf"
                    />
                  </div>

                  <div>
                    <Label htmlFor="external_link" className="flex items-center">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      External Link (optional)
                    </Label>
                    <Input
                      id="external_link"
                      name="external_link"
                      value={formData.external_link}
                      onChange={handleInputChange}
                      placeholder="https://example.com/external-resource"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="startup, business plan, entrepreneurship"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ktu-orange focus:border-ktu-orange"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-ktu-orange hover:bg-ktu-orange-light text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Adding...' : 'Add Resource'}
                  </Button>
                  <Link to="/admin/dashboard">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}