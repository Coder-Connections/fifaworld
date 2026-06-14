import Image from 'next/image';
import type { Team } from '@/lib/types';
import { getGroupLabel } from '@/lib/utils';

interface Props {
  team: Team;
  group?: string | null;
}

export default function TeamCard({ team, group }: Props) {
  return (
    <div className="card-gradient rounded-xl border border-stadium-400 hover:border-stadium-300 transition-all hover:shadow-lg hover:shadow-black/30 group p-4 flex flex-col items-center gap-3 text-center">
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stadium-500 border border-stadium-400 group-hover:scale-105 transition-transform">
        {team.crest ? (
          <Image
            src={team.crest}
            alt={`${team.name} crest`}
            fill
            className="object-contain p-1"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white">
            {team.tla}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold text-white group-hover:text-wc-blue-light transition-colors">
          {team.name}
        </p>
        <p className="text-xs text-stadium-100 mt-0.5">{team.tla}</p>
      </div>

      {group && (
        <span className="text-[11px] font-medium text-wc-gold bg-wc-gold/10 border border-wc-gold/20 px-2.5 py-0.5 rounded-full">
          {getGroupLabel(group)}
        </span>
      )}

      {team.area?.name && (
        <p className="text-xs text-stadium-100">{team.area.name}</p>
      )}
    </div>
  );
}
