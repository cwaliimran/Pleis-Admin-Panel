import dayjs, { ConfigType, OpUnitType } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

// ----------------------------------------------------------------------

dayjs.extend(duration);
dayjs.extend(relativeTime);

/**
 * Docs: https://day.js.org/docs/en/display/format
 */
export const formatStr = {
  dateTime: 'DD MMM YYYY h:mm a', // 17 Apr 2022 12:00 am
  date: 'DD MMM YYYY', // 17 Apr 2022
  time: 'h:mm a', // 12:00 am
  split: {
    dateTime: 'DD/MM/YYYY h:mm a', // 17/04/2022 12:00 am
    date: 'DD/MM/YYYY', // 17/04/2022
  },
  paramCase: {
    dateTime: 'DD-MM-YYYY h:mm a', // 17-04-2022 12:00 am
    dateTimeRev: 'YYYY-MM-DD h:mm a', // 17-04-2022 12:00 am
    date: 'DD-MM-YYYY', // 17-04-2022
    db: 'YYYY-MM-DD', // 2022-04-17
  },
};

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function today(format: string): string {
  return dayjs(new Date()).startOf('day').format(format);
}

// ----------------------------------------------------------------------

/** output: 17 Apr 2022 12:00 am
 */
export function fDateTime(date: ConfigType, format?: string): string | null {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid
    ? dayjs(date).format(format ?? formatStr.dateTime)
    : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: 17 Apr 2022
 */
export function fDate(date: ConfigType, format?: string): string | null {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid
    ? dayjs(date).format(format ?? formatStr.date)
    : 'Invalid time value';
}

// fDate(row.date, formatStr.paramCase.date)

// ----------------------------------------------------------------------

/** output: 12:00 am
 */
export function fTime(date: ConfigType, format?: string): string | null {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid
    ? dayjs(date).format(format ?? formatStr.time)
    : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: 1713250100
 */
export function fTimestamp(date: ConfigType): number | string | null {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).valueOf() : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: a few seconds, 2 years
 */
export function fToNow(date: ConfigType): string | null {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).toNow(true) : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: boolean
 */
export function fIsBetween(
  inputDate: ConfigType,
  startDate: ConfigType,
  endDate: ConfigType
): boolean {
  if (!inputDate || !startDate || !endDate) {
    return false;
  }

  const formattedInputDate = fTimestamp(inputDate);
  const formattedStartDate = fTimestamp(startDate);
  const formattedEndDate = fTimestamp(endDate);

  if (
    typeof formattedInputDate === 'number' &&
    typeof formattedStartDate === 'number' &&
    typeof formattedEndDate === 'number'
  ) {
    return (
      formattedInputDate >= formattedStartDate &&
      formattedInputDate <= formattedEndDate
    );
  }

  return false;
}

// ----------------------------------------------------------------------

/** output: boolean
 */
export function fIsAfter(startDate: ConfigType, endDate: ConfigType): boolean {
  return dayjs(startDate).isAfter(endDate);
}

// ----------------------------------------------------------------------

/** output: boolean
 */
export function fIsSame(
  startDate: ConfigType,
  endDate: ConfigType,
  units?: OpUnitType
): boolean | string {
  if (!startDate || !endDate) {
    return false;
  }

  const isValid = dayjs(startDate).isValid() && dayjs(endDate).isValid();

  if (!isValid) {
    return 'Invalid time value';
  }

  return dayjs(startDate).isSame(endDate, units ?? 'year');
}

// ----------------------------------------------------------------------

/** output:
 * Same day: 26 Apr 2024
 * Same month: 25 - 26 Apr 2024
 * Same year: 25 Apr - 26 May 2024
 */
export function fDateRangeShortLabel(
  startDate: ConfigType,
  endDate: ConfigType,
  initial?: boolean
): string {
  const isValid = dayjs(startDate).isValid() && dayjs(endDate).isValid();
  const isAfter = fIsAfter(startDate, endDate);

  if (!isValid || isAfter) {
    return 'Invalid time value';
  }

  let label = `${fDate(startDate)} - ${fDate(endDate)}`;

  if (initial) {
    return label;
  }

  const isSameYear = fIsSame(startDate, endDate, 'year');
  const isSameMonth = fIsSame(startDate, endDate, 'month');
  const isSameDay = fIsSame(startDate, endDate, 'day');

  if (isSameYear && !isSameMonth) {
    label = `${fDate(startDate, 'DD MMM')} - ${fDate(endDate)}`;
  } else if (isSameYear && isSameMonth && !isSameDay) {
    label = `${fDate(startDate, 'DD')} - ${fDate(endDate)}`;
  } else if (isSameYear && isSameMonth && isSameDay) {
    label = `${fDate(endDate)}`;
  }

  return label;
}

/** output: '2024-05-28T05:55:31+00:00'
 */
export function fAdd({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}: {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}): string {
  const result = dayjs()
    .add(
      dayjs.duration({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      })
    )
    .format();

  return result;
}

/** output: '2024-05-28T05:55:31+00:00'
 */
export function fSub({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}: {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}): string {
  const result = dayjs()
    .subtract(
      dayjs.duration({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      })
    )
    .format();

  return result;
}

export const formatDate = (date?: Date): string | undefined => {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// export function convertTimeFormat(time, to24Hour = false) {
//     if (to24Hour) {
//         // Convert 12-hour format (e.g., "6:15 PM") to 24-hour format (e.g., "18:15")
//         const [timePart, period] = time.split(" ");
//         let [hours, minutes] = timePart.split(":");
//         hours = parseInt(hours);
//         if (period === "PM" && hours !== 12) hours += 12;
//         if (period === "AM" && hours === 12) hours = 0;
//         return `${hours.toString().padStart(2, '0')}:${minutes}`;
//     } else {
//         // Convert 24-hour format (e.g., "18:15") to 12-hour format (e.g., "6:15 PM")
//         let [hours, minutes] = time.split(":");
//         hours = parseInt(hours);
//         let period = hours >= 12 ? "PM" : "AM";
//         hours = hours % 12 || 12; // Convert 0 to 12 for midnight
//         return `${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')} ${period}`;
//     }
// }

export function convertTimeFormat(
  time: string,
  to24Hour: boolean = false
): string {
  if (to24Hour) {
    // Convert 12-hour format (e.g., "6:15 PM") to 24-hour format (e.g., "18:15")
    const parts = time.split(' ');
    if (parts.length !== 2) {
      throw new Error(
        "Invalid 12-hour time format. Expected format: 'H:MM AM/PM'"
      );
    }
    const [timePart, period] = parts;
    if (!period || !['AM', 'PM'].includes(period)) {
      throw new Error("Invalid period. Expected 'AM' or 'PM'");
    }
    const timeComponents = timePart.split(':');
    if (timeComponents.length !== 2) {
      throw new Error("Invalid time format. Expected 'H:MM' or 'HH:MM'");
    }
    const [hours, minutes] = timeComponents;
    const parsedHours = parseInt(hours);
    if (isNaN(parsedHours)) {
      throw new Error('Invalid hours value');
    }
    if (!minutes) {
      throw new Error('Invalid minutes value');
    }
    let convertedHours = parsedHours;
    if (period === 'PM' && convertedHours !== 12) convertedHours += 12;
    if (period === 'AM' && convertedHours === 12) convertedHours = 0;
    return `${convertedHours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  } else {
    // Convert 24-hour format (e.g., "18:15") to 12-hour format (e.g., "6:15 PM")
    const timeComponents = time.split(':');
    if (timeComponents.length !== 2) {
      throw new Error("Invalid 24-hour time format. Expected 'HH:MM'");
    }
    const [hours, minutes] = timeComponents;
    const parsedHours = parseInt(hours);
    if (isNaN(parsedHours)) {
      throw new Error('Invalid hours value');
    }
    if (!minutes) {
      throw new Error('Invalid minutes value');
    }
    const period = parsedHours >= 12 ? 'PM' : 'AM';
    const convertedHours = parsedHours % 12 || 12; // Convert 0 to 12 for midnight
    return `${convertedHours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')} ${period}`;
  }
}
