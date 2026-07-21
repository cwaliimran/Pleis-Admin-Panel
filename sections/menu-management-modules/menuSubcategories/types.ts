export type SubcategoryStatus = 'active' | 'inactive';

export interface CategoryOption {
  _id: string;
  title: string;
  code: string;
}

export interface MenuSubcategoryRecord {
  _id: string;
  title: string;
  icon?: string;
  categoryId: string;
  itemsCount: number;
  sortOrder: number;
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
  handleReorder?: (activeId: string, overId: string) => void;
  reorderDisabled?: boolean;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearch?: (search: string) => void;
  search?: string;
  limit?: number;
  status?: string;
  onStatusChange?: (status: string) => void;
  categoryId?: string;
  onCategoryChange?: (categoryId: string) => void;
  onResetFilters?: () => void;
}

export interface TableRowProps {
  item: MenuSubcategoryRecord;
  categories: CategoryOption[];
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
  dragDisabled?: boolean;
}

export type SubcategoryFormValues = {
  title: string;
  categoryId: string;
  sortOrder: string;
  status: SubcategoryStatus;
};

export type SubcategoryModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: MenuSubcategoryRecord | null;
  categories: CategoryOption[];
  nextSortOrder: number;
  onSubmit: (values: SubcategoryFormValues) => void;
};
