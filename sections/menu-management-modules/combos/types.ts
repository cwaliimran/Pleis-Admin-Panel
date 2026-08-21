export type ComboStatus = 'active' | 'inactive' | 'draft';

export type PriceMode = 'fixed_combo_price' | 'percentage_off_sum' | 'fixed_amount_off_sum';

export type SubCategoryRef = string | { _id: string; title?: string; status?: string } | null | undefined;

export interface ComboMenuRef {
  _id: string;
  title?: string;
  status?: string;
}

export type ComboMenuItemRef =
  | string
  | {
      _id: string;
      title?: string;
      basePrice?: number;
      image?: string;
      status?: string;
      menu?: ComboMenuRef;
    }
  | null
  | undefined;

export interface ComboMenuItemLine {
  menuItem: ComboMenuItemRef;
  quantity?: number;
}

export type ComboMenuItemEntry = ComboMenuItemLine | ComboMenuItemRef;

export interface ComboLine {
  id: string;
  ref: ComboMenuItemRef;
  quantity: number;
}

export interface ApplicableMenu {
  _id: string;
  title: string;
  status: string;
}

export interface DaypartRef {
  _id: string;
  name: string;
  isAllDay?: boolean;
  startTime?: number | null;
  endTime?: number | null;
}

export interface AllergenRef {
  _id: string;
  name: string;
}

export interface ComboComponent {
  _id: string;
  title: string;
  image?: string;
  basePrice: number;
  availableDays?: string[];
  daypart?: DaypartRef[];
  allergens?: AllergenRef[];
}

export interface ComboComponentLine {
  component: ComboComponent;
  quantity: number;
}

export interface DerivedAvailability {
  days: string[];
  dayparts: DaypartRef[];
  isAllDay: boolean;
  allergens: AllergenRef[];
  isUnorderable: boolean;
}

export interface ComboRecord {
  _id: string;
  name: string;
  subCategory: SubCategoryRef;
  description?: string;
  totalBasePrice: number;
  menuItems: ComboMenuItemEntry[];
  priceMode: PriceMode;
  price: number;
  status: ComboStatus;
  applicableMenus?: ApplicableMenu[];
  createdAt: string;
}

export interface CombosCount {
  total: number;
  active: number;
  inactive: number;
  notOrderable: number;
}

export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  combosCount?: CombosCount;
}

export interface SamplePageProps {
  data: ComboRecord[];
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
  item: ComboRecord;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

export type ComboFormMenuItem = {
  menuItem: string;
  quantity: number;
};

export type ComboFormValues = {
  name: string;
  subCategory: string;
  description?: string;
  menuItems: ComboFormMenuItem[];
  priceMode: PriceMode;
  price: string;
  status: ComboStatus;
};

export type ComboModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: ComboRecord | null;
  companyId?: string | null;
  userType: 'organizer' | 'super-admin';
};
