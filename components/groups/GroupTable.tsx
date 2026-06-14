import Image from 'next/image';
import type { StandingsGroup } from '@/lib/types';
import { cn, getGroupLabel, getQualificationStatus, getQualificationColor } from '@/lib/utils';

interface Props {
  group: StandingsGroup;
  compact?: boolean;
}

function FormDot({ result }: { result: string }) {
  const color =
    result === 'W' ? 'bg-wc-green' : result === 'L' ? 'bg-wc-live' : 'bg-stadium-300';
  return (
    <span
      className={cn('inline-block w-2 h-2 rounded-full', color)}
      title={result === 'W' ? 'Win' : result === 'L' ? 'Loss' : 'Draw'}
    />
  );
}

export default function GroupTable({ group, compact = false }: Props) {
  const label = getGroupLabel(group.group);
  const total = group.table.length;

  return (
    <div className="card-gradient rounded-xl border border-stadium-400 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stadium-400/60">
        <h3 className="text-sm font-bold text-white">{label || group.stage}</h3>
        <span className="text-xs text-stadium-100">{total} teams</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] font-semibold text-stadium-100 uppercase tracking-wide">
              <th className="text-left px-4 py-2 w-8">#</th>
              <th className="text-left px-2 py-2">Team</th>
              <th className="text-center px-2 py-2">P</th>
              <th className="text-center px-2 py-2">W</th>
              <th className="text-center px-2 py-2">D</th>
              <th className="text-center px-2 py-2">L</th>
              {!compact && <th className="text-center px-2 py-2">GF</th>}
              {!compact && <th className="text-center px-2 py-2">GA</th>}
              <th className="text-center px-2 py-2">GD</th>
              <th className="text-center px-2 py-2 font-bold text-white">Pts</th>
              {!compact && <th className="text-center px-2 py-2">Form</th>}
            </tr>
          </thead>
          <tbody>
            {group.table.map((entry) => {
              const qualStatus = getQualificationStatus(entry.position, total);
              const qualColor = getQualificationColor(qualStatus);

              return (
                <tr
                  key={entry.team.id}
                  className={cn(
                    'border-t border-stadium-400/30 hover:bg-stadium-500/30 transition-colors border-l-2',
                    qualColor || 'border-l-transparent'
                  )}
                >
                  <td className="px-4 py-2.5">
                    <span className="text-xs font-semibold text-stadium-100">
                      {entry.position}
                    </span>
                  </td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative w-6 h-6 rounded shrink-0 overflow-hidden bg-stadium-500">
                        {entry.team.crest ? (
                          <Image
                            src={entry.team.crest}
                            alt={entry.team.name}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-stadium-100">
                            {entry.team.tla}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-white truncate">
                        {compact ? entry.team.tla : entry.team.shortName}
                      </span>
                    </div>
                  </td>
                  <td className="text-center px-2 py-2.5 text-stadium-100">{entry.playedGames}</td>
                  <td className="text-center px-2 py-2.5 text-wc-green font-medium">{entry.won}</td>
                  <td className="text-center px-2 py-2.5 text-stadium-100">{entry.draw}</td>
                  <td className="text-center px-2 py-2.5 text-wc-live font-medium">{entry.lost}</td>
                  {!compact && <td className="text-center px-2 py-2.5 text-stadium-100">{entry.goalsFor}</td>}
                  {!compact && <td className="text-center px-2 py-2.5 text-stadium-100">{entry.goalsAgainst}</td>}
                  <td className="text-center px-2 py-2.5 text-stadium-100">
                    {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
                  </td>
                  <td className="text-center px-2 py-2.5">
                    <span className="font-bold text-white">{entry.points}</span>
                  </td>
                  {!compact && (
                    <td className="text-center px-2 py-2.5">
                      <div className="flex items-center justify-center gap-0.5">
                        {entry.form
                          ? entry.form.split(',').slice(-5).map((r, i) => (
                              <FormDot key={i} result={r.trim()} />
                            ))
                          : <span className="text-[10px] text-stadium-100">–</span>
                        }
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 px-4 py-2.5 border-t border-stadium-400/30">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-wc-green" />
          <span className="text-[10px] text-stadium-100">Advance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-wc-gold" />
          <span className="text-[10px] text-stadium-100">Playoff</span>
        </div>
      </div>
    </div>
  );
}
