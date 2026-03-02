'use client';

import { Container, Stack, Inline } from '@packages/spark-ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/about', label: 'Overview' },
    { href: '/about/who-is-gdg', label: 'Who is GDG' },
    { href: '/about/meet-the-team', label: 'Team' },
    { href: '/about/history', label: 'History' },
    { href: '/about/partnership', label: 'Partnership' },
    { href: '/about/gdg-on-top', label: 'Achievements' },
  ];
  
  return (
    <Container className="py-12">
      <Stack gap="xl">
        {/* Section navigation */}
        <Inline gap="md" wrap className="text-sm border-b border-gray-200 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </Inline>
        
        {children}
      </Stack>
    </Container>
  );
}
