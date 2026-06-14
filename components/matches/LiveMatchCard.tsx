import Image from 'next/image';
import type { Match } from '@/lib/types';
import { getGroupLabel, getStageLabel, getWinnerClass } from '@/lib/utils';
import { MapPin, Clock } from 'lucide-react';

interface Props {
  match: Match;
}

function TeamBlock({
  team,
  score,
  side,
  winner,
}: {
  team: Match['homeTeam'];
  score: number | null;
  side: 'home' | 'away';
  winner: Match['score']['winner'];
}) {
  return (
    <div className={`flex flex-col items-center gap-2 flex-1 ${side === 'away' ? 'items-end' : ''}`}>
      <div className="relative w-14 h-14 rounded-xl bg-stadium-500/60 border border-stadium-400/40 overflow-hidden shadow-lg">
        {team.crest ? (
          <Image
            src={team.crest}
            alt={`${team.name} crest`}
            fill
            className="object-contain p-1.5"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white">
            {team.tla}
          </div>
        )}
      </div>
      <div className={`text-center ${side === 'away' ? 'text-right' : 'text-left'}`}>
        <p className={`text-sm font-bold ${getWinnerClass(side, winner) || 'text-white'}`}>
          {team.shortName}
        </p>
        <p className="text-xs text-stadium-100">{team.tla}</p>
      </div>
      {score !== null && (
        <span
          className={`text-4xl font-black tabular-nums ${
            getWinnerClass(side, winner) || 'text-white'
          }`}
        >
          {score}
        </span>
      )}
    </div>
  );
}

export default function LiveMatchCard({ match }: Props) {
  const matchLabel = match.group
    ? getGroupLabel(match.group)
    : getStageLabel(match.stage);
  const homeScore = match.score.fullTime.home;
  const awayScore = match.score.fullTime.away;
  const isHalfTime = match.status === 'PAUSED';

  return (
    <div className="relative rounded-2xl border border-wc-live/50 bg-gradient-live overflow-hidden live-glow animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-xs font-medium text-stadium-100">{matchLabel}</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-wc-live dot-pulse" />
          <span className="text-sm font-bold text-wc-live">
            {isHalfTime ? 'HALF TIME' : 'LIVE'}
          </span>
        </div>
      </div>

      {/* Match content */}
      <div className="relative flex items-end justify-between gap-2 px-4 pb-4">
        <TeamBlock
          team={match.homeTeam}
          score={homeScore}
          side="home"
          winner={match.score.winner}
        />

        <div className="flex flex-col items-center shrink-0 pb-6">
          <span className="text-stadium-100 text-xs mb-2">VS</span>
          {match.score.duration !== 'REGULAR' && (
            <span className="text-[10px] text-wc-gold font-semibold">
              {match.score.duration === 'EXTRA_TIME' ? 'AET' : 'PEN'}
            </span>
          )}
        </div>

        <TeamBlock
          team={match.awayTeam}
          score={awayScore}
          side="away"
          winner={match.score.winner}
        />
      </div>

      {/* Footer */}
      {match.venue && (
        <div className="relative flex items-center gap-1.5 px-4 py-2.5 border-t border-white/5">
          <MapPin className="w-3 h-3 text-stadium-100" />
          <span className="text-xs text-stadium-100 truncate">{match.venue}</span>
        </div>
      )}
    </div>
  );
}
