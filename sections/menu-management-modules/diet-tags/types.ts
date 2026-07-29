export type DietTagStatus = 'active' | 'inactive';

export interface DietTagRecord {
  _id: string;
  code: string;
  name: string;
  description: string;
  status: DietTagStatus;
  createdAt: string;
}

export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface SamplePageProps {
  data: DietTagRecord[];
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
  item: DietTagRecord;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

export type DietTagFormValues = {
  name: string;
  description: string;
  status: DietTagStatus;
};

export type DietTagModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: DietTagRecord | null;
};
