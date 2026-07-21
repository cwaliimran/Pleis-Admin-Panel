export type AllergenStatus = 'active' | 'inactive';

export interface AllergenRecord {
  _id: string;
  code: string;
  name: string;
  status: AllergenStatus;
  createdAt: string;
}

export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface SamplePageProps {
  data: AllergenRecord[];
  meta: SampleMeta;
  totalCount: number;
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
  item: AllergenRecord;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

export type AllergenFormValues = {
  name: string;
  status: AllergenStatus;
};

export type AllergenModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: AllergenRecord | null;
  nextCode: string;
  onSubmit: (values: AllergenFormValues) => void;
};
