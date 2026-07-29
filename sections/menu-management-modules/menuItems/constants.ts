export const TAX_OPTIONS = [
  { value: '25', label: '25%' },
  { value: '13', label: '13%' },
  { value: '5', label: '5%' },
  { value: '0', label: '0%' },
];

export const DAY_OPTIONS = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
  { value: 'saturday', label: 'Sat' },
  { value: 'sunday', label: 'Sun' },
];

const DAY_ORDER = DAY_OPTIONS.map((day) => day.value);

export const formatAvailableDays = (days: string[] = []): string => {
  if (days.length === 0) return '';
  if (days.length === 7) return 'Every day';

  const sortedIndexes = days.map((day) => DAY_ORDER.indexOf(day)).sort((a, b) => a - b);
  const isContiguous = sortedIndexes.every((idx, i) => i === 0 || idx === sortedIndexes[i - 1] + 1);

  if (isContiguous && sortedIndexes.length > 1) {
    const first = DAY_OPTIONS[sortedIndexes[0]].label;
    const last = DAY_OPTIONS[sortedIndexes[sortedIndexes.length - 1]].label;
    return `${first}–${last}`;
  }

  return sortedIndexes.map((idx) => DAY_OPTIONS[idx].label).join(', ');
};
