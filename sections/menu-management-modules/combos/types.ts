/** `draft` isn't user-selectable — it's forced on save when the components have no orderable overlap. */
export type ComboStatus = 'active' | 'inactive' | 'draft';

/**
 * Mirrors the backend `PriceMode` enum. What `price` means depends on the mode — see
 * `getComboFinalPrice`: a final €, a percentage *of* the sum charged, or a € amount taken off it.
 */
export type PriceMode = 'fixed_combo_price' | 'percentage_off_sum' | 'fixed_amount_off_sum';

// Reference fields on a combo record can come back as a raw id string or a populated object —
// see the shape-inconsistency note in menuItems module. Never assume one shape.
export type SubCategoryRef = string | { _id: string; name?: string; category?: string; status?: string } | null | undefined;

export type ComboMenuItemRef =
  | string
  | {
      _id: string;
      title?: string;
      basePrice?: number;
      image?: string;
      status?: string;
    }
  | null
  | undefined;

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

/**
 * A menu item resolved to the full shape the modal needs: the combo's own `menuItems` only carry
 * title/price/image, so availability is read off the menu-items list query instead.
 */
export interface ComboComponent {
  _id: string;
  title: string;
  image?: string;
  basePrice: number;
  availableDays?: string[];
  daypart?: DaypartRef[];
  allergens?: AllergenRef[];
}

/** Availability the combo inherits from its components — intersect for days/dayparts, union for allergens. */
export interface DerivedAvailability {
  days: string[];
  dayparts: DaypartRef[];
  /** No component restricts the daypart (all are "All Day" or unset), so the combo spans every daypart. */
  isAllDay: boolean;
  allergens: AllergenRef[];
  /** Components share no common day or daypart, so the combo could never be ordered. */
  isUnorderable: boolean;
}

export interface ComboRecord {
  _id: string;
  name: string;
  subCategory: SubCategoryRef;
  description?: string;
  menuItems: ComboMenuItemRef[];
  priceMode: PriceMode;
  price: number;
  status: ComboStatus;
  applicableMenus?: ApplicableMenu[];
  createdAt: string;
}

export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
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

export type ComboFormValues = {
  name: string;
  subCategory: string;
  description?: string;
  menuItems: string[];
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
