import { FILTER_SECTIONS } from './schema';
import { DateRangeValue, FilterFieldType, FilterValue, FilterValues, RangeValue } from './types';

const isFieldActive = (type: FilterFieldType, value: FilterValue): boolean => {
  switch (type) {
    case 'pill':
      return Array.isArray(value) && value.length > 0;
    case 'select':
    case 'tristate':
      return typeof value === 'string' && value !== 'any';
    case 'text':
      return typeof value === 'string' && value.trim() !== '';
    case 'range': {
      const range = value as RangeValue;
      return Boolean(range?.min) || Boolean(range?.max);
    }
    case 'date-range': {
      const range = value as DateRangeValue;
      return Boolean(range?.start) || Boolean(range?.end);
    }
    default:
      return false;
  }
};

export const countActiveFilters = (values: FilterValues): number =>
  FILTER_SECTIONS.reduce((count, section) => count + section.fields.filter((field) => isFieldActive(field.type, values[field.id])).length, 0);
