export type MatchStatus =
  | 'SCHEDULED'
  | 'TIMED'
  | 'IN_PLAY'
  | 'PAUSED'
  | 'FINISHED'
  | 'SUSPENDED'
  | 'POSTPONED'
  | 'CANCELLED';

export type MatchWinner = 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null;

export type StandingsType = 'TOTAL' | 'HOME' | 'AWAY';

export interface Area {
  id: number;
  name: string;
  code: string;
  flag: string | null;
}

export interface TeamRef {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface Team extends TeamRef {
  address?: string;
  website?: string;
  founded?: number;
  clubColors?: string;
  venue?: string;
  area?: Area;
  squad?: Player[];
  coach?: Coach;
  runningCompetitions?: Competition[];
}

export interface Player {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string | null;
  dateOfBirth?: string;
  nationality?: string;
  section?: string;
  position?: string | null;
  shirtNumber?: number | null;
  marketValue?: number | null;
  contract?: { start: string; until: string };
}

export interface Coach {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string | null;
  dateOfBirth?: string;
  nationality?: string;
  contract?: { start: string; until: string };
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem?: string;
}

export interface Score {
  winner: MatchWinner;
  duration: 'REGULAR' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT';
  fullTime: { home: number | null; away: number | null };
  halfTime: { home: number | null; away: number | null };
  extraTime?: { home: number | null; away: number | null };
  penalties?: { home: number | null; away: number | null };
}

export interface Referee {
  id: number;
  name: string;
  type: string;
  nationality: string;
}

export interface Match {
  id: number;
  utcDate: string;
  status: MatchStatus;
  matchday: number | null;
  stage: string;
  group: string | null;
  lastUpdated: string;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  score: Score;
  venue?: string;
  referees?: Referee[];
  odds?: { msg: string };
}

export interface StandingsEntry {
  position: number;
  team: TeamRef;
  playedGames: number;
  form: string | null;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface StandingsGroup {
  stage: string;
  type: StandingsType;
  group: string | null;
  table: StandingsEntry[];
}

export interface Scorer {
  player: {
    id: number;
    name: string;
    firstName: string;
    lastName: string | null;
    dateOfBirth: string;
    nationality: string;
    section: string;
    position: string | null;
    shirtNumber: number | null;
  };
  team: TeamRef;
  goals: number;
  assists: number | null;
  penalties: number | null;
  playedMatches?: number;
}

export interface Season {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number | null;
  winner: TeamRef | null;
}

export interface MatchesResponse {
  count: number;
  filters: Record<string, string>;
  matches: Match[];
}

export interface StandingsResponse {
  filters: Record<string, string>;
  area: Area;
  competition: Competition;
  season: Season;
  standings: StandingsGroup[];
}

export interface ScorersResponse {
  count: number;
  filters: Record<string, string>;
  competition: Competition;
  season: Season;
  scorers: Scorer[];
}

export interface TeamsResponse {
  count: number;
  filters: Record<string, string>;
  competition: Competition;
  season: Season;
  teams: Team[];
}

export interface TeamResponse extends Team {}

export type StageLabel =
  | 'Group Stage'
  | 'Round of 32'
  | 'Round of 16'
  | 'Quarter-finals'
  | 'Semi-finals'
  | '3rd Place'
  | 'Final';

export const STAGE_MAP: Record<string, StageLabel> = {
  GROUP_STAGE: 'Group Stage',
  ROUND_OF_32: 'Round of 32',
  ROUND_OF_16: 'Round of 16',
  QUARTER_FINALS: 'Quarter-finals',
  SEMI_FINALS: 'Semi-finals',
  THIRD_PLACE: '3rd Place',
  FINAL: 'Final',
};

export const KNOCKOUT_STAGE_ORDER = [
  'ROUND_OF_32',
  'ROUND_OF_16',
  'QUARTER_FINALS',
  'SEMI_FINALS',
  'THIRD_PLACE',
  'FINAL',
] as const;

export interface MatchDetail extends Match {
  competition: Competition;
  area: Area;
  season: Season;
}

export interface H2HAggregates {
  numberOfMatches: number;
  totalGoals: number;
  homeTeam: { id: number; name: string; wins: number; draws: number; losses: number };
  awayTeam: { id: number; name: string; wins: number; draws: number; losses: number };
}

export interface H2HResponse {
  aggregates: H2HAggregates;
  matches: Match[];
}
