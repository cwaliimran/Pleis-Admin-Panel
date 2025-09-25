import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import TableHeadCustom from '@/components/table/table-head-custom';
import { useTableSort } from '@/hooks/useTableSort';

// Example data structure
interface ExampleData {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  salary: number;
  department: {
    name: string;
    location: string;
  };
}

// Example usage component
const SortableTableExample: React.FC<{ data: ExampleData[] }> = ({ data }) => {
  // Define column configuration with sorting
  const headLabel = [
    {
      id: 'name',
      label: 'Full Name',
      align: 'left',
      sortable: true,
      sortKey: 'name',
    },
    {
      id: 'email',
      label: 'Email',
      align: 'left',
      sortable: true,
      sortKey: 'email',
    },
    {
      id: 'role',
      label: 'Role',
      align: 'left',
      sortable: true,
      sortKey: 'role',
    },
    {
      id: 'department',
      label: 'Department',
      align: 'left',
      sortable: true,
      sortKey: 'department.name', // nested property
    },
    {
      id: 'joinDate',
      label: 'Join Date',
      align: 'left',
      sortable: true,
      sortKey: 'joinDate',
    },
    {
      id: 'salary',
      label: 'Salary',
      align: 'right',
      sortable: true,
      sortKey: 'salary',
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      sortable: false,
    },
  ];

  // Initialize sorting with default configuration
  const { sortedData, sortConfig, handleSort } = useTableSort({
    data,
    defaultSortKey: 'name', // Default sort by name
    defaultSortOrder: 'asc',
  });

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="rounded-lg border">
      <Table className="w-full">
        <TableHeadCustom
          headLabel={headLabel}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
        <TableBody>
          {sortedData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell className="capitalize">{item.role}</TableCell>
              <TableCell>{item.department.name}</TableCell>
              <TableCell>{formatDate(item.joinDate)}</TableCell>
              <TableCell className="text-right">
                {formatSalary(item.salary)}
              </TableCell>
              <TableCell className="text-center">
                <button className="text-blue-600 hover:underline">Edit</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SortableTableExample;
