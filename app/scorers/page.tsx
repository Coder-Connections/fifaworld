'use client';

import { useQuery } from '@tanstack/react-query';
import type { ScorersResponse } from '@/lib/types';
import TopScorers from '@/components/scorers/TopScorers';
import { LoadingSection } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';

export default function ScorersPage() {
  const { data, isLoading, error } = useQuery<ScorersResponse>({
    queryKey: ['scorers', 'full'],
    queryFn: () => fetch('/api/scorers?limit=50').then((r) => r.json()),
    refetchInterval: 300_000,
  });

  const apiError = error || (data as any)?.error;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white">Top Scorers</h1>
        <p className="text-sm text-stadium-100 mt-0.5">
          FIFA World Cup 2026 — Golden Boot race
        </p>
      </div>

      {isLoading && <LoadingSection label="Loading scorers…" />}
      {!isLoading && apiError && <ErrorState message={typeof apiError === 'string' ? apiError : (error as Error)?.message} />}

      {!isLoading && !apiError && (
        <TopScorers scorers={data?.scorers ?? []} limit={50} />
      )}
    </div>
  );
}
