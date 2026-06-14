'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Radio, Calendar, LayoutGrid, Trophy, Users, Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/',                    label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/matches?status=LIVE', label: 'Live',        icon: Radio,      live: true },
  { href: '/matches',             label: 'Schedule',    icon: Calendar },
  { href: '/groups',              label: 'Groups',      icon: LayoutGrid },
  { href: '/knockout',            label: 'Knockout',    icon: Trophy },
  { href: '/teams',               label: 'Teams',       icon: Users },
  { href: '/scorers',             label: 'Top Scorers', icon: Star },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('?')[0]);
  }

  return (
    <aside className="hidden md:flex flex-col w-56 lg:w-60 shrink-0 border-r border-t-border bg-t-surface">
      <div className="h-14 flex items-center px-4 border-b border-t-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-wc-gold animate-pulse" />
          <span className="text-xs font-semibold text-t-muted uppercase tracking-wider">Navigation</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, live }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    active
                      ? 'bg-wc-blue/10 text-wc-blue border border-wc-blue/20 dark:bg-wc-blue/20 dark:border-wc-blue/30'
                      : 'text-t-muted hover:text-t-text hover:bg-t-subtle'
                  )}
                >
                  <Icon
                    className={cn('shrink-0', active ? 'text-wc-blue' : 'text-t-muted')}
                    size={18}
                  />
                  {label}
                  {live && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-wc-live dot-pulse" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-4 py-4 border-t border-t-border">
        <div className="rounded-lg bg-t-subtle border border-t-border px-3 py-3">
          <p className="text-xs font-semibold text-wc-gold mb-1">USA · Canada · Mexico</p>
          <p className="text-xs text-t-muted">Jun 11 — Jul 19, 2026</p>
        </div>
      </div>
    </aside>
  );
}
