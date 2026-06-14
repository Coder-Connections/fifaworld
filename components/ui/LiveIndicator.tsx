'use client';

import { useQuery } from '@tanstack/react-query';
import type { MatchesResponse } from '@/lib/types';
import { isLive } from '@/lib/utils';

export default function LiveIndicator() {
  const { data } = useQuery<MatchesResponse>({
    queryKey: ['matches', 'live'],
    queryFn: () => fetch('/api/matches?status=IN_PLAY,PAUSED').then((r) => r.json()),
    refetchInterval: 30_000,
  });

  const liveCount = data?.matches?.filter((m) => isLive(m.status)).length ?? 0;
  if (!liveCount) return null;

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-wc-live/10 border border-wc-live/30 text-wc-live text-xs font-semibold">
      <span className="w-2 h-2 rounded-full bg-wc-live dot-pulse shrink-0" />
      {liveCount} LIVE
    </div>
  );
}
