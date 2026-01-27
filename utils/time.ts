/**
 * Converts 12-hour time (e.g. "09:00 PM") → 24-hour ("21:00")
 */
export const to24HourTime = (time?: string | null): string => {
  if (!time) return '';

  const [timePart, period] = time.split(' ');
  if (!timePart || !period) return '';

  const [hours, minutes] = timePart.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return '';

  let hour = hours;

  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Converts 24-hour time ("21:00") → 12-hour ("09:00 PM")
 */
export const to12HourTime = (time?: string | null): string => {
  if (!time) return '';

  const [hoursStr, minutes] = time.split(':');
  const hours = Number(hoursStr);

  if (isNaN(hours)) return '';

  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;

  return `${hour12.toString().padStart(2, '0')}:${minutes} ${period}`;
};

/**
 * Validates 24-hour time input ("HH:mm")
 */
export const isValid24HourTime = (time?: string): boolean => {
  if (!time) return false;
  const [h, m] = time.split(':');
  return !isNaN(Number(h)) && !isNaN(Number(m));
};
