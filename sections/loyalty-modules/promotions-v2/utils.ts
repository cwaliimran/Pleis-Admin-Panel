import { fDate, formatStr } from '@/utils/format-time';
import { isBefore, startOfDay } from 'date-fns';
import { PROMOTION_TYPE_LABELS, WEEKDAY_LABELS, WEEKDAY_ORDER, isDeprecatedType } from './constants';
import { Promotion, PromotionType } from './types';

export const getViewToUseRate = (promotion: Promotion): number | null => {
  if (promotion.views <= 0) return null;
  return promotion.viewToUseRate;
};

export const getAvgPointsPerParticipant = (promotion: Promotion): number | null => {
  if (promotion.participations <= 0) return null;
  return promotion.avgPointsPerParticipant;
};

export const isExpired = (promotion: Promotion): boolean => isBefore(new Date(promotion.endDate), startOfDay(new Date()));

export const formatDateRange = (promotion: Promotion): string => {
  if (!promotion.startDate || !promotion.endDate) return '—';

  const start = new Date(promotion.startDate);
  const end = new Date(promotion.endDate);
  const sameYear = start.getFullYear() === end.getFullYear();

  return `${fDate(start, sameYear ? 'DD/MM' : formatStr.split.date)} – ${fDate(end, formatStr.split.date)}`;
};

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

export const getTypeDetailLabel = (type: PromotionType): string =>
  `${PROMOTION_TYPE_LABELS[type] ?? type}${isDeprecatedType(type) ? ' (legacy)' : ''}`;

export const formatMetric = (value: number | null, suffix = ''): string => (value === null ? '—' : `${value.toLocaleString()}${suffix}`);
