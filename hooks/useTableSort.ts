import { useState, useCallback, useMemo } from 'react';
import { SortConfig, SortOrder } from '@/components/table/table-head-custom';

export interface UseTableSortProps<T> {
  data: T[];
  defaultSortKey?: string | null;
  defaultSortOrder?: SortOrder;
}

export interface UseTableSortReturn<T> {
  sortedData: T[];
  sortConfig: SortConfig;
  handleSort: (key: string) => void;
  resetSort: () => void;
}

export const useTableSort = <T extends Record<string, any>>({
  data,
  defaultSortKey = null,
  defaultSortOrder = null,
}: UseTableSortProps<T>): UseTableSortReturn<T> => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: defaultSortKey,
    direction: defaultSortOrder,
  });

  const handleSort = useCallback((key: string) => {
    setSortConfig((prevConfig) => {
      // If clicking on the same column
      if (prevConfig.key === key) {
        if (prevConfig.direction === 'asc') {
          return { key, direction: 'desc' };
        } else if (prevConfig.direction === 'desc') {
          return { key: null, direction: null }; // Reset to original order
        } else {
          return { key, direction: 'asc' };
        }
      }
      // If clicking on a different column
      return { key, direction: 'asc' };
    });
  }, []);

  const resetSort = useCallback(() => {
    setSortConfig({ key: null, direction: null });
  }, []);

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key!);
      const bValue = getNestedValue(b, sortConfig.key!);

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

      // Handle different data types
      return compareValues(aValue, bValue, sortConfig.direction);
    });
  }, [data, sortConfig]);

  return {
    sortedData,
    sortConfig,
    handleSort,
    resetSort,
  };
};

// Helper function to get nested object values using dot notation
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current?.[key];
  }, obj);
};

// Helper function to compare values with proper type handling
const compareValues = (
  aValue: any,
  bValue: any,
  direction: SortOrder
): number => {
  // Handle dates
  if (isValidDate(aValue) && isValidDate(bValue)) {
    const aDate = new Date(aValue).getTime();
    const bDate = new Date(bValue).getTime();
    return direction === 'asc' ? aDate - bDate : bDate - aDate;
  }

  // Handle numbers
  if (isNumeric(aValue) && isNumeric(bValue)) {
    const aNum = parseFloat(aValue);
    const bNum = parseFloat(bValue);
    return direction === 'asc' ? aNum - bNum : bNum - aNum;
  }

  // Handle strings (default case)
  const aStr = String(aValue).toLowerCase().trim();
  const bStr = String(bValue).toLowerCase().trim();

  if (aStr < bStr) {
    return direction === 'asc' ? -1 : 1;
  }
  if (aStr > bStr) {
    return direction === 'asc' ? 1 : -1;
  }
  return 0;
};

// Helper function to check if a value is a valid date
const isValidDate = (value: any): boolean => {
  if (!value) return false;
  const date = new Date(value);
  return !isNaN(date.getTime()) && value.toString().length > 4; // Avoid treating years as dates
};

// Helper function to check if a value is numeric
const isNumeric = (value: any): boolean => {
  if (value === null || value === undefined || value === '') return false;
  return !isNaN(parseFloat(value)) && isFinite(value);
};
