'use client';

export const runtime = 'edge';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, User, Calendar } from 'lucide-react';
import type { MatchDetail, H2HResponse, Team } from '@/lib/types';
import {
  isLive, isFinished,
  formatMatchTime, formatMatchDate, getTimeOfDay,
  getGroupLabel, getStageLabel,
} from '@/lib/utils';
import { useTimezone } from '@/providers/TimezoneProvider';
import { LoadingSection } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';

const POSITION_SECTIONS = [
  { key: 'Goalkeeper', label: 'GK' },
  { key: 'Defence',    label: 'DEF' },
  { key: 'Midfield',  label: 'MID' },
  { key: 'Offence',   label: 'FWD' },
] as const;

function InfoRow({
  icon: Icon, label, children,
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-t-subtle border border-t-border flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-t-muted" />
      </div>
      <div>
        <p className="text-[11px] text-t-muted uppercase tracking-wider font-semibold mb-0.5">{label}</p>
        <div className="text-sm font-medium text-t-text">{children}</div>
      </div>
    </div>
  );
}

function SquadColumn({
  team,
  teamRef,
}: {
  team: Team | undefined;
  teamRef: { id: number; name: string; shortName?: string | null; tla?: string; crest?: string | null };
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {teamRef.crest && (
          <div className="relative w-7 h-7 shrink-0">
            <Image src={teamRef.crest} alt={teamRef.name ?? ''} fill className="object-contain" unoptimized />
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-t-text">{teamRef.shortName ?? teamRef.name}</p>
          {team?.coach ? (
            <p className="text-xs text-t-muted">Coach: {team.coach.name}</p>
          ) : !team ? (
            <p className="text-xs text-t-muted">Loading…</p>
          ) : null}
        </div>
      </div>

      {team?.squad && team.squad.length > 0 && (
        <div className="space-y-4">
          {POSITION_SECTIONS.map(({ key, label }) => {
            const players = team.squad!
              .filter((p) => p.section === key)
              .sort((a, b) => (a.shirtNumber ?? 99) - (b.shirtNumber ?? 99));
            if (!players.length) return null;
            return (
              <div key={key}>
                <p className="text-[10px] font-bold text-t-muted uppercase tracking-widest mb-2">{label}</p>
                <div className="space-y-1">
                  {players.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2 py-0.5 px-1 rounded hover:bg-t-subtle/60 transition-colors"
                    >
                      <span className="w-5 text-right text-[11px] text-t-muted tabular-nums font-mono shrink-0">
                        {p.shirtNumber ?? '·'}
                      </span>
                      <span className="text-xs text-t-text flex-1 truncate">{p.name}</span>
                      {p.nationality && (
                        <span className="text-[10px] text-t-muted/60 shrink-0 truncate max-w-[64px]">
                          {p.nationality}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tz, label: tzLabel } = useTimezone();

  const { data: match, isLoading, error } = useQuery<MatchDetail>({
    queryKey: ['match', id],
    queryFn: () => fetch(`/api/matches/${id}`).then((r) => r.json()),
    refetchInterval: (query) => {
      const data = query.state.data as MatchDetail | undefined;
      return data && isLive(data.status) ? 30_000 : false;
    },
  });

  const homeTeamId = match?.homeTeam?.id;
  const awayTeamId = match?.awayTeam?.id;

  const { data: h2h } = useQuery<H2HResponse>({
    queryKey: ['h2h', id],
    queryFn: () => fetch(`/api/matches/${id}/head2head`).then((r) => r.json()),
    enabled: !!homeTeamId && !!awayTeamId,
    staleTime: 3_600_000,
  });

  const { data: homeTeam } = useQuery<Team>({
    queryKey: ['team', homeTeamId],
    queryFn: () => fetch(`/api/teams/${homeTeamId}`).then((r) => r.json()),
    enabled: !!homeTeamId,
    staleTime: 3_600_000,
  });

  const { data: awayTeam } = useQuery<Team>({
    queryKey: ['team', awayTeamId],
    queryFn: () => fetch(`/api/teams/${awayTeamId}`).then((r) => r.json()),
    enabled: !!awayTeamId,
    staleTime: 3_600_000,
  });

  if (isLoading) return <LoadingSection label="Loading match details…" />;
  const matchAny = match as unknown as { error?: string } | undefined;
  if (error || matchAny?.error) {
    return <ErrorState message={matchAny?.error ?? 'Failed to load match details'} />;
  }
  if (!match) return null;

  const live = isLive(match.status);
  const finished = isFinished(match.status);
  const showScore = live || finished;
  const matchLabel = match.group ? getGroupLabel(match.group) : getStageLabel(match.stage);
  const referee = match.referees?.[0];
  const homeScore = match.score.fullTime.home;
  const awayScore = match.score.fullTime.away;
  const htHome = match.score.halfTime?.home;
  const htAway = match.score.halfTime?.away;

  const h2hAny = h2h as unknown as { error?: string } | undefined;
  const hasH2H = h2h && !h2hAny?.error && h2h.aggregates?.numberOfMatches > 0;
  const hasSquads = homeTeamId && awayTeamId;

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fade-in pb-6">
      {/* Back */}
      <Link
        href="/matches"
        className="inline-flex items-center gap-1.5 text-sm text-t-muted hover:text-t-text transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Matches
      </Link>

      {/* ── Hero card ────────────────────────────────── */}
      <div
        className={`card-gradient rounded-2xl border overflow-hidden ${
          live ? 'border-wc-live/50 live-glow bg-gradient-live' : 'border-t-border'
        }`}
      >
        {/* Competition header */}
        <div className="flex items-center justify-center gap-2 px-4 py-3 border-b border-t-border">
          {match.competition?.emblem && (
            <div className="relative w-5 h-5 shrink-0">
              <Image src={match.competition.emblem} alt="" fill className="object-contain" unoptimized />
            </div>
          )}
          <span className="text-xs font-semibold text-t-muted text-center">
            {match.competition?.name ?? 'FIFA World Cup'} · {matchLabel}
            {match.matchday ? ` · Matchday ${match.matchday}` : ''}
          </span>
          {live && (
            <span className="flex items-center gap-1 text-xs font-bold text-wc-live ml-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-wc-live dot-pulse" />
              LIVE
            </span>
          )}
        </div>

        {/* Teams + Score/Time */}
        <div className="flex items-center gap-2 px-4 py-6">
          {/* Home */}
          <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-t-subtle border border-t-border overflow-hidden shadow">
              {match.homeTeam.crest ? (
                <Image src={match.homeTeam.crest} alt={match.homeTeam.name ?? ''} fill className="object-contain p-2" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-black text-t-muted">
                  {match.homeTeam.tla ?? '?'}
                </div>
              )}
            </div>
            <p className="text-sm font-bold text-t-text text-center leading-tight px-1 w-full truncate">
              {match.homeTeam.shortName ?? match.homeTeam.name ?? 'TBD'}
            </p>
            <p className="text-xs text-t-muted">{match.homeTeam.tla ?? ''}</p>
          </div>

          {/* Center — score or time */}
          <div className="flex flex-col items-center shrink-0 min-w-[90px] sm:min-w-[120px] gap-1">
            {showScore ? (
              <>
                <p className={`text-4xl sm:text-5xl font-black tabular-nums tracking-tight ${live ? 'text-wc-live' : 'text-t-text'}`}>
                  {homeScore ?? 0} – {awayScore ?? 0}
                </p>
                <p className="text-xs font-medium text-t-muted">
                  {live ? 'In Progress' : 'Full Time'}
                </p>
                {match.score.duration !== 'REGULAR' && (
                  <p className="text-xs text-wc-gold font-semibold">
                    {match.score.duration === 'EXTRA_TIME' ? 'After Extra Time' : 'After Penalties'}
                  </p>
                )}
                {htHome !== null && htHome !== undefined && (
                  <p className="text-[11px] text-t-muted">HT: {htHome} – {htAway}</p>
                )}
                {match.score.penalties?.home !== null && match.score.penalties?.home !== undefined && (
                  <p className="text-[11px] text-wc-gold">
                    ({match.score.penalties.home} – {match.score.penalties.away} pens)
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-2xl sm:text-3xl font-black text-t-text tabular-nums">
                  {formatMatchTime(match.utcDate, tz)}
                </p>
                <p className="text-xs font-semibold text-wc-gold">{tzLabel}</p>
                <p className="text-xs text-t-muted">{getTimeOfDay(match.utcDate, tz)}</p>
                <p className="text-xs text-t-muted">{formatMatchDate(match.utcDate, tz)}</p>
              </>
            )}
          </div>

          {/* Away */}
          <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-t-subtle border border-t-border overflow-hidden shadow">
              {match.awayTeam.crest ? (
                <Image src={match.awayTeam.crest} alt={match.awayTeam.name ?? ''} fill className="object-contain p-2" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-black text-t-muted">
                  {match.awayTeam.tla ?? '?'}
                </div>
              )}
            </div>
            <p className="text-sm font-bold text-t-text text-center leading-tight px-1 w-full truncate">
              {match.awayTeam.shortName ?? match.awayTeam.name ?? 'TBD'}
            </p>
            <p className="text-xs text-t-muted">{match.awayTeam.tla ?? ''}</p>
          </div>
        </div>
      </div>

      {/* ── Match info ────────────────────────────────── */}
      <div className="card-gradient rounded-xl border border-t-border p-4 space-y-4">
        <h3 className="text-xs font-semibold text-t-muted uppercase tracking-wider">Match Info</h3>
        {match.venue && (
          <InfoRow icon={MapPin} label="Venue">{match.venue}</InfoRow>
        )}
        <InfoRow icon={Clock} label="Kick-off">
          {formatMatchDate(match.utcDate, tz)},{' '}
          {formatMatchTime(match.utcDate, tz)}{' '}
          <span className="text-wc-gold font-semibold">{tzLabel}</span>
          <span className="text-t-muted"> · {getTimeOfDay(match.utcDate, tz)}</span>
        </InfoRow>
        {referee && (
          <InfoRow icon={User} label="Referee">
            {referee.name}
            {referee.nationality && (
              <span className="text-t-muted"> ({referee.nationality})</span>
            )}
          </InfoRow>
        )}
        {match.matchday && (
          <InfoRow icon={Calendar} label="Round">Matchday {match.matchday}</InfoRow>
        )}
      </div>

      {/* ── Head to Head ──────────────────────────────── */}
      {hasH2H && (
        <div className="card-gradient rounded-xl border border-t-border p-4">
          <h3 className="text-xs font-semibold text-t-muted uppercase tracking-wider mb-5">Head to Head</h3>

          {/* Aggregate */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 flex flex-col items-center gap-0.5">
              <p className="text-xs text-t-muted">{match.homeTeam.tla}</p>
              <p className="text-3xl font-black text-wc-green">{h2h.aggregates.homeTeam.wins}</p>
              <p className="text-xs text-t-muted">Wins</p>
            </div>
            <div className="flex flex-col items-center gap-0.5 px-2">
              <p className="text-2xl font-black text-t-muted">{h2h.aggregates.homeTeam.draws}</p>
              <p className="text-xs text-t-muted">Draws</p>
              <p className="text-[10px] text-t-muted/50 mt-0.5">{h2h.aggregates.numberOfMatches} meetings</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-0.5">
              <p className="text-xs text-t-muted">{match.awayTeam.tla}</p>
              <p className="text-3xl font-black text-wc-live">{h2h.aggregates.awayTeam.wins}</p>
              <p className="text-xs text-t-muted">Wins</p>
            </div>
          </div>

          {/* Win proportion bar */}
          {(() => {
            const total = h2h.aggregates.numberOfMatches;
            const hw = h2h.aggregates.homeTeam.wins;
            const dr = h2h.aggregates.homeTeam.draws;
            const aw = h2h.aggregates.awayTeam.wins;
            return (
              <div className="flex h-2 rounded-full overflow-hidden mb-5 gap-px">
                {hw > 0 && <div className="bg-wc-green" style={{ width: `${(hw / total) * 100}%` }} />}
                {dr > 0 && <div className="bg-t-muted/40" style={{ width: `${(dr / total) * 100}%` }} />}
                {aw > 0 && <div className="bg-wc-live" style={{ width: `${(aw / total) * 100}%` }} />}
              </div>
            );
          })()}

          {/* Recent meetings list */}
          {h2h.matches && h2h.matches.length > 0 && (
            <>
              <p className="text-xs font-medium text-t-muted mb-2">Recent Meetings</p>
              <div className="space-y-1.5">
                {h2h.matches.slice(0, 5).map((m) => {
                  const homeWon = m.score.winner === 'HOME_TEAM';
                  const awayWon = m.score.winner === 'AWAY_TEAM';
                  return (
                    <div key={m.id} className="flex items-center gap-2 py-2 px-3 rounded-lg bg-t-subtle/60 text-xs">
                      <span className="text-t-muted w-9 shrink-0 tabular-nums">
                        {new Date(m.utcDate).getFullYear()}
                      </span>
                      <span className={`flex-1 truncate text-right ${homeWon ? 'font-bold text-t-text' : 'text-t-muted'}`}>
                        {m.homeTeam.shortName ?? m.homeTeam.tla}
                      </span>
                      <span className="font-bold text-t-text tabular-nums px-2 shrink-0">
                        {m.score.fullTime.home ?? '?'} – {m.score.fullTime.away ?? '?'}
                      </span>
                      <span className={`flex-1 truncate ${awayWon ? 'font-bold text-t-text' : 'text-t-muted'}`}>
                        {m.awayTeam.shortName ?? m.awayTeam.tla}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ml-1 ${
                          homeWon ? 'bg-wc-green' : awayWon ? 'bg-wc-live' : 'bg-t-muted/40'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Squads ─────────────────────────────────────── */}
      {hasSquads && (
        <div className="card-gradient rounded-xl border border-t-border p-4">
          <h3 className="text-xs font-semibold text-t-muted uppercase tracking-wider mb-5">Squads</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SquadColumn team={homeTeam} teamRef={match.homeTeam} />
            </div>
            <div className="border-t md:border-t-0 md:border-l border-t-border pt-6 md:pt-0 md:pl-6">
              <SquadColumn team={awayTeam} teamRef={match.awayTeam} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
