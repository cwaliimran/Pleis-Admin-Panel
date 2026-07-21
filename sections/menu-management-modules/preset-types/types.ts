export type PresetTypeStatus = 'active' | 'inactive';

export interface PresetCategoryOption {
  _id: string;
  code: string;
  title: string;
  codePrefix: string;
}

export interface PresetSubcategoryOption {
  _id: string;
  title: string;
  categoryId: string;
}

export interface PresetTypeNameOption {
  _id: string;
  title: string;
  subcategoryId: string;
}

export interface PresetTypeRecord {
  _id: string;
  code: string;
  categoryId: string;
  subcategoryId: string;
  typeNameId: string;
  name?: string;
  description?: string;
  examples?: string;
  image?: string;
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
  categoryId?: string;
  onCategoryChange?: (categoryId: string) => void;
  subcategoryId?: string;
  onSubcategoryChange?: (subcategoryId: string) => void;
  onResetFilters?: () => void;
}

export interface TableRowProps {
  item: PresetTypeRecord;
  categories: PresetCategoryOption[];
  subcategories: PresetSubcategoryOption[];
  typeNames: PresetTypeNameOption[];
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

export type PresetTypeFormValues = {
  image?: any;
  categoryId: string;
  subcategoryId: string;
  typeNameId: string;
  name?: string;
  description?: string;
  examples?: string;
  status: PresetTypeStatus;
};

export type PresetTypeModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: PresetTypeRecord | null;
  categories: PresetCategoryOption[];
  subcategories: PresetSubcategoryOption[];
  typeNames: PresetTypeNameOption[];
  onSubmit: (values: PresetTypeFormValues) => void;
};
