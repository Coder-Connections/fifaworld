'use client';

import Image from 'next/image';
import type { Match } from '@/lib/types';
import {
  cn,
  isLive,
  isFinished,
  getStatusLabel,
  getGroupLabel,
  getStageLabel,
  formatMatchTime,
  formatMatchDate,
  getWinnerClass,
} from '@/lib/utils';
import { useTimezone } from '@/providers/TimezoneProvider';
import { MapPin } from 'lucide-react';

interface Props {
  match: Match;
  compact?: boolean;
}

function TeamCrest({ crest, name, size = 32 }: { crest: string | null; name: string | null; size?: number }) {
  return (
    <div
      className="relative shrink-0 rounded overflow-hidden bg-stadium-500"
      style={{ width: size, height: size }}
    >
      {crest ? (
        <Image
          src={crest}
          alt={name ?? 'Team'}
          fill
          className="object-contain p-0.5"
          unoptimized
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-stadium-100">
          {name ? name.slice(0, 3).toUpperCase() : '?'}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ match }: { match: Match }) {
  const live = isLive(match.status);
  const finished = isFinished(match.status);
  const label = getStatusLabel(match.status);

  if (live) {
    return (
      <span className="flex items-center gap-1 text-wc-live text-xs font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-wc-live dot-pulse" />
        LIVE
      </span>
    );
  }
  if (finished) {
    return <span className="text-xs text-stadium-100 font-medium">{label}</span>;
  }
  if (label) {
    return <span className="text-xs text-wc-teal font-medium">{label}</span>;
  }
  return null;
}

export default function MatchCard({ match, compact = false }: Props) {
  const { tz, label: tzLabel } = useTimezone();
  const live = isLive(match.status);
  const finished = isFinished(match.status);
  const showScore = live || finished;
  const homeScore = match.score.fullTime.home;
  const awayScore = match.score.fullTime.away;
  const matchLabel = match.group
    ? getGroupLabel(match.group)
    : getStageLabel(match.stage);

  return (
    <div
      className={cn(
        'card-gradient rounded-xl border transition-all duration-150 hover:border-stadium-300',
        live
          ? 'border-wc-live/40 live-glow bg-gradient-live'
          : 'border-stadium-400',
        compact ? 'p-3' : 'p-4'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-stadium-100 font-medium">{matchLabel}</span>
        <StatusBadge match={match} />
      </div>

      <div className="flex items-center gap-3">
        {/* Home team */}
        <div className={cn('flex items-center gap-2 flex-1 min-w-0', compact ? '' : 'gap-2.5')}>
          <TeamCrest crest={match.homeTeam.crest} name={match.homeTeam.name} size={compact ? 28 : 36} />
          <span
            className={cn(
              'text-sm font-semibold truncate',
              showScore ? getWinnerClass('home', match.score.winner) : 'text-white'
            )}
          >
            {compact ? (match.homeTeam.tla ?? 'TBD') : (match.homeTeam.shortName ?? match.homeTeam.name ?? 'TBD')}
          </span>
        </div>

        {/* Score / Time */}
        <div className="flex flex-col items-center shrink-0 min-w-[64px]">
          {showScore ? (
            <>
              <span
                className={cn(
                  'tabular-nums text-xl font-bold tracking-tight',
                  live ? 'text-wc-live' : 'text-white'
                )}
              >
                {homeScore ?? 0} - {awayScore ?? 0}
              </span>
              {match.score.duration !== 'REGULAR' && (
                <span className="text-[10px] text-stadium-100 mt-0.5">
                  {match.score.duration === 'EXTRA_TIME' ? 'AET' : 'Pen'}
                </span>
              )}
            </>
          ) : (
            <>
              <span className="text-base font-bold text-white tabular-nums">
                {formatMatchTime(match.utcDate, tz)}
              </span>
              <span className="text-[10px] font-semibold text-wc-gold-light mt-0.5 tracking-wide">
                {tzLabel}
              </span>
              {!compact && (
                <span className="text-[10px] text-stadium-100 mt-0.5">
                  {formatMatchDate(match.utcDate, tz)}
                </span>
              )}
            </>
          )}
        </div>

        {/* Away team */}
        <div className={cn('flex items-center gap-2 flex-1 min-w-0 justify-end', compact ? '' : 'gap-2.5')}>
          <span
            className={cn(
              'text-sm font-semibold truncate text-right',
              showScore ? getWinnerClass('away', match.score.winner) : 'text-white'
            )}
          >
            {compact ? (match.awayTeam.tla ?? 'TBD') : (match.awayTeam.shortName ?? match.awayTeam.name ?? 'TBD')}
          </span>
          <TeamCrest crest={match.awayTeam.crest} name={match.awayTeam.name} size={compact ? 28 : 36} />
        </div>
      </div>

      {!compact && match.venue && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-stadium-400/50">
          <MapPin className="w-3 h-3 text-stadium-100 shrink-0" />
          <span className="text-xs text-stadium-100 truncate">{match.venue}</span>
        </div>
      )}
    </div>
  );
}
