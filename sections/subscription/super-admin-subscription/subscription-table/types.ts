export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface SamplePageProps {
  page: any;
  data: any[];
  meta: SampleMeta;
  loading?: boolean;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
  handleViewRenewal?: (record: any) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearch?: (search: string) => void;
  search?: string;
  limit?: number;
  status?: string;
  onStatusChange?: (status: string) => void;
  billing?: string;
  onBillingChange?: (billing: string) => void;
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  subType?: string;
  onSubTypeChange?: (subType: string) => void;
  orgRange?: string;
  onOrgRangeChange?: (orgRange: string) => void;
  onResetFilters?: () => void;
}

export interface TableRowProps {
  item: any;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
  handleViewRenewal?: (record: any) => void;
}
