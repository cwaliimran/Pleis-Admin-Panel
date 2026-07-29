export type PresetTypeStatus = 'active' | 'inactive';

export interface PresetTypeCategoryRef {
  _id: string;
  title: string;
  status?: string;
}

export interface PresetTypeSubcategoryRef {
  _id: string;
  name: string;
  status?: string;
}

export interface PresetTypeTypeRef {
  _id: string;
  name: string;
  status?: string;
}

export interface PresetTypeRecord {
  _id: string;
  image?: string;
  code: string;
  category: PresetTypeCategoryRef | null;
  subCategory: PresetTypeSubcategoryRef | null;
  type: PresetTypeTypeRef | null;
  name: string;
  description?: string;
  example?: string;
  status: PresetTypeStatus;
  createdAt: string;
}

export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface SamplePageProps {
  data: PresetTypeRecord[];
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
  item: PresetTypeRecord;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

export type PresetTypeFormValues = {
  image?: any;
  category: string;
  subCategory: string;
  type: string;
  name: string;
  description?: string;
  example?: string;
  status: PresetTypeStatus;
};

export type PresetTypeModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: PresetTypeRecord | null;
};
