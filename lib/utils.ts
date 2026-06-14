import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import type { MatchStatus, Match, StandingsEntry } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isLive(status: MatchStatus): boolean {
  return status === 'IN_PLAY' || status === 'PAUSED';
}

export function isFinished(status: MatchStatus): boolean {
  return status === 'FINISHED';
}

export function isScheduled(status: MatchStatus): boolean {
  return status === 'SCHEDULED' || status === 'TIMED';
}

export function getStatusLabel(status: MatchStatus): string {
  switch (status) {
    case 'IN_PLAY': return 'LIVE';
    case 'PAUSED': return 'HT';
    case 'FINISHED': return 'FT';
    case 'POSTPONED': return 'PST';
    case 'CANCELLED': return 'CANC';
    case 'SUSPENDED': return 'SUS';
    default: return '';
  }
}

export function getStatusColor(status: MatchStatus): string {
  if (isLive(status)) return 'text-wc-live bg-wc-live/10 border-wc-live/30';
  if (isFinished(status)) return 'text-slate-400 bg-stadium-600/50 border-stadium-400/20';
  return 'text-wc-teal bg-wc-teal/10 border-wc-teal/30';
}

export function formatMatchTime(utcDate: string, timezone?: string): string {
  try {
    const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zoned = toZonedTime(parseISO(utcDate), tz);
    return format(zoned, 'h:mm a');
  } catch {
    return format(parseISO(utcDate), 'h:mm a');
  }
}

export function getTimeOfDay(utcDate: string, timezone?: string): string {
  try {
    const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zoned = toZonedTime(parseISO(utcDate), tz);
    const hour = zoned.getHours();
    if (hour === 0) return 'Midnight';
    if (hour < 6) return 'Early Morning';
    if (hour < 12) return 'Morning';
    if (hour < 15) return 'Afternoon';
    if (hour < 18) return 'Late Afternoon';
    if (hour < 21) return 'Evening';
    return 'Night';
  } catch {
    return '';
  }
}

export function formatMatchDate(utcDate: string, timezone?: string): string {
  try {
    const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zoned = toZonedTime(parseISO(utcDate), tz);

    if (isToday(zoned)) return 'Today';
    if (isTomorrow(zoned)) return 'Tomorrow';
    if (isYesterday(zoned)) return 'Yesterday';

    return format(zoned, 'EEE, MMM d');
  } catch {
    const date = parseISO(utcDate);
    if (isToday(date)) return 'Today';
    return format(date, 'EEE, MMM d');
  }
}

export function formatFullDate(utcDate: string): string {
  try {
    return format(parseISO(utcDate), 'MMMM d, yyyy');
  } catch {
    return utcDate;
  }
}

export function formatRelativeTime(utcDate: string): string {
  try {
    return formatDistanceToNow(parseISO(utcDate), { addSuffix: true });
  } catch {
    return '';
  }
}

export function getGroupLabel(group: string | null): string {
  if (!group) return '';
  return group.replace('GROUP_', 'Group ');
}

export function getStageLabel(stage: string): string {
  const map: Record<string, string> = {
    GROUP_STAGE: 'Group Stage',
    ROUND_OF_32: 'Round of 32',
    ROUND_OF_16: 'Round of 16',
    QUARTER_FINALS: 'Quarter-finals',
    SEMI_FINALS: 'Semi-finals',
    THIRD_PLACE: '3rd Place',
    FINAL: 'Final',
  };
  return map[stage] ?? stage.replace(/_/g, ' ');
}

export function groupMatchesByDate(matches: Match[]): Map<string, Match[]> {
  const grouped = new Map<string, Match[]>();
  for (const match of matches) {
    const dateKey = match.utcDate.split('T')[0];
    const existing = grouped.get(dateKey) ?? [];
    grouped.set(dateKey, [...existing, match]);
  }
  return grouped;
}

export function sortByPosition(a: StandingsEntry, b: StandingsEntry): number {
  return a.position - b.position;
}

export function getQualificationStatus(
  position: number,
  totalTeams: number
): 'qualified' | 'playoff' | 'eliminated' | null {
  if (totalTeams === 4) {
    if (position <= 2) return 'qualified';
    if (position === 3) return 'playoff';
    return 'eliminated';
  }
  return null;
}

export function getQualificationColor(status: ReturnType<typeof getQualificationStatus>): string {
  switch (status) {
    case 'qualified': return 'border-l-wc-green';
    case 'playoff': return 'border-l-wc-gold';
    case 'eliminated': return 'border-l-stadium-400';
    default: return '';
  }
}

export function formatScore(score: Match['score']): string {
  const h = score.fullTime.home ?? '-';
  const a = score.fullTime.away ?? '-';
  return `${h} - ${a}`;
}

export function getWinnerClass(
  side: 'home' | 'away',
  winner: Match['score']['winner']
): string {
  if (!winner) return '';
  if (winner === 'DRAW') return 'opacity-80';
  if (
    (side === 'home' && winner === 'HOME_TEAM') ||
    (side === 'away' && winner === 'AWAY_TEAM')
  ) {
    return 'font-bold text-white';
  }
  return 'opacity-50';
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}
