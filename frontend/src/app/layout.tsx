import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SkipLinks from '@/components/accessibility/SkipLinks';
import { ToastProvider } from '@/components/ui/Toast';
import { WishlistProvider } from '@/contexts/WishlistContext';
import './globals.css';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: "Product Data Explorer",
    template: "%s | Product Data Explorer"
  },
  description: "Discover and explore products with our comprehensive data platform. Search, filter, and find exactly what you're looking for.",
  keywords: ["products", "search", "books", "e-commerce", "data explorer"],
  authors: [{ name: "Product Data Explorer Team" }],
  creator: "Product Data Explorer",
  publisher: "Product Data Explorer",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://productexplorer.com',
    siteName: 'Product Data Explorer',
    title: 'Product Data Explorer',
    description: 'Discover and explore products with our comprehensive data platform.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Product Data Explorer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Product Data Explorer',
    description: 'Discover and explore products with our comprehensive data platform.',
    images: ['/og-image.jpg'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-gray-50 flex flex-col antialiased`} suppressHydrationWarning={true}>
        <ToastProvider>
          <WishlistProvider>
            <SkipLinks />
            <Header />
            <main 
              id="main-content" 
              className="flex-1"
              role="main"
              aria-label="Main content"
            >
              {children}
            </main>
            <Footer />
          </WishlistProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
