export type MenuStatus = 'draft' | 'active' | 'inactive';

export interface MenuOrganization {
  _id: string;
  name: string;
}

// The `organization` reference on a menu record can come back as a raw id string or a populated
// object — and the shape of that object differs between the admin (by-company) and organizer
// list endpoints (`basicInfo.name` vs `title`). Never assume one shape — see menulist-utils.ts.
export type OrganizationRef = string | { _id: string; basicInfo?: { name?: string }; title?: string; name?: string } | null | undefined;

// Venues come back either as raw ids or populated `{ _id, title }` objects, same as `organization`.
export type VenueRef = string | { _id: string; title?: string; name?: string } | null | undefined;

export interface MenuListItem {
  _id: string;
  title: string;
  description?: string;
  organization: OrganizationRef;
  venue?: VenueRef[];
  startDate: string;
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
  organization?: string;
  onOrganizationChange?: (organization: string) => void;
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
  organization?: string;
  venue?: string[];
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
  organizationsLoading?: boolean;
  companyId?: string | null;
  userType: 'organizer' | 'super-admin';
};

export type DuplicateMenuModalProps = {
  open: boolean;
  selectedId?: string | null;
  onClose: () => void;
  organizations: MenuOrganization[];
  organizationsLoading?: boolean;
  companyId?: string | null;
  userType: 'organizer' | 'super-admin';
};
