import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Product Data Explorer',
  description: 'Get in touch with the Product Data Explorer team. Contact us for technical support, API questions, or to contribute to our open source project.',
  keywords: ['Contact', 'Support', 'Product Data Explorer', 'Technical Support', 'API Help'],
};


export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}