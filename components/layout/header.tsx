'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MobileNav } from './mobile-nav';
import { ModeToggle } from './mode-toggle';
import { useAuth } from '@/context/auth-context';
import { useTheme } from 'next-themes';

const mainNav = [
    { href: '/about', title: 'About' },
    { href: '/pricing', title: 'Pricing' },
    { href: '/contact', title: 'Contact' },
];

export function Header() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-6">
                <MobileNav />
                <Link href="/" className="hidden items-center space-x-2 md:flex">
                    <Image 
                        src={theme === 'dark' ? '/logo-l.png' : '/logo.png'} 
                        width="200" 
                        height="200" 
                        alt='logo' 
                    />
                </Link>
            </div>

            <nav className="hidden gap-6 md:flex">
                {mainNav.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground/80 sm:text-sm"
                    >
                        {item.title}
                    </Link>
                ))}
            </nav>

            <div className="flex items-center gap-4">
                {!loading && (
                  user ? (
                      <Button asChild>
                          <Link href="/dashboard">Dashboard</Link>
                      </Button>
                  ) : (
                      <>
                          <Button variant="ghost" asChild>
                              <Link href="/login">Sign In</Link>
                          </Button>
                          <Button asChild>
                              <Link href="/signup">Sign Up</Link>
                          </Button>
                      </>
                  )
                )}
                <ModeToggle isCollapsed={false} />
            </div>
        </div>
    </header>
  )
}
