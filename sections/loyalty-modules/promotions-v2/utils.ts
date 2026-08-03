import { fDate, formatStr } from '@/utils/format-time';
import { isBefore, startOfDay } from 'date-fns';
import { PROMOTION_TYPE_LABELS, WEEKDAY_LABELS, WEEKDAY_ORDER, isDeprecatedType } from './constants';
import { MOCK_MENUS, MOCK_MENU_ITEMS } from './mock-data';
import { Promotion, PromotionType } from './types';

/** Share of viewers who went on to take part — the "view → use" rate. */
export const getViewToUseRate = (promotion: Promotion): number | null => {
  if (promotion.views <= 0) return null;
  return Math.round((promotion.participations / promotion.views) * 100);
};

/** Mean points each participant walked away with. */
export const getAvgPointsPerParticipant = (promotion: Promotion): number | null => {
  if (promotion.participations <= 0) return null;
  return Math.round(promotion.pointsAwarded / promotion.participations);
};

/** Past its end date, so it can no longer be used. */
export const isExpired = (promotion: Promotion): boolean => isBefore(new Date(promotion.endDate), startOfDay(new Date()));

/**
 * Renders as "22/02 – 28/02/2026". The start year is dropped when both ends
 * fall in the same year, which is the common case.
 */
export const formatDateRange = (promotion: Promotion): string => {
  const start = new Date(promotion.startDate);
  const end = new Date(promotion.endDate);
  const sameYear = start.getFullYear() === end.getFullYear();

  return `${fDate(start, sameYear ? 'DD/MM' : formatStr.split.date)} – ${fDate(end, formatStr.split.date)}`;
};

/**
 * Renders as "All days · no time restriction" or "Mon, Fri · 17:00 – 19:00".
 * `null` when the promotion has no schedule at all.
 */
export const formatActiveTime = (promotion: Promotion): string | null => {
  if (!promotion.activeDaysMode) return null;

  const days =
    promotion.activeDaysMode === 'all'
      ? 'All days'
      : WEEKDAY_ORDER.filter((day) => promotion.activeWeekdays.includes(day))
          .map((day) => WEEKDAY_LABELS[day])
          .join(', ') || 'No days selected';

  const time = promotion.startTime && promotion.endTime ? `${promotion.startTime} – ${promotion.endTime}` : 'no time restriction';

  return `${days} · ${time}`;
};

/** The detail modal spells out that a legacy type is no longer the way to do this. */
export const getTypeDetailLabel = (type: PromotionType): string =>
  `${PROMOTION_TYPE_LABELS[type]}${isDeprecatedType(type) ? ' (legacy)' : ''}`;

export const getMenuName = (menuId?: string): string => MOCK_MENUS.find((menu) => menu.id === menuId)?.name || '—';

export const getMenuItemNames = (itemIds: string[]): string[] =>
  itemIds.map((id) => MOCK_MENU_ITEMS.find((item) => item.id === id)?.name).filter((name): name is string => Boolean(name));

export const formatMetric = (value: number | null, suffix = ''): string => (value === null ? '—' : `${value.toLocaleString()}${suffix}`);
