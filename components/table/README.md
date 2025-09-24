# Table Sorting Implementation

This implementation provides a professional, production-ready table sorting system for React applications using TypeScript.

## Features

- ✅ **Multi-column sorting** with visual indicators
- ✅ **Three-state sorting**: Ascending → Descending → Original order
- ✅ **Type-aware sorting**: Handles strings, numbers, and dates automatically
- ✅ **Nested object support**: Sort by deeply nested properties using dot notation
- ✅ **Null/undefined handling**: Properly handles missing values
- ✅ **Accessible**: Keyboard navigation and screen reader support
- ✅ **Customizable**: Easy to configure which columns are sortable

## Components

### 1. TableHeadCustom Component

Enhanced table header component with sorting capabilities.

```tsx
import TableHeadCustom, {
  SortConfig,
} from '@/components/table/table-head-custom';

const headLabel = [
  {
    id: 'name',
    label: 'Name',
    align: 'left',
    sortable: true,
    sortKey: 'basicInfo.title', // Supports dot notation for nested properties
  },
  {
    id: 'organization',
    label: 'Organization',
    align: 'left',
    sortable: true,
    sortKey: 'basicInfo.organization.basicInfo.name',
  },
  { id: 'actions', label: 'Actions', align: 'left', sortable: false },
];

<TableHeadCustom
  headLabel={headLabel}
  sortConfig={sortConfig}
  onSort={handleSort}
/>;
```

### 2. useTableSort Hook

Custom hook that manages sorting state and logic.

```tsx
import { useTableSort } from '@/hooks/useTableSort';

const { sortedData, sortConfig, handleSort, resetSort } = useTableSort({
  data: originalData,
  defaultSortKey: 'basicInfo.title', // Optional: Set default sort column
  defaultSortOrder: 'asc', // Optional: Set default sort direction
});
```

## Usage Example

Here's a complete implementation example:

```tsx
'use client';

import { useTableSort } from '@/hooks/useTableSort';
import TableHeadCustom from '@/components/table/table-head-custom';

const MyTable = ({ data }) => {
  // Define sortable columns
  const headLabel = [
    { id: 'image', label: 'Image', align: 'left', sortable: false },
    {
      id: 'name',
      label: 'Name',
      align: 'left',
      sortable: true,
      sortKey: 'basicInfo.title',
    },
    {
      id: 'date',
      label: 'Date',
      align: 'left',
      sortable: true,
      sortKey: 'schedule.startDateTime',
    },
    {
      id: 'revenue',
      label: 'Revenue',
      align: 'right',
      sortable: true,
      sortKey: 'meta.revenue',
    },
  ];

  // Initialize sorting
  const { sortedData, sortConfig, handleSort } = useTableSort({
    data: data || [],
  });

  return (
    <Table>
      <TableHeadCustom
        headLabel={headLabel}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
      <TableBody>
        {sortedData.map((item) => (
          <TableRow key={item.id}>{/* Your table row content */}</TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

## Configuration Options

### Column Configuration

Each column in `headLabel` supports these properties:

- `id`: Unique identifier for the column
- `label`: Display text for the column header
- `align`: Text alignment ('left', 'center', 'right')
- `sortable`: Boolean indicating if the column should be sortable
- `sortKey`: Property path for sorting (supports dot notation for nested objects)

### Sorting Behavior

1. **First click**: Sort ascending (A-Z, 0-9, oldest-newest)
2. **Second click**: Sort descending (Z-A, 9-0, newest-oldest)
3. **Third click**: Return to original order

### Data Type Handling

The sorting system automatically detects and handles:

- **Strings**: Case-insensitive alphabetical sorting
- **Numbers**: Numeric comparison
- **Dates**: Chronological sorting (supports ISO strings and Date objects)
- **Null/Undefined**: Always sorted to the end

## Best Practices

1. **Use descriptive sortKey values**: Use dot notation to access nested properties
2. **Set appropriate defaults**: Consider setting default sort for frequently accessed columns
3. **Performance**: The hook uses `useMemo` for efficient re-rendering
4. **Accessibility**: All sorting controls are keyboard accessible and properly labeled

## Performance Notes

- Sorting is performed client-side on the current dataset
- For large datasets (>1000 items), consider server-side sorting
- The sorting algorithm is stable and preserves original order for equal values

## Troubleshooting

### Common Issues

1. **Sorting not working**: Ensure `sortKey` matches your data structure
2. **Wrong sort order**: Check if your data types are being detected correctly
3. **Performance issues**: Consider pagination or server-side sorting for large datasets

### Debugging

Enable debugging by logging the sort configuration:

```tsx
console.log('Sort Config:', sortConfig);
console.log('Original Data:', data);
console.log('Sorted Data:', sortedData);
```
