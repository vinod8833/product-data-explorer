import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { BookOpen, Code, Database, Globe, Shield, Zap, ExternalLink, Github, Users, Star, Heart, Cpu, Cloud } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | Product Data Explorer',
  description: 'Learn about Product Data Explorer - a production-ready web application for exploring World of Books product data with live scraping, built with Next.js and NestJS.',
  keywords: ['Product Data Explorer', 'World of Books', 'Web Scraping', 'Next.js', 'NestJS', 'API Documentation'],
};

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          About Product Data Explorer
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          A production-ready web application for exploring product data from World of Books, 
          featuring live on-demand scraping, comprehensive product navigation, and a modern, 
          accessible user interface built with cutting-edge technologies.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/products"
            className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md focus-visible:ring-blue-500 active:bg-blue-800 h-10 px-4 py-2 gap-2"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Explore Products
          </Link>
          <a 
            href="http://localhost:3001/api/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] border-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500 active:bg-gray-100 h-10 px-4 py-2 gap-2"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            API Documentation
          </a>
        </div>
      </div>

      {/* Project Overview */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Project Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Real-time Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Live scraping of product data from World of Books with intelligent caching 
                and background processing for optimal performance.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Ethical & Responsible</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Respects robots.txt, implements proper rate limiting, and follows 
                best practices for web scraping with minimal server impact.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <CardTitle>Modern Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Built with Next.js 14, NestJS, TypeScript, and modern development 
                practices for scalability, maintainability, and performance.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Architecture Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <Code className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Frontend (Next.js)</CardTitle>
              <CardDescription>
                Modern React application with TypeScript, Tailwind CSS, and SWR for data fetching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  Next.js 14 with App Router
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  TypeScript for type safety
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  Tailwind CSS for styling
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  SWR for client-side data fetching
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  Responsive design & accessibility
                </li>
                <li className="flex items-center">
                  <Heart className="h-4 w-4 text-red-500 mr-2" />
                  Wishlist functionality
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Database className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Backend (NestJS)</CardTitle>
              <CardDescription>
                Robust Node.js backend with TypeScript, PostgreSQL, and Redis for caching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  NestJS with TypeScript
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  PostgreSQL database
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  Redis for caching
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  Bull Queue for background jobs
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  RESTful API with Swagger docs
                </li>
                <li className="flex items-center">
                  <Cpu className="h-4 w-4 text-blue-500 mr-2" />
                  Crawlee & Playwright for scraping
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-6 w-6 text-yellow-600 mb-2" />
              <CardTitle className="text-lg">Live Scraping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Real-time data extraction using Crawlee and Playwright with intelligent 
                caching and background processing.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Globe className="h-6 w-6 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Comprehensive Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Product details, reviews, ratings, categories, and hierarchical 
                navigation with advanced search capabilities.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-6 w-6 text-green-600 mb-2" />
              <CardTitle className="text-lg">Ethical Scraping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Respects robots.txt, implements rate limiting, uses proper delays, 
                and follows web scraping best practices.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-6 w-6 text-purple-600 mb-2" />
              <CardTitle className="text-lg">User Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Responsive design, accessibility features, wishlist functionality, 
                and intuitive navigation for all users.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Cloud className="h-6 w-6 text-indigo-600 mb-2" />
              <CardTitle className="text-lg">Production Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Deployed on modern cloud platforms with CI/CD, monitoring, 
                and scalable infrastructure.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-6 w-6 text-red-600 mb-2" />
              <CardTitle className="text-lg">API Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Complete OpenAPI/Swagger documentation with interactive testing 
                and comprehensive endpoint coverage.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Technology Stack</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Code className="mr-2 h-5 w-5 text-blue-600" />
                  Frontend Technologies
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li><strong>Next.js 14:</strong> React framework with App Router</li>
                  <li><strong>TypeScript:</strong> Type-safe JavaScript</li>
                  <li><strong>Tailwind CSS:</strong> Utility-first CSS framework</li>
                  <li><strong>SWR:</strong> Data fetching with caching</li>
                  <li><strong>Lucide React:</strong> Beautiful icons</li>
                  <li><strong>Headless UI:</strong> Accessible components</li>
                  <li><strong>Framer Motion:</strong> Smooth animations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Database className="mr-2 h-5 w-5 text-green-600" />
                  Backend Technologies
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li><strong>NestJS:</strong> Progressive Node.js framework</li>
                  <li><strong>TypeORM:</strong> Object-relational mapping</li>
                  <li><strong>PostgreSQL:</strong> Relational database</li>
                  <li><strong>Redis:</strong> In-memory data store</li>
                  <li><strong>Crawlee:</strong> Web scraping framework</li>
                  <li><strong>Playwright:</strong> Browser automation</li>
                  <li><strong>Bull Queue:</strong> Background job processing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* API Documentation */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">API Documentation</h2>
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
            <CardTitle>Interactive API Documentation</CardTitle>
            <CardDescription>
              Explore our comprehensive API documentation with interactive testing capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-gray-700">
                Our API is fully documented using OpenAPI/Swagger specification. You can explore 
                all endpoints, test requests, and view response schemas directly in your browser.
              </p>
              
              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <ExternalLink className="mr-2 h-5 w-5 text-blue-600" />
                  Available Documentation:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-gray-700">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      Complete endpoint documentation
                    </li>
                    <li className="flex items-center text-gray-700">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      Request/response schemas
                    </li>
                  </ul>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-gray-700">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      Authentication and rate limiting
                    </li>
                    <li className="flex items-center text-gray-700">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      Live API testing interface
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="http://localhost:3001/api/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md focus-visible:ring-blue-500 active:bg-blue-800 h-10 px-4 py-2 gap-2"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Swagger Documentation
                </a>
                <Link 
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] border-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500 active:bg-gray-100 h-10 px-4 py-2 gap-2"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Contact for API Access
                </Link>
              </div>
              
              <div className="text-sm text-gray-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <strong>Note:</strong> API documentation is available when the backend server is running locally on port 3001.
                In production, the API docs are available at the deployed backend URL.
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Open Source */}
      <section className="mb-16">
        <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
          <CardHeader className="text-center">
            <Github className="h-12 w-12 text-gray-800 mx-auto mb-4" />
            <CardTitle className="text-2xl">Open Source Project</CardTitle>
            <CardDescription className="text-lg">
              This project is open source and welcomes contributions from the community
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We believe in open source development and welcome contributions, bug reports, 
              feature requests, and feedback from developers around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://github.com/vinod8833/product-data-explorer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md focus-visible:ring-blue-500 active:bg-blue-800 h-10 px-4 py-2 gap-2"
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] border-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500 active:bg-gray-100 h-10 px-4 py-2 gap-2"
              >
                <Users className="mr-2 h-4 w-4" />
                Get Involved
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}