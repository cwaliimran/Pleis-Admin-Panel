export type SubcategoryTypeStatus = 'active' | 'inactive';

export interface SubcategoryTypeCategory {
  _id: string;
  title: string;
  status?: string;
}

export interface SubcategoryTypeSubcategory {
  _id: string;
  name: string;
  status?: string;
}

export interface SubcategoryTypeRecord {
  _id: string;
  name: string;
  subCategory: SubcategoryTypeSubcategory | null;
  category: SubcategoryTypeCategory | null;
  status: SubcategoryTypeStatus;
  createdAt: string;
}

export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface SamplePageProps {
  data: SubcategoryTypeRecord[];
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
  item: SubcategoryTypeRecord;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

export type SubcategoryTypeFormValues = {
  name: string;
  subCategory: string;
  status: SubcategoryTypeStatus;
};

export type SubcategoryTypeModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: SubcategoryTypeRecord | null;
};
