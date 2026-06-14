'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Radio,
  Calendar,
  LayoutGrid,
  Trophy,
  Users,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/matches?status=LIVE', label: 'Live', icon: Radio },
  { href: '/matches', label: 'Schedule', icon: Calendar },
  { href: '/groups', label: 'Groups', icon: LayoutGrid },
  { href: '/knockout', label: 'Knockout', icon: Trophy },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/scorers', label: 'Top Scorers', icon: Star },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    const base = href.split('?')[0];
    return pathname.startsWith(base);
  }

  return (
    <aside className="hidden md:flex flex-col w-56 lg:w-60 shrink-0 border-r border-stadium-400 bg-stadium-700">
      <div className="h-14 flex items-center px-4 border-b border-stadium-400 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-wc-gold animate-pulse" />
          <span className="text-xs font-semibold text-stadium-100 uppercase tracking-wider">
            Navigation
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    active
                      ? 'bg-wc-blue/20 text-wc-blue-light border border-wc-blue/30'
                      : 'text-stadium-100 hover:text-white hover:bg-stadium-500'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4.5 h-4.5 shrink-0',
                      active ? 'text-wc-blue-light' : 'text-stadium-100'
                    )}
                    size={18}
                  />
                  {label}
                  {label === 'Live' && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-wc-live dot-pulse" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-4 py-4 border-t border-stadium-400">
        <div className="rounded-lg bg-stadium-600 border border-stadium-400 px-3 py-3">
          <p className="text-xs font-semibold text-wc-gold-light mb-1">USA · Canada · Mexico</p>
          <p className="text-xs text-stadium-100">Jun 11 — Jul 19, 2026</p>
        </div>
      </div>
    </aside>
  );
}
