import type { ApiInAppOrderingSettings } from '@/store/Reducer/organization';
import { DISABLED_SESSION_TIMER_LENGTH, FALLBACK_SESSION_LENGTH_MINUTES } from './constants';
import { OrderTimingSettings } from './types';

// ============================================================
// Wire ↔ view model
//
// The wire stores only `sessionTimerLength`, so the UI's on/off switch is
// derived: any positive length means the timer is on, and switching it off
// writes 0. The last chosen length is kept in form state while the switch
// is off, so turning it back on restores it.
// ============================================================

export const mapApiOrderTiming = (settings?: ApiInAppOrderingSettings | null): OrderTimingSettings => {
  const length = Number(settings?.sessionTimerLength) || DISABLED_SESSION_TIMER_LENGTH;

  return {
    sessionTimerEnabled: length > DISABLED_SESSION_TIMER_LENGTH,
    sessionLengthMinutes: length > DISABLED_SESSION_TIMER_LENGTH ? length : FALLBACK_SESSION_LENGTH_MINUTES,
  };
};

export const toApiSessionTimerLength = (timing: OrderTimingSettings): number =>
  timing.sessionTimerEnabled ? timing.sessionLengthMinutes : DISABLED_SESSION_TIMER_LENGTH;
