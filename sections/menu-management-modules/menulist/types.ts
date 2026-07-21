export type MenuStatus = 'draft' | 'active' | 'inactive';

export interface MenuOrganization {
  _id: string;
  name: string;
}

export interface MenuListItem {
  _id: string;
  title: string;
  description?: string;
  organizations: string[];
  validFrom: string;
  status: MenuStatus;
  createdAt: string;
}

export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface SamplePageProps {
  page: any;
  data: MenuListItem[];
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
  sortBy?: string;
  sortOrder?: string;
  onSortChange?: (sortBy: string, sortOrder: string) => void;
}

export interface TableRowProps {
  item: MenuListItem;
  organizations: MenuOrganization[];
  handleDelete?: (id: string) => void;
  handleDuplicate?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

export type MenuItemFormValues = {
  title?: string;
  description?: string;
  organizations?: string[];
  validFrom?: Date;
  status?: MenuStatus;
};

export type MenuItemModalProps = {
  open: boolean;
  selectedId?: string;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: MenuListItem | null;
  organizations: MenuOrganization[];
  onSubmit: (values: MenuItemFormValues) => void;
};

export type DuplicateMenuModalProps = {
  open: boolean;
  selectedId?: string | null;
  onClose: () => void;
  organizations: MenuOrganization[];
  onSubmit: (organizationId: string) => void;
};
