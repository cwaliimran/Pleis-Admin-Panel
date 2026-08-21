export type MenuItemStatus = 'active' | 'inactive';

/** Lightweight `{_id, code, name}` shape returned by preset-menu list endpoints when `summary=true`. */
export interface SummaryOption {
  _id: string;
  code?: string;
  name: string;
}

/**
 * The API is inconsistent about which reference fields it populates: some come back as a raw ID
 * string, others as a populated object — and it can differ per field, and apparently per record.
 * It's also inconsistent about array fields (dietTags/allergens): sometimes a proper array,
 * sometimes a single bare object. Every reference field is typed to accept any of these shapes;
 * use `getRefId`/`getRefLabel`/`toRefArray` (menuItems-utils.ts) rather than assuming one.
 */
export type RefValue =
  | string
  | { _id: string; title?: string; name?: string; type?: string; unit?: string; code?: string; level2?: string }
  | null
  | undefined;

export interface MenuItemRecord {
  _id: string;
  image?: string;
  title: string;
  description?: string;
  type?: string;
  category?: RefValue;
  subCategory?: RefValue;
  basePrice: number;
  discountPrice?: number;
  taxPercent: number;
  menu?: RefValue;
  startTime?: string | null;
  endTime?: string | null;
  status: MenuItemStatus;
  presetType?: RefValue;
  brand?: RefValue;
  amountQuantity?: string;
  quantityType: 'single';
  comboItems: string[];
  servingSize?: RefValue;
  /** Populated companion to `servingSize` (same id) that the API sends separately — display-only. */
  serving?: RefValue;
  availableDays: string[];
  /** API sometimes sends a single object instead of an array — normalize with `toRefArray` before use. */
  daypart?: RefValue[] | RefValue;
  dietTags: RefValue[] | RefValue;
  allergens: RefValue[] | RefValue;
  cuisine?: string;
  isRecommended?: boolean;
  isTogo?: boolean;
  isRequiresOrderConfirmation?: boolean;
  /** Sent to the API as a string ('true'/'false'), so it may come back as either. */
  upSellItem?: boolean | string;
  createdAt: string;
}

export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

/**
 * Name lookups keyed by _id, built once in the view and passed down to the table/row so IDs never
 * leak into the UI. Only covers references the table actually displays (Subcategory/Menu/Serving) —
 * presetType/brand/daypart/dietTags/allergens aren't shown in the table, so they're fetched inside
 * the modal only, when it's open.
 */
export interface MenuItemLookups {
  subCategories: Map<string, string>;
  menus: Map<string, string>;
  servingSizes: Map<string, string>;
}

export interface SamplePageProps {
  data: MenuItemRecord[];
  meta: SampleMeta;
  lookups: MenuItemLookups;
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
  menuId?: string;
  onMenuChange?: (menuId: string) => void;
  subCategoryId?: string;
  onSubCategoryChange?: (subCategoryId: string) => void;
  onResetFilters?: () => void;
  sortBy?: string;
  sortOrder?: string;
  onSortChange?: (sortBy: string, sortOrder: string) => void;
}

export interface TableRowProps {
  item: MenuItemRecord;
  lookups: MenuItemLookups;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

export type MenuItemFormValues = {
  image?: any;
  title: string;
  description?: string;
  subCategory: string;
  basePrice: string;
  taxPercent: string;
  menus: string[];
  startTime?: string;
  endTime?: string;
  status: MenuItemStatus;
  presetType: string;
  brand?: string;
  amountQuantity?: string;
  servingSize?: string;
  availableDays: string[];
  dayparts: string[];
  dietTags: string[];
  allergens: string[];
  cuisine?: string;
  isRecommended: boolean;
  upSellItem: boolean;
  isTogo: boolean;
  isRequiresOrderConfirmation: boolean;
};

export type MenuItemModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: MenuItemRecord | null;
  companyId?: string | null;
  userType: 'organizer' | 'super-admin';
  /** Used only to show the correct label for a selected reference that isn't on the dropdown's first fetched page. */
  lookups?: MenuItemLookups;
};
