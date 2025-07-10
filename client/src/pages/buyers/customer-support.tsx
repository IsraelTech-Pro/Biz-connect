import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, Phone, Mail, MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import type { InsertSupportRequest } from '@shared/schema';

const supportSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type SupportForm = z.infer<typeof supportSchema>;

const faqData = [
  {
    question: "How do I track my order?",
    answer: "You can track your order using our order tracking page. Just enter your order ID or email address to get real-time updates on your order status."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept MTN Mobile Money, Vodafone Cash, AirtelTigo Money, and all major credit/debit cards through our secure Paystack integration."
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery times vary by location and vendor. Most orders within Accra are delivered within 1-3 business days, while other regions may take 3-7 business days."
  },
  {
    question: "Can I return or exchange items?",
    answer: "Yes, we have a 7-day return policy for most items. Items must be in original condition with all packaging and tags. See our return policy for full details."
  },
  {
    question: "How do I contact a vendor directly?",
    answer: "You can contact vendors through their store pages or through your order details. We also facilitate communication for any order-related queries."
  }
];

export default function CustomerSupport() {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SupportForm>({
    resolver: zodResolver(supportSchema),
  });

  const supportMutation = useMutation({
    mutationFn: async (data: InsertSupportRequest) => {
      return await apiRequest('/api/support-requests', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Support request sent!",
        description: "We'll get back to you within 4-6 hours.",
      });
      reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send support request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SupportForm) => {
    supportMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold text-black mb-4">
              Customer <span className="text-gradient">Support</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Need help? We're here to assist you with any questions or concerns about your orders, returns, or our platform.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Options */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Contact */}
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Quick Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Phone className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone Support</h4>
                    <p className="text-sm text-gray-600 mb-1">+233 XX XXX XXXX</p>
                    <Badge variant="secondary" className="text-xs">
                      Mon-Fri: 8:00 AM - 6:00 PM
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Mail className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email Support</h4>
                    <p className="text-sm text-gray-600 mb-1">support@vendorhub.com</p>
                    <Badge variant="secondary" className="text-xs">
                      Response: 4-6 hours
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Business Hours</h4>
                    <p className="text-sm text-gray-600">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Issues */}
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle>Common Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedCategory('order')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === 'order' 
                        ? 'bg-orange-50 border-l-4 border-orange-500' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">Order Issues</div>
                    <div className="text-sm text-gray-600">Tracking, delays, cancellations</div>
                  </button>

                  <button
                    onClick={() => setSelectedCategory('payment')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === 'payment' 
                        ? 'bg-orange-50 border-l-4 border-orange-500' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">Payment Issues</div>
                    <div className="text-sm text-gray-600">Refunds, payment failures</div>
                  </button>

                  <button
                    onClick={() => setSelectedCategory('returns')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === 'returns' 
                        ? 'bg-orange-50 border-l-4 border-orange-500' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">Returns & Exchanges</div>
                    <div className="text-sm text-gray-600">Return process, refund status</div>
                  </button>

                  <button
                    onClick={() => setSelectedCategory('general')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === 'general' 
                        ? 'bg-orange-50 border-l-4 border-orange-500' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">General Questions</div>
                    <div className="text-sm text-gray-600">Account, platform, other</div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Support Form */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input
                        {...register('name')}
                        placeholder="Enter your full name"
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <Input
                        {...register('email')}
                        type="email"
                        placeholder="Enter your email"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Issue Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border rounded-md bg-white"
                    >
                      <option value="general">General Questions</option>
                      <option value="order">Order Issues</option>
                      <option value="payment">Payment Issues</option>
                      <option value="returns">Returns & Exchanges</option>
                      <option value="technical">Technical Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea
                      {...register('message')}
                      placeholder="Describe your issue or question in detail..."
                      rows={6}
                      className={errors.message ? 'border-red-500' : ''}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={supportMutation.isPending}
                    className="w-full gradient-bg text-white"
                  >
                    {supportMutation.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqData.map((faq, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <h4 className="font-semibold mb-2">{faq.question}</h4>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status Updates */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">Payment System</div>
                      <div className="text-sm text-gray-600">All systems operational</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">Order Processing</div>
                      <div className="text-sm text-gray-600">Normal processing times</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">Mobile Money</div>
                      <div className="text-sm text-gray-600">All networks available</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}