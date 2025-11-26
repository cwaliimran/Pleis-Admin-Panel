export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface SamplePageProps {
  page: any;
  global?: boolean;
  data: any[];
  meta: SampleMeta;
  userType: 'super-admin' | 'organizer';
  loading?: boolean;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearch?: (search: string) => void;
  search?: string;
  limit?: number;
  status?: string;
  onStatusChange?: (status: string) => void;
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  onResetFilters?: () => void;
}

export interface TableRowProps {
  item: any;
  global?: boolean;
  userType: 'super-admin' | 'organizer';
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}
