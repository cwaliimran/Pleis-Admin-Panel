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
  handleDuplicate?: (id: string) => void;
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
  handleDelete?: (id: string) => void;
  handleDuplicate?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

export type MenuItemFormValues = {
  image?: any;
  title?: string;
  organization?: string;
  description?: string;
  status?: string;
};

export type MenuItemModalProps = {
  open: boolean;
  selectedId?: string;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
};
