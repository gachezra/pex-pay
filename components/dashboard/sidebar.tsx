'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Key, Settings, TestTube, LogOut, ChevronLeft, ChevronRight, User, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/context/auth-context';
import { useState } from 'react';
import { ModeToggle } from '@/components/layout/mode-toggle';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Transactions', href: '/dashboard/transactions', icon: ArrowRightLeft },
  { name: 'Accounts', href: '/dashboard/accounts', icon: User },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
  { name: 'Testing', href: '/dashboard/testing', icon: TestTube },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardSidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: (value: boolean) => void }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { theme } = useTheme();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen bg-card border-r transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b h-16">
            <Link href="/dashboard" className={cn('flex items-center', isCollapsed ? 'justify-center' : 'space-x-2')}>
              {isCollapsed ? (
                <Image src="/favicon.png" alt="PexPay Logo" width={32} height={32} />
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image 
                      src={theme === 'dark' ? '/logo-l.png' : '/logo.png'} 
                      width="280" 
                      height="280" 
                      alt='logo' 
                  />
                </motion.div>
              )}
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all',
                        isActive
                          ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                          : 'hover:bg-muted',
                        isCollapsed ? 'justify-center' : ''
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span className="font-medium">{item.name}</span>}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>{item.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>
          <div className="p-4 border-t space-y-2">
            <ModeToggle isCollapsed={isCollapsed} />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => logout()}
                  className={cn(
                    'w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hover:bg-destructive/80 hover:text-destructive-foreground',
                    isCollapsed ? 'justify-center' : ''
                  )}
                >
                  <LogOut className="h-5 w-5" />
                  {!isCollapsed && <span className="font-medium">Logout</span>}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>Logout</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
