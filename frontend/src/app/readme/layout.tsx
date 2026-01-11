import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'README | Product Data Explorer',
  description: 'Complete setup guide and documentation for Product Data Explorer. Get up and running in minutes with our comprehensive installation guide.',
  keywords: ['README', 'Setup Guide', 'Documentation', 'Installation', 'Getting Started', 'Product Data Explorer'],
};

export default function ReadmeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}