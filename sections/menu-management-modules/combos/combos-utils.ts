import { DAY_OPTIONS, formatAvailableDays } from '../menuItems/constants';
import {
  AllergenRef,
  ComboComponent,
  ComboLine,
  ComboMenuItemEntry,
  ComboMenuItemLine,
  ComboMenuItemRef,
  DaypartRef,
  DerivedAvailability,
  PriceMode,
  SubCategoryRef,
} from './types';

type RefLike = string | { _id: string; title?: string } | null | undefined;

export const getRefId = (value: SubCategoryRef | ComboMenuItemRef): string => {
  if (!value) return '';
  return typeof value === 'string' ? value : value._id || '';
};

export const getRefLabel = (value: RefLike, lookup?: Map<string, string>): string => {
  if (!value) return '-';
  if (typeof value === 'string') return lookup?.get(value) || '-';
  return value.title || (lookup?.get(value._id) ?? '-');
};

export const getMenuItemPrice = (value: ComboMenuItemRef): number => (value && typeof value !== 'string' ? value.basePrice || 0 : 0);

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;

export const clampQuantity = (value: unknown): number => {
  const quantity = Math.floor(Number(value));
  if (!Number.isFinite(quantity) || quantity < MIN_QUANTITY) return MIN_QUANTITY;
  return Math.min(quantity, MAX_QUANTITY);
};

const isComboLine = (entry: ComboMenuItemEntry): entry is ComboMenuItemLine =>
  !!entry && typeof entry === 'object' && Object.prototype.hasOwnProperty.call(entry, 'menuItem');

export const getComboLines = (menuItems: ComboMenuItemEntry[] | undefined): ComboLine[] =>
  (menuItems || [])
    .map((entry) => {
      const ref = isComboLine(entry) ? entry.menuItem : (entry as ComboMenuItemRef);
      return { id: getRefId(ref), ref, quantity: isComboLine(entry) ? clampQuantity(entry.quantity) : MIN_QUANTITY };
    })
    .filter((line) => !!line.id);

export const getSumOfParts = (menuItems: ComboMenuItemEntry[] | undefined): number =>
  getComboLines(menuItems).reduce((sum, line) => sum + getMenuItemPrice(line.ref) * line.quantity, 0);

export const PRICE_MODE_OPTIONS: { value: PriceMode; label: string }[] = [
  { value: 'fixed_combo_price', label: 'Fixed combo price' },
  { value: 'percentage_off_sum', label: 'Percentage off sum' },
  { value: 'fixed_amount_off_sum', label: 'Fixed amount off sum' },
];

export const getPriceModeLabel = (mode: PriceMode): string => PRICE_MODE_OPTIONS.find((option) => option.value === mode)?.label || mode;

export const PRICE_INPUT_CONFIG: Record<PriceMode, { label: string; suffix: string; placeholder: string }> = {
  fixed_combo_price: { label: 'Combo price (€)', suffix: '€', placeholder: '0.00' },
  percentage_off_sum: { label: 'Percentage of sum (%)', suffix: '%', placeholder: 'e.g. 50' },
  fixed_amount_off_sum: { label: 'Amount off sum (€)', suffix: '€', placeholder: '0.00' },
};

export const formatComboPrice = (mode: PriceMode, price: number): string => {
  if (price == null || isNaN(Number(price))) return '—';
  return PRICE_INPUT_CONFIG[mode]?.suffix === '%' ? `${Number(price)}%` : `€${Number(price).toFixed(1)}`;
};

export const getComboFinalPrice = (mode: PriceMode, sumOfParts: number, price: number): number | null => {
  if (!price || price <= 0) return null;
  switch (mode) {
    case 'percentage_off_sum':
      return sumOfParts > 0 ? (sumOfParts * price) / 100 : null;
    case 'fixed_amount_off_sum':
      return sumOfParts > 0 ? sumOfParts - price : null;
    case 'fixed_combo_price':
    default:
      return price;
  }
};

export const getPriceComparison = (sumOfParts: number, finalPrice: number | null): { amount: number; percent: number; isSaving: boolean } | null => {
  if (!sumOfParts || sumOfParts <= 0 || finalPrice == null) return null;
  const amount = sumOfParts - finalPrice;
  if (Math.abs(amount) < 0.005) return null;
  return { amount: Math.abs(amount), percent: Math.round((Math.abs(amount) / sumOfParts) * 100), isSaving: amount > 0 };
};

export const formatDaypartLabel = (daypart: DaypartRef): string => {
  const name = daypart.name || '';
  if (daypart.isAllDay || daypart.startTime == null || daypart.endTime == null) return name;

  const toHour = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins === 0 ? `${hours}` : `${hours}:${String(mins).padStart(2, '0')}`;
  };
  return `${name} ${toHour(daypart.startTime)}–${toHour(daypart.endTime)}`;
};

const restrictsDays = (component: ComboComponent) => (component.availableDays?.length || 0) > 0;

const restrictsDayparts = (component: ComboComponent) =>
  (component.daypart?.length || 0) > 0 && !component.daypart?.some((daypart) => daypart.isAllDay);

export const deriveAvailability = (components: ComboComponent[]): DerivedAvailability => {
  const empty: DerivedAvailability = { days: [], dayparts: [], isAllDay: true, allergens: [], isUnorderable: false };
  if (components.length === 0) return empty;

  const dayConstrained = components.filter(restrictsDays);
  const days = dayConstrained.length
    ? DAY_OPTIONS.map((option) => option.value).filter((day) => dayConstrained.every((component) => component.availableDays?.includes(day)))
    : DAY_OPTIONS.map((option) => option.value);

  const daypartConstrained = components.filter(restrictsDayparts);
  const dayparts = daypartConstrained.length
    ? (daypartConstrained[0].daypart || []).filter((daypart) =>
        daypartConstrained.every((component) => component.daypart?.some((other) => other._id === daypart._id))
      )
    : [];

  const allergens: AllergenRef[] = [];
  components.forEach((component) =>
    (component.allergens || []).forEach((allergen) => {
      if (allergen?._id && !allergens.some((existing) => existing._id === allergen._id)) allergens.push(allergen);
    })
  );

  return {
    days,
    dayparts,
    isAllDay: daypartConstrained.length === 0,
    allergens,
    isUnorderable: days.length === 0 || (daypartConstrained.length > 0 && dayparts.length === 0),
  };
};

export const describeDaysOverlap = (components: ComboComponent[], days: string[]): string => {
  if (components.length === 0) return '';
  const parts = components.map((component) => `${component.title} (${formatAvailableDays(component.availableDays) || 'no days set'})`);
  return `Overlap of all components. ${parts.join(' ∩ ')} → ${formatAvailableDays(days) || 'no overlap'}.`;
};

export const describeDaypartOverlap = (components: ComboComponent[], dayparts: DaypartRef[], isAllDay: boolean): string => {
  if (components.length === 0) return '';
  const parts = components.map((component) => {
    const names = (component.daypart || []).map((daypart) => daypart.name).join(', ');
    return `${component.title} (${names || 'no daypart set'})`;
  });
  const result = isAllDay ? 'All day' : dayparts.map((daypart) => daypart.name).join(', ') || 'no overlap';
  return `Overlap of all components. ${parts.join(' ∩ ')} → ${result}.`;
};
