export type DaypartStatus = 'active' | 'inactive';

export interface DaypartRecord {
  _id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  isAllDay?: boolean;
  status: DaypartStatus;
  createdAt: string;
}

export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface SamplePageProps {
  data: DaypartRecord[];
  meta: SampleMeta;
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
  sortBy?: string;
  sortOrder?: string;
  onSortChange?: (sortBy: string, sortOrder: string) => void;
  onResetFilters?: () => void;
}

export interface TableRowProps {
  item: DaypartRecord;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

export type DaypartFormValues = {
  name: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  status: DaypartStatus;
};

export type DaypartModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: DaypartRecord | null;
};
