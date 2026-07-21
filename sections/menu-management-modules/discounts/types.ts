export type DiscountType = 'percentage' | 'fixed';
export type DiscountStatus = 'active' | 'expired';

export interface DiscountRecord {
  _id: string;
  title: string;
  description?: string;
  type: DiscountType;
  value: number;
  itemIds: string[];
  startDate: string;
  endDate: string;
  status: DiscountStatus;
  createdAt: string;
}

export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface SamplePageProps {
  data: DiscountRecord[];
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
  type?: string;
  onTypeChange?: (type: string) => void;
  startDate?: Date;
  onStartDateChange?: (date: Date | undefined) => void;
  endDate?: Date;
  onEndDateChange?: (date: Date | undefined) => void;
  sortBy?: string;
  sortOrder?: string;
  onSortChange?: (sortBy: string, sortOrder: string) => void;
  onResetFilters?: () => void;
}

export interface TableRowProps {
  item: DiscountRecord;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

export type DiscountFormValues = {
  title: string;
  description?: string;
  type: DiscountType;
  value: string;
  itemIds: string[];
  startDateDate?: Date;
  startTime: string;
  endDateDate?: Date;
  endTime: string;
};

export type DiscountModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: DiscountRecord | null;
  onSubmit: (values: DiscountFormValues) => void;
};
