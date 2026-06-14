'use client';

import { cn } from '@/lib/utils';

export type FilterStatus = 'ALL' | 'LIVE' | 'SCHEDULED' | 'FINISHED';
export type FilterStage = 'ALL' | 'GROUP_STAGE' | 'ROUND_OF_32' | 'ROUND_OF_16' | 'QUARTER_FINALS' | 'SEMI_FINALS' | 'FINAL';

interface Props {
  status: FilterStatus;
  stage: FilterStage;
  onStatusChange: (s: FilterStatus) => void;
  onStageChange: (s: FilterStage) => void;
}

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'ALL',       label: 'All' },
  { value: 'LIVE',      label: 'Live' },
  { value: 'SCHEDULED', label: 'Upcoming' },
  { value: 'FINISHED',  label: 'Results' },
];

const STAGE_OPTIONS: { value: FilterStage; label: string }[] = [
  { value: 'ALL',            label: 'All Stages' },
  { value: 'GROUP_STAGE',    label: 'Group Stage' },
  { value: 'ROUND_OF_32',   label: 'Round of 32' },
  { value: 'ROUND_OF_16',   label: 'Round of 16' },
  { value: 'QUARTER_FINALS', label: 'Quarter-finals' },
  { value: 'SEMI_FINALS',   label: 'Semi-finals' },
  { value: 'FINAL',         label: 'Final' },
];

export default function MatchFilters({ status, stage, onStatusChange, onStageChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="flex rounded-xl overflow-hidden border border-t-border bg-t-subtle p-1 gap-1">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatusChange(opt.value)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-all',
              status === opt.value
                ? opt.value === 'LIVE'
                  ? 'bg-wc-live text-white'
                  : 'bg-wc-blue text-white'
                : 'text-t-muted hover:text-t-text hover:bg-t-surface',
            )}
          >
            {opt.value === 'LIVE' && status === 'LIVE' && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-white dot-pulse mr-1.5" />
            )}
            {opt.label}
          </button>
        ))}
      </div>

      <select
        value={stage}
        onChange={(e) => onStageChange(e.target.value as FilterStage)}
        className="px-3 py-2 text-sm font-medium rounded-xl border border-t-border bg-t-surface text-t-text focus:outline-none focus:border-wc-blue"
      >
        {STAGE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
