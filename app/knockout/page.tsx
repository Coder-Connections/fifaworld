'use client';

import { useQuery } from '@tanstack/react-query';
import type { MatchesResponse } from '@/lib/types';
import KnockoutBracket from '@/components/knockout/KnockoutBracket';
import { LoadingSection } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';

export default function KnockoutPage() {
  const { data, isLoading, error } = useQuery<MatchesResponse>({
    queryKey: ['matches', 'all'],
    queryFn: () => fetch('/api/matches').then((r) => r.json()),
    refetchInterval: 30_000,
  });

  const knockoutMatches = (data?.matches ?? []).filter((m) => m.stage !== 'GROUP_STAGE');
  const apiError = error || (data as any)?.error;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white">Knockout Stage</h1>
        <p className="text-sm text-stadium-100 mt-0.5">
          Round of 32 → Round of 16 → Quarter-finals → Semi-finals → Final
        </p>
      </div>

      {isLoading && <LoadingSection label="Loading knockout bracket…" />}
      {!isLoading && apiError && <ErrorState message={typeof apiError === 'string' ? apiError : (error as Error)?.message} />}

      {!isLoading && !apiError && (
        <div className="card-gradient rounded-xl border border-stadium-400 p-6">
          <KnockoutBracket matches={knockoutMatches} />
        </div>
      )}
    </div>
  );
}
