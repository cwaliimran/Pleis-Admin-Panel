import { OrderTimingSettings } from './types';

/** Suggested lengths. A record may hold any other value — see `mappers.ts`. */
export const SESSION_LENGTH_OPTIONS: { value: number; label: string }[] = [
  { value: 15, label: '15 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '60 minutes' },
];

/** How "timer off" is stored — the wire has no separate boolean. */
export const DISABLED_SESSION_TIMER_LENGTH = 0;

/** Length restored when the timer is switched back on with nothing stored. */
export const FALLBACK_SESSION_LENGTH_MINUTES = 30;

export const DEFAULT_ORDER_TIMING_SETTINGS: OrderTimingSettings = {
  sessionTimerEnabled: false,
  sessionLengthMinutes: FALLBACK_SESSION_LENGTH_MINUTES,
};
