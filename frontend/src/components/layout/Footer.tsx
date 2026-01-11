import Link from 'next/link';
import { ExternalLink, Github, BookOpen, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Product Data Explorer
            </h3>
            <p className="text-gray-300 mb-4">
              Explore products from World of Books with live, on-demand scraping. 
              Discover books and read reviews all in one place with our modern, 
              accessible web application.
            </p>
            <p className="text-sm text-gray-400">
              Built with Next.js, NestJS, and powered by ethical web scraping practices.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-300 hover:text-white transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-gray-300 hover:text-white transition-colors">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Project
                </Link>
              </li>
              <li>
                <Link href="/readme" className="text-gray-300 hover:text-white transition-colors">
                  Setup Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Mail className="mr-1 h-3 w-3" />
                  Contact Us
                </Link>
              </li>
              <li>
                <a 
                  href="http://localhost:3001/api/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  API Docs
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/vinod8833/product-data-explorer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <Github className="mr-1 h-3 w-3" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Product Data Explorer. Built for educational purposes with ❤️
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href="https://github.com/vinod8833/product-data-explorer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="View source code"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="http://localhost:3001/api/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="API Documentation"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}