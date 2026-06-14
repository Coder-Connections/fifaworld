'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Radio, Calendar, LayoutGrid, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/',               label: 'Home',     icon: LayoutDashboard },
  { href: '/matches?status=LIVE', label: 'Live', icon: Radio, live: true },
  { href: '/matches',        label: 'Schedule', icon: Calendar },
  { href: '/groups',         label: 'Groups',   icon: LayoutGrid },
  { href: '/knockout',       label: 'Knockout', icon: Trophy },
];

export default function MobileNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    const base = href.split('?')[0];
    if (base === '/') return pathname === '/';
    return pathname.startsWith(base);
  }

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-t-surface border-t border-t-border z-50 pb-safe">
      <div className="flex items-stretch justify-around px-1">
        {tabs.map(({ href, label, icon: Icon, live }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-2 py-2.5 min-w-0 flex-1 transition-colors',
                active ? 'text-wc-blue' : 'text-t-muted'
              )}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                {live && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-wc-live dot-pulse ring-2 ring-t-surface" />
                )}
              </div>
              <span className={cn('text-[10px] font-medium truncate', active ? 'font-semibold' : '')}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
