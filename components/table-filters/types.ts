export interface FilterOption {
  value: string;
  label: string;
}

export interface SelectFilter {
  id: string;
  label: string;
  placeholder: string;
  options: FilterOption[];
  value?: string;
  onChange: (value: string) => void;
}

export interface DateFilter {
  id: string;
  label?: string;
  placeholder: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

export interface DateRangeFilter {
  startDate: {
    id: string;
    label?: string;
    placeholder: string;
    value?: Date;
    onChange: (date: Date | undefined) => void;
  };
  endDate: {
    id: string;
    label?: string;
    placeholder: string;
    value?: Date;
    onChange: (date: Date | undefined) => void;
  };
}

export interface SearchFilter {
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
}

export interface ResetFilter {
  onReset: () => void;
  showResetButton?: boolean;
}

export interface TableFiltersProps {
  dateFilter?: DateFilter;
  dateRangeFilter?: DateRangeFilter;
  selectFilters?: SelectFilter[];
  searchFilter?: SearchFilter;
  resetFilter?: ResetFilter;
  className?: string;
  filtersAlignment?: "left" | "right" | "center";
}
