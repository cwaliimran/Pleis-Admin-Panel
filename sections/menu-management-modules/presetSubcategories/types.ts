export type SubcategoryStatus = 'active' | 'inactive';

export interface CategoryOption {
  _id: string;
  title: string;
}

export interface SubcategoryCategory {
  _id: string;
  title: string;
  status?: string;
}

export interface MenuSubcategoryRecord {
  _id: string;
  name: string;
  category: SubcategoryCategory | null;
  status: SubcategoryStatus;
  createdAt: string;
}

export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface SamplePageProps {
  data: MenuSubcategoryRecord[];
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
  categoryId?: string;
  onCategoryChange?: (categoryId: string) => void;
  sortBy?: string;
  sortOrder?: string;
  onSortChange?: (sortBy: string, sortOrder: string) => void;
  onResetFilters?: () => void;
}

export interface TableRowProps {
  item: MenuSubcategoryRecord;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

export type SubcategoryFormValues = {
  name: string;
  category: string;
  status: SubcategoryStatus;
};

export type SubcategoryModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: MenuSubcategoryRecord | null;
};
