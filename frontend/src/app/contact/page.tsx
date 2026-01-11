'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  Mail, 
  MessageSquare, 
  Github, 
  ExternalLink, 
  CheckCircle, 
  Users, 
  Clock, 
  AlertCircle, 
  BookOpen,
  Bug,
  Lightbulb,
  HelpCircle,
  Phone,
  MapPin,
  Globe
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center">
          <CardContent className="py-12">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" aria-hidden="true" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Thank you for contacting us. We've received your message and will get back to you 
              within 24 hours during business days.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                What happens next?
              </h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Our support team will review your message within 2-4 hours</li>
                <li>• You'll receive a response via email within 24 hours</li>
                <li>• For urgent issues, we'll prioritize and respond faster</li>
                <li>• Please check your spam folder if you don't see our response</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
                }}
                className="px-8"
              >
                Send Another Message
              </Button>
              <Link 
                href="/"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] border-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500 active:bg-gray-100 h-10 px-8 py-2 gap-2"
              >
                Return to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Have questions about our API, need technical support, or want to contribute to the project? 
          We're here to help and would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <MessageSquare className="mr-3 h-6 w-6" />
                Send us a message
              </CardTitle>
              <CardDescription className="text-base">
                Fill out the form below and we'll get back to you within 24 hours during business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Message Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="api">API Question</option>
                    <option value="contribution">Contribution/Collaboration</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief description of your inquiry"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please provide as much detail as possible about your inquiry..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information Sidebar */}
        <div className="space-y-6">
          {/* Direct Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Direct Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Email Support</h4>
                <a 
                  href="mailto:vinodkr8833@gmail.com" 
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  vinodkr8833@gmail.com
                </a>
                <p className="text-sm text-gray-500 mt-1">
                  Primary contact for all inquiries
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Response Time</h4>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-2 h-4 w-4" />
                  Within 24 hours
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a 
                href="http://localhost:3001/api/docs" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] border-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500 active:bg-gray-100 h-10 px-4 py-2 gap-2 w-full justify-start"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                API Documentation
              </a>
              
              <Link 
                href="/about"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] border-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500 active:bg-gray-100 h-10 px-4 py-2 gap-2 w-full justify-start"
              >
                <Users className="mr-2 h-4 w-4" />
                About the Project
              </Link>
              
              <Link 
                href="/readme"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] border-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500 active:bg-gray-100 h-10 px-4 py-2 gap-2 w-full justify-start"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Setup Guide
              </Link>
            </CardContent>
          </Card>

          {/* Open Source */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Github className="mr-2 h-5 w-5" />
                Open Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-sm">
                This project is open source. Contribute, report issues, or explore the code:
              </p>
              <a 
                href="https://github.com/vinod8833/product-data-explorer" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md focus-visible:ring-blue-500 active:bg-blue-800 h-10 px-4 py-2 gap-2 w-full"
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
              <p className="text-xs text-gray-500 mt-3">
                Issues, feature requests, and pull requests are welcome!
              </p>
            </CardContent>
          </Card>

          {/* Support Types */}
          <Card>
            <CardHeader>
              <CardTitle>Support Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <Bug className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Bug Reports</div>
                    <div className="text-gray-500">Within 4-8 hours</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <HelpCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Technical Support</div>
                    <div className="text-gray-500">Within 24 hours</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Feature Requests</div>
                    <div className="text-gray-500">Within 1 week</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">General Inquiries</div>
                    <div className="text-gray-500">Within 24 hours</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-700">
                    All response times are estimates during business days (Monday-Friday, 9 AM - 6 PM GMT).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}