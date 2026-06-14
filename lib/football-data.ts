import type {
  MatchesResponse,
  StandingsResponse,
  ScorersResponse,
  TeamsResponse,
  TeamResponse,
  MatchDetail,
  H2HResponse,
} from './types';

const BASE_URL = 'https://api.football-data.org/v4';
const COMPETITION = process.env.NEXT_PUBLIC_COMPETITION_CODE ?? 'WC';

function getHeaders() {
  const key = process.env.FOOTBALL_DATA_API_KEY;
  if (!key || key === 'your_api_key_here') {
    throw new Error('FOOTBALL_DATA_API_KEY is not configured');
  }
  return {
    'X-Auth-Token': key,
    'Content-Type': 'application/json',
  };
}

async function apiFetch<T>(path: string, revalidate = 60): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`football-data.org ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchMatches(params?: Record<string, string>): Promise<MatchesResponse> {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<MatchesResponse>(`/competitions/${COMPETITION}/matches${qs}`, 30);
}

export async function fetchLiveMatches(): Promise<MatchesResponse> {
  return fetchMatches({ status: 'IN_PLAY,PAUSED' });
}

export async function fetchTodayMatches(): Promise<MatchesResponse> {
  const today = new Date().toISOString().split('T')[0];
  return fetchMatches({ dateFrom: today, dateTo: today });
}

export async function fetchStandings(): Promise<StandingsResponse> {
  return apiFetch<StandingsResponse>(`/competitions/${COMPETITION}/standings`, 300);
}

export async function fetchScorers(limit = 20): Promise<ScorersResponse> {
  return apiFetch<ScorersResponse>(`/competitions/${COMPETITION}/scorers?limit=${limit}`, 300);
}

export async function fetchTeams(): Promise<TeamsResponse> {
  return apiFetch<TeamsResponse>(`/competitions/${COMPETITION}/teams`, 3600);
}

export async function fetchTeam(id: number): Promise<TeamResponse> {
  return apiFetch<TeamResponse>(`/teams/${id}`, 3600);
}

export async function fetchMatch(id: number): Promise<MatchDetail> {
  return apiFetch<MatchDetail>(`/matches/${id}`, 30);
}

export async function fetchHeadToHead(id: number): Promise<H2HResponse> {
  return apiFetch<H2HResponse>(`/matches/${id}/head2head?limit=5`, 3600);
}
