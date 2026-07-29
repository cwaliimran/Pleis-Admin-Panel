import { convertTimeFormat, formatDate } from '@/utils/format-time';

/**
 * The discounts API stores schedule fields as literal strings, e.g. "2026-07-27 06:00 AM" —
 * not ISO dates. These helpers convert between that wire format and the Date + 24h-time pair
 * the form inputs (RHFDate + Time24hInput) work with.
 */
export const buildDiscountDateTime = (date: Date, time24: string): string => `${formatDate(date)} ${convertTimeFormat(time24, false)}`;

export const parseDiscountDateTime = (value: string): { date: Date; time24: string } => {
  const [datePart, ...timeParts] = value.trim().split(' ');
  const time24 = timeParts.length ? convertTimeFormat(timeParts.join(' '), true) : '00:00';
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = time24.split(':').map(Number);
  return { date: new Date(year, (month || 1) - 1, day || 1, hours || 0, minutes || 0, 0, 0), time24 };
};

export const getAppliesToLabel = (menuItems: { title: string }[]): string => {
  if (!menuItems || menuItems.length === 0) return '-';
  return menuItems.map((item) => item.title).join(', ');
};
