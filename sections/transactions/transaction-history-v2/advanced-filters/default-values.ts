import { FILTER_SECTIONS } from './schema';
import { FilterValue, FilterValues } from './types';

export const defaultValueForType = (type: string): FilterValue => {
  switch (type) {
    case 'pill':
      return [];
    case 'select':
      return 'any';
    case 'tristate':
      return 'any';
    case 'range':
      return { min: '', max: '' };
    case 'date-range':
      return { start: '', end: '' };
    case 'text':
    default:
      return '';
  }
};

export const getDefaultFilterValues = (): FilterValues => {
  const values: FilterValues = {};
  FILTER_SECTIONS.forEach((section) => {
    section.fields.forEach((field) => {
      values[field.id] = defaultValueForType(field.type);
    });
  });
  return values;
};
