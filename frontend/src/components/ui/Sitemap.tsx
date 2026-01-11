import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Home, 
  BookOpen, 
  Search, 
  Heart, 
  Users, 
  Mail, 
  FileText, 
  Grid3X3, 
  ExternalLink,
  Github
} from 'lucide-react';

const pages = [
  {
    title: 'Home',
    href: '/',
    description: 'Main landing page with featured products and search',
    icon: Home,
    category: 'Main'
  },
  {
    title: 'Products',
    href: '/products',
    description: 'Browse all available products with filtering',
    icon: BookOpen,
    category: 'Main'
  },
  {
    title: 'Categories',
    href: '/categories',
    description: 'Explore products by category and subcategory',
    icon: Grid3X3,
    category: 'Main'
  },
  {
    title: 'Search',
    href: '/search',
    description: 'Advanced search with filters and sorting',
    icon: Search,
    category: 'Main'
  },
  {
    title: 'Wishlist',
    href: '/wishlist',
    description: 'Your saved products and favorites',
    icon: Heart,
    category: 'Main'
  },
  {
    title: 'About',
    href: '/about',
    description: 'Learn about the project, architecture, and technologies',
    icon: Users,
    category: 'Information'
  },
  {
    title: 'README',
    href: '/readme',
    description: 'Complete setup guide and documentation',
    icon: FileText,
    category: 'Information'
  },
  {
    title: 'Contact',
    href: '/contact',
    description: 'Get in touch for support or contributions',
    icon: Mail,
    category: 'Information'
  }
];

const externalLinks = [
  {
    title: 'API Documentation',
    href: 'http://localhost:3001/api/docs',
    description: 'Interactive Swagger API documentation',
    icon: ExternalLink
  },
  {
    title: 'GitHub Repository',
    href: 'https://github.com/vinod8833/product-data-explorer',
    description: 'View source code and contribute',
    icon: Github
  }
];

export default function Sitemap() {
  const mainPages = pages.filter(page => page.category === 'Main');
  const infoPages = pages.filter(page => page.category === 'Information');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Site Navigation</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore all available pages and features of Product Data Explorer
        </p>
      </div>

      {/* Main Pages */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Main Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mainPages.map((page) => {
            const Icon = page.icon;
            return (
              <Card key={page.href} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <Icon className="mr-2 h-5 w-5 text-blue-600" />
                    {page.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">
                    {page.description}
                  </CardDescription>
                  <Link
                    href={page.href}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Visit Page →
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Information Pages */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Information & Support</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {infoPages.map((page) => {
            const Icon = page.icon;
            return (
              <Card key={page.href} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <Icon className="mr-2 h-5 w-5 text-green-600" />
                    {page.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">
                    {page.description}
                  </CardDescription>
                  <Link
                    href={page.href}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Visit Page →
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* External Links */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">External Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {externalLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Card key={link.href} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <Icon className="mr-2 h-5 w-5 text-purple-600" />
                    {link.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">
                    {link.description}
                  </CardDescription>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center"
                  >
                    Open External Link
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}