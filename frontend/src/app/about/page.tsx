import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { BookOpen, Code, Database, Globe, Shield, Zap, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | Product Data Explorer',
  description: 'Learn about Product Data Explorer - a production-ready web application for exploring World of Books product data with live scraping, built with Next.js and NestJS.',
  keywords: ['Product Data Explorer', 'World of Books', 'Web Scraping', 'Next.js', 'NestJS', 'API Documentation'],
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About Product Data Explorer
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A production-ready web application for exploring product data from World of Books, 
          featuring live on-demand scraping and comprehensive product navigation.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Architecture Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <Code className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Frontend (Next.js)</CardTitle>
              <CardDescription>
                Modern React application with TypeScript, Tailwind CSS, and SWR for data fetching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>* Next.js 14 with App Router</li>
                <li>* TypeScript for type safety</li>
                <li>* Tailwind CSS for styling</li>
                <li>* SWR for client-side data fetching</li>
                <li>* Responsive design & accessibility</li>
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
              <ul className="space-y-2 text-sm text-gray-600">
                <li>* NestJS with TypeScript</li>
                <li>* PostgreSQL database</li>
                <li>* Redis for caching</li>
                <li>* Bull Queue for background jobs</li>
                <li>* RESTful API with Swagger docs</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Zap className="h-6 w-6 text-yellow-600 mb-2" />
              <CardTitle className="text-lg">Live Scraping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Real-time data extraction using Crawlee and Playwright with intelligent caching
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="h-6 w-6 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Comprehensive Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Product details, reviews, ratings, categories, and hierarchical navigation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-6 w-6 text-green-600 mb-2" />
              <CardTitle className="text-lg">Ethical Scraping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Respects robots.txt, implements rate limiting, and uses proper delays
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Technology Stack</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Frontend Technologies</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>* <strong>Next.js 14:</strong> React framework with App Router</li>
                  <li>* <strong>TypeScript:</strong> Type-safe JavaScript</li>
                  <li>* <strong>Tailwind CSS:</strong> Utility-first CSS framework</li>
                  <li>* <strong>SWR:</strong> Data fetching with caching</li>
                  <li>* <strong>Lucide React:</strong> Beautiful icons</li>
                  <li>* <strong>Headless UI:</strong> Accessible components</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Backend Technologies</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>*<strong>NestJS:</strong> Progressive Node.js framework</li>
                  <li>* <strong>TypeORM:</strong> Object-relational mapping</li>
                  <li>* <strong>PostgreSQL:</strong> Relational database</li>
                  <li>* <strong>Redis:</strong> In-memory data store</li>
                  <li>* <strong>Crawlee:</strong> Web scraping framework</li>
                  <li>* <strong>Playwright:</strong> Browser automation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Database Schema</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Core Entities</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>* <strong>Navigation:</strong> Main category headings</li>
                  <li>* <strong>Category:</strong> Product categories & subcategories</li>
                  <li>* <strong>Product:</strong> Basic product information</li>
                  <li>* <strong>ProductDetail:</strong> Extended product data</li>
                  <li>* <strong>Review:</strong> User reviews and ratings</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">System Entities</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>* <strong>ScrapeJob:</strong> Background scraping tasks</li>
                  <li>* <strong>ViewHistory:</strong> User navigation tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">API Documentation</h2>
        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
            <CardTitle>Interactive API Documentation</CardTitle>
            <CardDescription>
              Explore our comprehensive API documentation with interactive testing capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Our API is fully documented using OpenAPI/Swagger specification. You can explore 
                all endpoints, test requests, and view response schemas directly in your browser.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Available Documentation:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <ExternalLink className="h-4 w-4 text-blue-600 mr-2" />
                    <a 
                      href="http://localhost:3001/api/docs" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Swagger --- Product Data Explorer API
                    </a>
                  </li>
                  <li className="text-gray-600">* Complete endpoint documentation</li>
                  <li className="text-gray-600">* Request/response schemas</li>
                  <li className="text-gray-600">* Authentication and rate limiting info</li>
                  <li className="text-gray-600">* Live API testing interface</li>
                </ul>
              </div>
              <div className="text-sm text-gray-500">
                <strong>Note:</strong> API documentation is available when the backend server is running locally on port 3001.
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      
      
    </div>
  );
}