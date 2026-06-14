import Image from 'next/image';
import type { Scorer } from '@/lib/types';

interface Props { scorers: Scorer[]; limit?: number; }

export default function TopScorers({ scorers, limit = 10 }: Props) {
  const displayed = scorers.slice(0, limit);

  return (
    <div className="card-gradient rounded-xl border border-t-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-t-border bg-t-subtle">
        <h3 className="text-sm font-bold text-t-text">Top Scorers</h3>
        <span className="text-xs text-wc-gold font-semibold">Goals</span>
      </div>

      <ul className="divide-y divide-t-border">
        {displayed.map((scorer, idx) => (
          <li key={scorer.player.id} className="flex items-center gap-3 px-4 py-3 hover:bg-t-subtle/60 transition-colors">
            <span className="text-xs font-bold text-t-muted w-5 shrink-0 text-center">{idx + 1}</span>

            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-t-subtle border border-t-border shrink-0">
              {scorer.team.crest
                ? <Image src={scorer.team.crest} alt={scorer.team.name} fill className="object-contain" unoptimized />
                : <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-t-text">{scorer.team.tla}</div>
              }
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-t-text truncate">{scorer.player.name}</p>
              <p className="text-xs text-t-muted truncate">{scorer.team.shortName}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {scorer.assists !== null && (
                <div className="text-center hidden sm:block">
                  <p className="text-xs font-semibold text-t-muted">{scorer.assists}</p>
                  <p className="text-[10px] text-t-muted/60">AST</p>
                </div>
              )}
              <div className="text-center">
                <p className="text-lg font-black text-wc-gold tabular-nums">{scorer.goals}</p>
                <p className="text-[10px] text-t-muted/60">GLS</p>
              </div>
            </div>
          </li>
        ))}

        {displayed.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-t-muted">No scorer data yet.</li>
        )}
      </ul>
    </div>
  );
}
