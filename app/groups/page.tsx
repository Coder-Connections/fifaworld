'use client';

import { useQuery } from '@tanstack/react-query';
import type { StandingsResponse } from '@/lib/types';
import GroupTable from '@/components/groups/GroupTable';
import { LoadingSection } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';

export default function GroupsPage() {
  const { data, isLoading, error } = useQuery<StandingsResponse>({
    queryKey: ['standings'],
    queryFn: () => fetch('/api/standings').then((r) => r.json()),
    refetchInterval: 300_000,
  });

  const groups = data?.standings?.filter((s) => s.group !== null && s.type === 'TOTAL') ?? [];
  const apiError = error || (data as any)?.error;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white">Group Standings</h1>
        <p className="text-sm text-stadium-100 mt-0.5">
          FIFA World Cup 2026 — {groups.length} groups · 48 teams
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-stadium-100">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-wc-green rounded" />
          Advance to Round of 32
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-wc-gold rounded" />
          Best 3rd-place playoff
        </div>
      </div>

      {isLoading && <LoadingSection label="Loading group standings…" />}
      {!isLoading && apiError && <ErrorState message={typeof apiError === 'string' ? apiError : (error as Error)?.message} />}

      {!isLoading && !apiError && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {groups.map((group, idx) => (
            <GroupTable key={idx} group={group} />
          ))}
          {groups.length === 0 && (
            <div className="col-span-full text-center py-16 text-stadium-100 text-sm">
              Standings not yet available.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
