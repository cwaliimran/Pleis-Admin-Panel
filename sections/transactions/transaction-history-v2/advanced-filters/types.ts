export type FilterFieldType = 'pill' | 'select' | 'text' | 'range' | 'tristate' | 'date-range';

export type TriState = 'any' | 'yes' | 'no';

export interface RangeValue {
  min: string;
  max: string;
}

export interface DateRangeValue {
  start: string;
  end: string;
}

export interface FilterOption {
  value: string;
  label: string;
  superAdminOnly?: boolean;
}

export interface FilterFieldDef {
  id: string;
  label: string;
  type: FilterFieldType;
  options?: FilterOption[];
  optionsFor?: (values: FilterValues) => FilterOption[];
  disabledWhen?: (values: FilterValues) => boolean;
  resets?: string[];
  placeholder?: string;
  helperText?: string;
  superAdminOnly?: boolean;
  unit?: string;
}

export interface FilterSectionDef {
  id: string;
  label: string;
  superAdminOnly?: boolean;
  disabledWhen?: (values: FilterValues) => boolean;
  disabledHelperText?: string;
  fields: FilterFieldDef[];
}

export type FilterValue = string[] | string | RangeValue | DateRangeValue;

export type FilterValues = Record<string, FilterValue>;

export interface SavedFilterView {
  id: string;
  label: string;
  starred?: boolean;
  values: FilterValues;
}
