export type ServingStatus = 'active' | 'inactive';
export type ServingLevel2 = 'food' | 'drink' | null;

export interface ServingRecord {
  _id: string;
  code: string;
  level2: ServingLevel2;
  type: string;
  unit?: string;
  status: ServingStatus;
  createdAt: string;
}

export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface SamplePageProps {
  data: ServingRecord[];
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
  item: ServingRecord;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

export type ServingFormValues = {
  level2: string;
  type: string;
  unit: string;
  status: ServingStatus;
};

export type ServingModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: ServingRecord | null;
  nextCode: string;
  onSubmit: (values: ServingFormValues) => void;
};
