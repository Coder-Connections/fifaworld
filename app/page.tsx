'use client';

import { useQuery } from '@tanstack/react-query';
import type { MatchesResponse, StandingsResponse, ScorersResponse } from '@/lib/types';
import { isLive, isFinished, isScheduled, groupMatchesByDate, formatMatchDate } from '@/lib/utils';
import LiveMatchCard from '@/components/matches/LiveMatchCard';
import MatchCard from '@/components/matches/MatchCard';
import GroupTable from '@/components/groups/GroupTable';
import TopScorers from '@/components/scorers/TopScorers';
import { LoadingSection } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { Trophy, Calendar, Radio, ChevronRight } from 'lucide-react';
import Link from 'next/link';

function SectionHeader({ title, href, icon: Icon }: { title: string; href?: string; icon: React.FC<{ className?: string }> }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-wc-gold" />
        <h2 className="text-base font-bold text-t-text">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-xs text-t-muted hover:text-wc-blue transition-colors">
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { data: matchData, isLoading: matchLoading, error: matchError } = useQuery<MatchesResponse>({
    queryKey: ['matches', 'all'],
    queryFn: () => fetch('/api/matches').then((r) => r.json()),
    refetchInterval: 30_000,
  });

  const { data: standingsData, isLoading: standingsLoading } = useQuery<StandingsResponse>({
    queryKey: ['standings'],
    queryFn: () => fetch('/api/standings').then((r) => r.json()),
    refetchInterval: 300_000,
  });

  const { data: scorersData, isLoading: scorersLoading } = useQuery<ScorersResponse>({
    queryKey: ['scorers'],
    queryFn: () => fetch('/api/scorers?limit=10').then((r) => r.json()),
    refetchInterval: 300_000,
  });

  const allMatches = matchData?.matches ?? [];
  const liveMatches = allMatches.filter((m) => isLive(m.status));
  const upcomingMatches = allMatches.filter((m) => isScheduled(m.status)).slice(0, 8);
  const recentResults = allMatches.filter((m) => isFinished(m.status)).slice(-6).reverse();

  const groupedUpcoming = groupMatchesByDate(upcomingMatches);
  const groupStandings = standingsData?.standings?.filter((s) => s.group !== null).slice(0, 4) ?? [];

  const apiError = matchError || (matchData as any)?.error;

  if (matchLoading) {
    return <LoadingSection label="Loading tournament data…" />;
  }

  if (apiError) {
    return <ErrorState message={typeof apiError === 'string' ? apiError : (matchError as Error)?.message} />;
  }

  const totalMatches = allMatches.length;
  const playedMatches = allMatches.filter((m) => isFinished(m.status)).length;
  const totalGoals = allMatches
    .filter((m) => isFinished(m.status))
    .reduce((sum, m) => sum + (m.score.fullTime.home ?? 0) + (m.score.fullTime.away ?? 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Hero stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Matches', value: totalMatches, color: 'text-wc-blue-light' },
          { label: 'Played', value: playedMatches, color: 'text-wc-green' },
          { label: 'Goals Scored', value: totalGoals, color: 'text-wc-gold-light' },
          { label: 'Live Now', value: liveMatches.length, color: 'text-wc-live' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card-gradient rounded-xl border border-t-border px-4 py-4 text-center">
            <p className={`text-2xl font-black tabular-nums ${color}`}>{value}</p>
            <p className="text-xs text-t-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <section>
          <SectionHeader title="Live Now" href="/matches?status=LIVE" icon={Radio} />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {liveMatches.map((match) => (
              <LiveMatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Results */}
      {recentResults.length > 0 && (
        <section>
          <SectionHeader title="Recent Results" href="/matches?status=FINISHED" icon={Trophy} />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {recentResults.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcomingMatches.length > 0 && (
        <section>
          <SectionHeader title="Upcoming Matches" href="/matches?status=SCHEDULED" icon={Calendar} />
          <div className="space-y-4">
            {Array.from(groupedUpcoming.entries()).map(([dateKey, dayMatches]) => (
              <div key={dateKey}>
                <p className="text-xs font-semibold text-t-muted uppercase tracking-wider mb-2">
                  {formatMatchDate(dayMatches[0].utcDate)}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {dayMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Standings + Scorers */}
      {(groupStandings.length > 0 || (scorersData?.scorers?.length ?? 0) > 0) && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {groupStandings.length > 0 && (
            <div className="xl:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-bold text-t-text">Group Standings</h2>
                <Link href="/groups" className="flex items-center gap-1 text-xs text-t-muted hover:text-wc-blue transition-colors">
                  All groups <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupStandings.map((g, i) => (
                  <GroupTable key={i} group={g} compact />
                ))}
              </div>
            </div>
          )}

          {(scorersData?.scorers?.length ?? 0) > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-t-text">Top Scorers</h2>
                <Link href="/scorers" className="flex items-center gap-1 text-xs text-t-muted hover:text-wc-blue transition-colors">
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              {scorersLoading ? (
                <LoadingSection label="Loading scorers…" />
              ) : (
                <TopScorers scorers={scorersData?.scorers ?? []} limit={8} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
