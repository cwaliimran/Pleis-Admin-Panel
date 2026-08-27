export type SubcategoryStatus = 'active' | 'inactive';

export interface SubcategoryCompanyOrganizer {
  _id: string;
  firstName?: string;
  lastName?: string;
}

export interface MenuSubcategoryRecord {
  _id: string;
  title: string;
  companyOrganizer?: SubcategoryCompanyOrganizer | null;
  order?: number;
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
  handleReorder?: (activeId: string, overId: string) => void;
  reorderDisabled?: boolean;
  checkingId?: string | null;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearch?: (search: string) => void;
  search?: string;
  limit?: number;
  status?: string;
  onStatusChange?: (status: string) => void;
  onResetFilters?: () => void;
}

export interface TableRowProps {
  item: MenuSubcategoryRecord;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
  dragDisabled?: boolean;
  deleteChecking?: boolean;
}

export type SubcategoryFormValues = {
  title: string;
  order: string;
  status: SubcategoryStatus;
};

export interface SubcategoryMenuItem {
  _id: string;
  title: string;
  status?: string;
}

export type SubcategoryTransferFormValues = {
  targetSubCategory: string;
};

export type SubcategoryTransferModalProps = {
  open: boolean;
  onClose: () => void;
  subcategory: MenuSubcategoryRecord | null;
  companyId?: string | null;
  userType: 'organizer' | 'super-admin';
  onTransferred?: () => void;
};

export type SubcategoryModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: MenuSubcategoryRecord | null;
  companyId?: string | null;
  userType: 'organizer' | 'super-admin';
  nextOrder: number;
};
