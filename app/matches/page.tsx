'use client';

import { useState, useMemo, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import type { MatchesResponse } from '@/lib/types';
import { isLive, isFinished, isScheduled, groupMatchesByDate, formatMatchDate } from '@/lib/utils';
import MatchCard from '@/components/matches/MatchCard';
import LiveMatchCard from '@/components/matches/LiveMatchCard';
import MatchFilters, { type FilterStatus, type FilterStage } from '@/components/matches/MatchFilters';
import { LoadingSection } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';

function MatchesContent() {
  const params = useSearchParams();
  const initialStatus = (params.get('status') as FilterStatus) ?? 'ALL';

  const [statusFilter, setStatusFilter] = useState<FilterStatus>(
    initialStatus === 'LIVE' ? 'LIVE' : initialStatus === 'FINISHED' ? 'FINISHED' : initialStatus === 'SCHEDULED' ? 'SCHEDULED' : 'ALL'
  );
  const [stageFilter, setStageFilter] = useState<FilterStage>('ALL');

  const { data, isLoading, error } = useQuery<MatchesResponse>({
    queryKey: ['matches', 'all'],
    queryFn: () => fetch('/api/matches').then((r) => r.json()),
    refetchInterval: statusFilter === 'LIVE' ? 15_000 : 60_000,
  });

  const allMatches = data?.matches ?? [];

  const filtered = useMemo(() => {
    return allMatches.filter((m) => {
      const statusOk =
        statusFilter === 'ALL' ||
        (statusFilter === 'LIVE' && isLive(m.status)) ||
        (statusFilter === 'FINISHED' && isFinished(m.status)) ||
        (statusFilter === 'SCHEDULED' && isScheduled(m.status));

      const stageOk = stageFilter === 'ALL' || m.stage === stageFilter;

      return statusOk && stageOk;
    });
  }, [allMatches, statusFilter, stageFilter]);

  const liveMatches = filtered.filter((m) => isLive(m.status));
  const nonLiveMatches = filtered.filter((m) => !isLive(m.status));
  const grouped = groupMatchesByDate(nonLiveMatches);

  const apiError = error || (data as any)?.error;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Matches</h1>
          <p className="text-sm text-stadium-100 mt-0.5">
            {filtered.length} match{filtered.length !== 1 ? 'es' : ''}
          </p>
        </div>
        <MatchFilters
          status={statusFilter}
          stage={stageFilter}
          onStatusChange={setStatusFilter}
          onStageChange={setStageFilter}
        />
      </div>

      {isLoading && <LoadingSection label="Loading matches…" />}
      {!isLoading && apiError && <ErrorState message={typeof apiError === 'string' ? apiError : (error as Error)?.message} />}

      {!isLoading && !apiError && (
        <>
          {/* Live */}
          {liveMatches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-wc-live dot-pulse" />
                <span className="text-xs font-semibold text-wc-live uppercase tracking-wider">
                  Live — {liveMatches.length} match{liveMatches.length !== 1 ? 'es' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveMatches.map((m) => (
                  <LiveMatchCard key={m.id} match={m} />
                ))}
              </div>
            </div>
          )}

          {/* Grouped by date */}
          {Array.from(grouped.entries()).map(([dateKey, dayMatches]) => (
            <div key={dateKey} className="space-y-3">
              <p className="text-xs font-semibold text-stadium-100 uppercase tracking-wider">
                {formatMatchDate(dayMatches[0].utcDate)} — {dayMatches.length} match{dayMatches.length !== 1 ? 'es' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dayMatches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-stadium-100 text-sm">
              No matches found for the selected filters.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={<LoadingSection label="Loading matches…" />}>
      <MatchesContent />
    </Suspense>
  );
}
