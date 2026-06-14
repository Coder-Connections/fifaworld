import Image from 'next/image';
import type { Match } from '@/lib/types';
import { KNOCKOUT_STAGE_ORDER } from '@/lib/types';
import { isFinished, isLive, getStageLabel } from '@/lib/utils';

interface Props { matches: Match[]; }

function BracketMatch({ match }: { match: Match }) {
  const finished = isFinished(match.status);
  const live = isLive(match.status);
  const hw = match.score.winner === 'HOME_TEAM';
  const aw = match.score.winner === 'AWAY_TEAM';

  function TeamRow({
    team, score, isWinner,
  }: {
    team: Match['homeTeam'] | null;
    score: number | null;
    isWinner: boolean;
  }) {
    if (!team) return (
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-t-muted">
        <div className="w-5 h-5 rounded bg-t-subtle" />
        <span>TBD</span>
      </div>
    );

    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 ${isWinner ? 'bg-wc-green/10' : ''}`}>
        <div className="relative w-5 h-5 rounded overflow-hidden shrink-0 bg-t-subtle border border-t-border">
          {team.crest
            ? <Image src={team.crest} alt={team.name ?? ''} fill className="object-contain" unoptimized />
            : <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-t-text">{team.tla}</div>
          }
        </div>
        <span className={`text-xs font-medium flex-1 truncate ${isWinner ? 'text-wc-green font-bold' : 'text-t-text'}`}>
          {team.tla ?? 'TBD'}
        </span>
        {(finished || live) && (
          <span className={`text-xs font-bold tabular-nums ${live ? 'text-wc-live' : isWinner ? 'text-wc-green' : 'text-t-muted'}`}>
            {score ?? 0}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border overflow-hidden min-w-[130px] ${live ? 'border-wc-live/50 bg-gradient-live' : 'border-t-border card-gradient'}`}>
      {live && (
        <div className="flex items-center justify-end gap-1 px-3 pt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-wc-live dot-pulse" />
          <span className="text-[10px] text-wc-live font-bold">LIVE</span>
        </div>
      )}
      <TeamRow team={match.homeTeam} score={match.score.fullTime.home} isWinner={hw} />
      <div className="h-px bg-t-border mx-2" />
      <TeamRow team={match.awayTeam} score={match.score.fullTime.away} isWinner={aw} />
    </div>
  );
}

export default function KnockoutBracket({ matches }: Props) {
  const byStage = new Map<string, Match[]>();
  for (const match of matches) {
    if (match.stage === 'GROUP_STAGE') continue;
    const existing = byStage.get(match.stage) ?? [];
    byStage.set(match.stage, [...existing, match]);
  }

  const stages = KNOCKOUT_STAGE_ORDER.filter((s) => byStage.has(s));

  if (stages.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-t-muted text-sm">Knockout stage has not started yet.</p>
        <p className="text-t-muted/60 text-xs mt-1">Check back after the group stage.</p>
      </div>
    );
  }

  const mainStages = stages.filter((s) => s !== 'THIRD_PLACE');
  const thirdPlace = byStage.get('THIRD_PLACE')?.[0];

  return (
    <div className="space-y-8">
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-6 min-w-max items-start">
          {mainStages.map((stage) => {
            const stageMatches = byStage.get(stage) ?? [];
            return (
              <div key={stage} className="flex flex-col gap-4">
                <h3 className="text-xs font-semibold text-t-muted uppercase tracking-wider text-center px-2">
                  {getStageLabel(stage)}
                </h3>
                <div className="flex flex-col gap-4 justify-around" style={{ minHeight: `${Math.max(stageMatches.length * 80, 80)}px` }}>
                  {stageMatches.map((match) => (
                    <BracketMatch key={match.id} match={match} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {thirdPlace && (
        <div className="border-t border-t-border pt-6">
          <h3 className="text-xs font-semibold text-t-muted uppercase tracking-wider mb-3">3rd Place Playoff</h3>
          <div className="inline-block"><BracketMatch match={thirdPlace} /></div>
        </div>
      )}
    </div>
  );
}
