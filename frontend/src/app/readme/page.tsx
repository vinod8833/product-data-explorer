import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  BookOpen, 
  Code, 
  Database, 
  ExternalLink, 
  Github, 
  Users, 
  Heart, 
  Cloud,
  Terminal,
  Play,
  Settings,
  CheckCircle,
  ArrowRight,
  Shield
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'README | Product Data Explorer',
  description: 'Complete setup guide and documentation for Product Data Explorer - a modern web application for exploring World of Books product data.',
  keywords: ['README', 'Setup Guide', 'Documentation', 'Product Data Explorer', 'Installation', 'Getting Started'],
};

export default function ReadmePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-6">
          <BookOpen className="h-16 w-16 text-blue-600 mr-4" />
          <h1 className="text-5xl font-bold text-gray-900">
            README
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Complete setup guide and documentation for Product Data Explorer. 
          Get up and running in minutes with our comprehensive installation guide.
        </p>
      </div>

      {/* Quick Start */}
      <section className="mb-16">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <div className="flex items-center">
              <Play className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <CardTitle className="text-2xl">Quick Start</CardTitle>
                <CardDescription className="text-lg">
                  Get the entire application running with a single command
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <div className="space-y-2">
                  <div># Clone the repository</div>
                  <div>git clone git@github.com:vinod8833/product-data-explorer.git</div>
                  <div>cd bookdata-hub</div>
                  <div className="text-yellow-400"># Complete setup and start development (single command)</div>
                  <div className="text-white font-bold">make setup && make dev</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Alternative one-liner:</h4>
                  <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                    make start
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Access points:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Frontend: http://localhost:3000</li>
                    <li>• Backend API: http://localhost:3001/api</li>
                    <li>• API Docs: http://localhost:3001/api/docs</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Prerequisites</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Terminal className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Node.js 18+</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                JavaScript runtime environment
              </p>
              <a 
                href="https://nodejs.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] border-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500 active:bg-gray-100 h-8 px-3 text-sm gap-1.5"
              >
                Download
              </a>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Cloud className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Docker</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Container platform for services
              </p>
              <a 
                href="https://www.docker.com/get-started" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] border-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500 active:bg-gray-100 h-8 px-3 text-sm gap-1.5"
              >
                Download
              </a>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Github className="h-12 w-12 text-gray-800 mx-auto mb-2" />
              <CardTitle className="text-lg">Git</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Version control system
              </p>
              <a 
                href="https://git-scm.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] border-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500 active:bg-gray-100 h-8 px-3 text-sm gap-1.5"
              >
                Download
              </a>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Settings className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Make</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Build automation tool
              </p>
              <p className="text-xs text-gray-500">
                Pre-installed on macOS/Linux
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What the Setup Does */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What the Setup Command Does</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Checks Dependencies</h4>
                    <p className="text-sm text-gray-600">Verifies Docker, Node.js, npm, and make are installed</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Creates Environment Files</h4>
                    <p className="text-sm text-gray-600">Copies .env.example to .env files if they don't exist</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Installs Dependencies</h4>
                    <p className="text-sm text-gray-600">Runs npm install for both backend and frontend</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Starts Docker Services</h4>
                    <p className="text-sm text-gray-600">Launches PostgreSQL and Redis containers</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Waits for Services</h4>
                    <p className="text-sm text-gray-600">Ensures databases are ready before proceeding</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Builds Backend</h4>
                    <p className="text-sm text-gray-600">Compiles the NestJS application</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Runs Migrations</h4>
                    <p className="text-sm text-gray-600">Sets up database schema</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Seeds Database & Starts Development</h4>
                    <p className="text-sm text-gray-600">Populates initial data and launches both servers</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Development Commands */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Development Commands</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <Terminal className="h-6 w-6 text-blue-600 mb-2" />
              <CardTitle>Essential Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 font-mono text-sm">
                <div className="bg-gray-100 p-2 rounded">
                  <span className="text-blue-600">make setup && make dev</span>
                  <div className="text-xs text-gray-600 mt-1">Complete setup and start</div>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <span className="text-blue-600">make start</span>
                  <div className="text-xs text-gray-600 mt-1">One-command alias</div>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <span className="text-blue-600">make stop</span>
                  <div className="text-xs text-gray-600 mt-1">Stop all services</div>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <span className="text-blue-600">make status</span>
                  <div className="text-xs text-gray-600 mt-1">Check what's running</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="h-6 w-6 text-green-600 mb-2" />
              <CardTitle>Utility Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 font-mono text-sm">
                <div className="bg-gray-100 p-2 rounded">
                  <span className="text-green-600">make health</span>
                  <div className="text-xs text-gray-600 mt-1">Check service health</div>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <span className="text-green-600">make logs</span>
                  <div className="text-xs text-gray-600 mt-1">View all logs</div>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <span className="text-green-600">make clean</span>
                  <div className="text-xs text-gray-600 mt-1">Clean everything</div>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <span className="text-green-600">make help</span>
                  <div className="text-xs text-gray-600 mt-1">Show all commands</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Project Structure */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Project Structure</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Code className="mr-2 h-5 w-5 text-blue-600" />
                  Frontend (Next.js)
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                  <div className="space-y-1 text-gray-700">
                    <div>frontend/</div>
                    <div>├── src/</div>
                    <div>│   ├── app/          # App Router pages</div>
                    <div>│   ├── components/  # React components</div>
                    <div>│   ├── lib/         # Utilities & hooks</div>
                    <div>│   └── contexts/    # React contexts</div>
                    <div>├── public/         # Static assets</div>
                    <div>└── package.json    # Dependencies</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Database className="mr-2 h-5 w-5 text-green-600" />
                  Backend (NestJS)
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                  <div className="space-y-1 text-gray-700">
                    <div>backend/</div>
                    <div>├── src/</div>
                    <div>│   ├── modules/     # Feature modules</div>
                    <div>│   ├── common/     # Shared utilities</div>
                    <div>│   ├── database/   # DB config & migrations</div>
                    <div>│   └── main.ts     # Application entry</div>
                    <div>├── dist/           # Compiled output</div>
                    <div>└── package.json    # Dependencies</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Troubleshooting */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Troubleshooting</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Shield className="h-6 w-6 text-red-600 mb-2" />
              <CardTitle>Common Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h5 className="font-semibold text-gray-900">Docker services not starting</h5>
                  <div className="bg-gray-100 p-2 rounded font-mono text-xs mt-1">
                    make stop && make clean<br />
                    make setup
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-900">Port conflicts</h5>
                  <p className="text-gray-600">Ports used: 3000 (frontend), 3001 (backend), 5432 (PostgreSQL), 6379 (Redis)</p>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-900">Permission issues</h5>
                  <div className="bg-gray-100 p-2 rounded font-mono text-xs mt-1">
                    sudo chown -R $USER:$USER .
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="h-6 w-6 text-green-600 mb-2" />
              <CardTitle>Getting Help</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h5 className="font-semibold text-gray-900">Check service status</h5>
                  <div className="bg-gray-100 p-2 rounded font-mono text-xs mt-1">
                    make status<br />
                    make health
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-900">View logs</h5>
                  <div className="bg-gray-100 p-2 rounded font-mono text-xs mt-1">
                    make logs<br />
                    make logs-db
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-900">Need more help?</h5>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] border-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500 active:bg-gray-100 h-8 px-3 text-sm gap-1.5 mt-2"
                  >
                    <Users className="mr-1 h-3 w-3" />
                    Contact Support
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Next Steps */}
      <section className="mb-16">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="text-center">
            <ArrowRight className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Next Steps</CardTitle>
            <CardDescription className="text-lg">
              After successful setup, explore these features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                href="/products"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md focus-visible:ring-blue-500 active:bg-blue-800 h-auto p-4 flex-col gap-2"
              >
                <BookOpen className="h-6 w-6 mb-2" />
                <span>Explore Products</span>
              </Link>
              
              <a 
                href="http://localhost:3001/api/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] border-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500 active:bg-gray-100 h-auto p-4 flex-col gap-2"
              >
                <ExternalLink className="h-6 w-6 mb-2" />
                <span>API Docs</span>
              </a>
              
              <Link 
                href="/about"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] border-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500 active:bg-gray-100 h-auto p-4 flex-col gap-2"
              >
                <Users className="h-6 w-6 mb-2" />
                <span>Learn More</span>
              </Link>
              
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98] border-2 border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-500 active:bg-gray-100 h-auto p-4 flex-col gap-2"
              >
                <Heart className="h-6 w-6 mb-2" />
                <span>Get Support</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}