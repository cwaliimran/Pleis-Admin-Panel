export type BrandStatus = 'active' | 'inactive';

export interface BrandRecord {
  _id: string;
  name: string;
  brandOwner: string;
  status: BrandStatus;
  createdAt: string;
}

export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface SamplePageProps {
  data: BrandRecord[];
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
  item: BrandRecord;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

export type BrandFormValues = {
  name: string;
  brandOwner: string;
  status: BrandStatus;
};

export type BrandModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: BrandRecord | null;
};
