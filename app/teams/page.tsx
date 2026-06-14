'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TeamsResponse, StandingsResponse } from '@/lib/types';
import TeamCard from '@/components/teams/TeamCard';
import { LoadingSection } from '@/components/ui/LoadingSpinner';
import ErrorState from '@/components/ui/ErrorState';
import { Search } from 'lucide-react';

export default function TeamsPage() {
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('ALL');

  const { data: teamsData, isLoading: teamsLoading, error: teamsError } = useQuery<TeamsResponse>({
    queryKey: ['teams'],
    queryFn: () => fetch('/api/teams').then((r) => r.json()),
  });

  const { data: standingsData } = useQuery<StandingsResponse>({
    queryKey: ['standings'],
    queryFn: () => fetch('/api/standings').then((r) => r.json()),
  });

  // Build a map of teamId → group
  const teamGroupMap = useMemo(() => {
    const map = new Map<number, string>();
    if (standingsData?.standings) {
      for (const standing of standingsData.standings) {
        if (!standing.group) continue;
        for (const entry of standing.table) {
          map.set(entry.team.id, standing.group);
        }
      }
    }
    return map;
  }, [standingsData]);

  const groups = useMemo(() => {
    const set = new Set(teamGroupMap.values());
    return Array.from(set).sort();
  }, [teamGroupMap]);

  const teams = teamsData?.teams ?? [];

  const filtered = useMemo(() => {
    return teams.filter((t) => {
      const nameOk =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.tla.toLowerCase().includes(search.toLowerCase()) ||
        t.shortName.toLowerCase().includes(search.toLowerCase());

      const groupOk =
        groupFilter === 'ALL' || teamGroupMap.get(t.id) === groupFilter;

      return nameOk && groupOk;
    });
  }, [teams, search, groupFilter, teamGroupMap]);

  const apiError = teamsError || (teamsData as any)?.error;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white">Teams</h1>
        <p className="text-sm text-stadium-100 mt-0.5">
          {teamsData ? `${teamsData.count} teams · FIFA World Cup 2026` : 'FIFA World Cup 2026'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stadium-100" />
          <input
            type="text"
            placeholder="Search teams…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stadium-400 bg-stadium-600 text-white placeholder-stadium-100 focus:outline-none focus:border-wc-blue"
          />
        </div>

        {groups.length > 0 && (
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-stadium-400 bg-stadium-600 text-white focus:outline-none focus:border-wc-blue"
          >
            <option value="ALL" className="bg-stadium-700">All Groups</option>
            {groups.map((g) => (
              <option key={g} value={g} className="bg-stadium-700">
                {g.replace('GROUP_', 'Group ')}
              </option>
            ))}
          </select>
        )}
      </div>

      {teamsLoading && <LoadingSection label="Loading teams…" />}
      {!teamsLoading && apiError && <ErrorState message={typeof apiError === 'string' ? apiError : (teamsError as Error)?.message} />}

      {!teamsLoading && !apiError && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map((team) => (
              <TeamCard key={team.id} team={team} group={teamGroupMap.get(team.id) ?? null} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-stadium-100 text-sm">
              No teams found matching &quot;{search}&quot;.
            </div>
          )}
        </>
      )}
    </div>
  );
}
