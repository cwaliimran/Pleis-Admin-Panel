export type DiscountType = 'percentage' | 'fixed';
export type DiscountStatus = 'active' | 'inactive' | 'expired';

export interface DiscountMenuItemRef {
  _id: string;
  title: string;
  status?: string;
}

export interface DiscountRecord {
  _id: string;
  name: string;
  type: DiscountType;
  value: number;
  menuItems: DiscountMenuItemRef[];
  startDate: string;
  endDate: string;
  status: DiscountStatus;
  companyOrganizer?: string;
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
  name: string;
  type: DiscountType;
  value: string;
  menuItems: string[];
  startDateDate?: Date;
  startTime: string;
  endDateDate?: Date;
  endTime: string;
  status: 'active' | 'inactive';
};

export type DiscountModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: DiscountRecord | null;
  companyId?: string | null;
  userType: 'organizer' | 'super-admin';
};
