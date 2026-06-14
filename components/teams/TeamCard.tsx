import Image from 'next/image';
import type { Team } from '@/lib/types';
import { getGroupLabel } from '@/lib/utils';

interface Props { team: Team; group?: string | null; }

export default function TeamCard({ team, group }: Props) {
  return (
    <div className="card-gradient rounded-xl border border-t-border hover:border-wc-blue/40 hover:shadow-md dark:hover:shadow-none transition-all group p-4 flex flex-col items-center gap-3 text-center">
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-t-subtle border border-t-border group-hover:scale-105 transition-transform">
        {team.crest
          ? <Image src={team.crest} alt={`${team.name} crest`} fill className="object-contain p-1" unoptimized />
          : <div className="w-full h-full flex items-center justify-center text-lg font-bold text-t-text">{team.tla}</div>
        }
      </div>

      <div>
        <p className="text-sm font-semibold text-t-text group-hover:text-wc-blue transition-colors">{team.name}</p>
        <p className="text-xs text-t-muted mt-0.5">{team.tla}</p>
      </div>

      {group && (
        <span className="text-[11px] font-medium text-wc-gold bg-wc-gold/10 border border-wc-gold/20 px-2.5 py-0.5 rounded-full">
          {getGroupLabel(group)}
        </span>
      )}

      {team.area?.name && <p className="text-xs text-t-muted">{team.area.name}</p>}
    </div>
  );
}
