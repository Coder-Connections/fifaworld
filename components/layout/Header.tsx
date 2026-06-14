'use client';

import Link from 'next/link';
import { Trophy, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import LiveIndicator from '@/components/ui/LiveIndicator';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Header() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    await queryClient.invalidateQueries();
    setTimeout(() => setRefreshing(false), 800);
  }

  return (
    <header className="flex items-center justify-between h-14 px-4 lg:px-6 border-b border-t-border bg-t-surface shrink-0 shadow-sm dark:shadow-none">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
          <Trophy className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div className="hidden sm:block">
          <span className="text-sm font-bold text-t-text leading-tight block">FIFA World Cup</span>
          <span className="text-xs text-wc-gold font-semibold leading-tight block">2026 Live</span>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <LiveIndicator />
        <ThemeToggle />
        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg text-t-muted hover:text-t-text hover:bg-t-subtle transition-colors"
          title="Refresh all data"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  );
}
