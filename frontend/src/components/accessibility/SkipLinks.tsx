import Link from 'next/link';

const skipLinks = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
  { href: '#search', label: 'Skip to search' },
  { href: '#footer', label: 'Skip to footer' }
];

export default function SkipLinks() {
  return (
    <nav aria-label="Skip links" className="sr-only">
      {skipLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="skip-link absolute -top-24 left-2 z-50 bg-gray-900 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 focus:top-2 focus:not-sr-only"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}