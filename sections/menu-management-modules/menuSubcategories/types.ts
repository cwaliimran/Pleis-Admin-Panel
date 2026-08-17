export type SubcategoryStatus = 'active' | 'inactive';

/** Populated on the list response; `null` for subcategories not tied to a single organization. */
export interface SubcategoryOrganization {
  _id: string;
  basicInfo?: { name?: string };
}

export interface SubcategoryCompanyOrganizer {
  _id: string;
  firstName?: string;
  lastName?: string;
}

export interface MenuSubcategoryRecord {
  _id: string;
  title: string;
  organization?: SubcategoryOrganization | null;
  companyOrganizer?: SubcategoryCompanyOrganizer | null;
  status: SubcategoryStatus;
  createdAt: string;
  updatedAt?: string;
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
  onResetFilters?: () => void;
  sortBy?: string;
  sortOrder?: string;
  onSortChange?: (sortBy: string, sortOrder: string) => void;
}

export interface TableRowProps {
  item: MenuSubcategoryRecord;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

export type SubcategoryFormValues = {
  title: string;
  /** Organization `_id`. */
  organization: string;
  status: SubcategoryStatus;
};

export type SubcategoryModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: MenuSubcategoryRecord | null;
  companyId?: string | null;
  userType: 'organizer' | 'super-admin';
};
