export const COMBO_SERVING_VALUE = 'combo';

export const SERVING_OPTIONS = [
  { value: 'glass', label: 'Glass (l)' },
  { value: 'bottle', label: 'Bottle (l)' },
  { value: 'individual', label: 'Individual (pcs)' },
  { value: 'sharing', label: 'Sharing (pcs)' },
  { value: 'weight', label: 'By weight (g)' },
  { value: COMBO_SERVING_VALUE, label: 'Combo' },
];

export const TAX_OPTIONS = [
  { value: '25', label: '25%' },
  { value: '13', label: '13%' },
  { value: '5', label: '5%' },
  { value: '0', label: '0%' },
];

export const DAY_OPTIONS = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' },
];

export const DAYPART_OPTIONS = [
  { value: 'breakfast', label: 'Breakfast 06–10' },
  { value: 'brunch', label: 'Brunch 10–12' },
  { value: 'lunch', label: 'Lunch 12–15' },
  { value: 'afternoon', label: 'Afternoon 15–17' },
  { value: 'dinner', label: 'Dinner 18–22' },
  { value: 'latenight', label: 'Late night 22–05' },
  { value: 'allday', label: 'All day' },
];

export const DIET_TAG_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'glutenFree', label: 'Gluten free' },
  { value: 'lactoseFree', label: 'Lactose free' },
  { value: 'keto', label: 'Keto' },
  { value: 'lowCarb', label: 'Low carb' },
  { value: 'highProtein', label: 'High protein' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
  { value: 'lowSugar', label: 'Low sugar' },
  { value: 'spicy', label: 'Spicy' },
  { value: 'pescatarian', label: 'Pescatarian' },
];

export const ALLERGEN_OPTIONS = [
  { value: 'gluten', label: 'Gluten' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'milk', label: 'Milk' },
  { value: 'nuts', label: 'Nuts' },
  { value: 'peanuts', label: 'Peanuts' },
  { value: 'soy', label: 'Soy' },
  { value: 'fish', label: 'Fish' },
  { value: 'shellfish', label: 'Shellfish' },
  { value: 'crustaceans', label: 'Crustaceans' },
  { value: 'celery', label: 'Celery' },
  { value: 'mustard', label: 'Mustard' },
  { value: 'sesame', label: 'Sesame' },
  { value: 'sulfites', label: 'Sulfites' },
  { value: 'lupin', label: 'Lupin' },
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

export const formatDaypart = (daypart: string[] = []): string =>
  daypart.map((value) => DAYPART_OPTIONS.find((option) => option.value === value)?.label.split(' ')[0] || value).join(' + ');
