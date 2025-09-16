// utils/sorting.ts
export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

// Generic sorting function that works with any data type
export const sortData = <T>(data: T[], sortConfig: SortConfig | null): T[] => {
  if (!sortConfig || !sortConfig.field || !sortConfig.direction) {
    return data;
  }

  return [...data].sort((a, b) => {
    const aValue = getNestedValue(a, sortConfig.field);
    const bValue = getNestedValue(b, sortConfig.field);

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    const result = compareValues(aValue, bValue);
    return sortConfig.direction === 'desc' ? -result : result;
  });
};

// Helper function to get nested object values (e.g., 'user.name')
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Compare different types of values
const compareValues = (a: any, b: any): number => {
  // Convert to strings for comparison if they're not numbers or dates
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }

  // Handle numbers
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  // Handle date strings (ISO format)
  const aDate = new Date(a);
  const bDate = new Date(b);
  if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
    return aDate.getTime() - bDate.getTime();
  }

  // Fallback to string comparison
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

// Pagination utility for frontend pagination
export const paginateData = <T>(
  data: T[],
  page: number,
  limit: number
): {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
} => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(data.length / limit),
      totalRecords: data.length,
      limit,
    },
  };
};
