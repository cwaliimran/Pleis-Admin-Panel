export type MenuItemStatus = 'active' | 'inactive';
export type QuantityType = 'single' | 'combo';

export interface MenuOption {
  _id: string;
  title: string;
}

export interface CategoryOption {
  _id: string;
  title: string;
}

export interface SubcategoryOption {
  _id: string;
  title: string;
  categoryId: string;
}

export interface PresetTypeOption {
  _id: string;
  code: string;
  label: string;
}

export interface BrandOption {
  _id: string;
  label: string;
}

export interface MenuItemRecord {
  _id: string;
  title: string;
  amount?: string;
  image?: string;
  presetTypeId: string;
  brandId?: string;
  subcategoryId: string;
  menuIds: string[];
  description?: string;
  quantityType: QuantityType;
  comboItemIds?: string[];
  serving: string;
  price: number;
  taxPercent: number;
  availableDays: string[];
  daypart?: string[];
  dietTags?: string[];
  allergens?: string[];
  cuisine?: string;
  isRecommended?: boolean;
  isUpsell?: boolean;
  isToGo?: boolean;
  requiresConfirmation?: boolean;
  status: MenuItemStatus;
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
  data: MenuItemRecord[];
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
  menuId?: string;
  onMenuChange?: (menuId: string) => void;
  categoryId?: string;
  onCategoryChange?: (categoryId: string) => void;
  subcategoryId?: string;
  onSubcategoryChange?: (subcategoryId: string) => void;
  onResetFilters?: () => void;
  sortBy?: string;
  sortOrder?: string;
  onSortChange?: (sortBy: string, sortOrder: string) => void;
}

export interface TableRowProps {
  item: MenuItemRecord;
  menus: MenuOption[];
  subcategories: SubcategoryOption[];
  presetTypes: PresetTypeOption[];
  allItems: MenuItemRecord[];
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

export type MenuItemFormValues = {
  image?: any;
  title: string;
  amount?: string;
  presetTypeId: string;
  brandId?: string;
  subcategoryId: string;
  menuIds: string[];
  description?: string;
  quantityType: QuantityType;
  comboItemIds?: string[];
  serving: string;
  price: string;
  taxPercent: string;
  availableDays: string[];
  daypart?: string[];
  dietTags?: string[];
  allergens?: string[];
  cuisine?: string;
  isRecommended?: boolean;
  isUpsell?: boolean;
  isToGo?: boolean;
  requiresConfirmation?: boolean;
  status: MenuItemStatus;
};

export type MenuItemModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: MenuItemRecord | null;
  menus: MenuOption[];
  subcategories: SubcategoryOption[];
  presetTypes: PresetTypeOption[];
  brands: BrandOption[];
  allItems: MenuItemRecord[];
  onSubmit: (values: MenuItemFormValues) => void;
};
