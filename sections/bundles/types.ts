export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface SamplePageProps {
  page: any;
  data: any[];
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
  onResetFilters?: () => void;
}

export interface TableRowProps {
  item: any;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

// types/bundle.types.ts

export interface BundleItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface TicketItem extends BundleItem {
  availableQuantity: number;
}

export interface ReservationItem extends BundleItem {
  capacity: number;
}

export interface PreorderItem extends BundleItem {
  category?: string;
}

export interface BundleFormValues {
  name: string;
  description: string;
  price: number;
  status: 'active' | 'inactive';
  tickets: BundleItem[];
  reservations: BundleItem[];
  preorders: BundleItem[];
}

export interface Bundle extends BundleFormValues {
  _id: string;
  originalPrice: number;
  discount: number;
  sold: number;
  createdAt: string;
  updatedAt: string;
}

export interface BundleModalProps {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: Bundle | null;
  onSubmit?: (data: Bundle) => void;
}

// constants/bundle.constants.ts

export const AVAILABLE_TICKETS: TicketItem[] = [
  {
    id: '1',
    name: 'General Admission',
    price: 50,
    quantity: 1,
    availableQuantity: 100,
  },
  {
    id: '2',
    name: 'VIP Ticket',
    price: 150,
    quantity: 1,
    availableQuantity: 50,
  },
  {
    id: '3',
    name: 'Early Bird',
    price: 40,
    quantity: 1,
    availableQuantity: 200,
  },
  {
    id: '4',
    name: 'Student Pass',
    price: 35,
    quantity: 1,
    availableQuantity: 150,
  },
];

export const AVAILABLE_RESERVATIONS: ReservationItem[] = [
  {
    id: '1',
    name: 'VIP Table',
    price: 150,
    quantity: 1,
    capacity: 8,
  },
  {
    id: '2',
    name: 'Standard Table',
    price: 100,
    quantity: 1,
    capacity: 6,
  },
  {
    id: '3',
    name: 'Lounge Area',
    price: 200,
    quantity: 1,
    capacity: 10,
  },
  {
    id: '4',
    name: 'Private Booth',
    price: 250,
    quantity: 1,
    capacity: 12,
  },
];

export const AVAILABLE_PREORDERS: PreorderItem[] = [
  {
    id: '1',
    name: 'Sprite Mint',
    price: 200,
    quantity: 1,
    category: 'Beverages',
  },
  {
    id: '2',
    name: 'Coca Cola 1.5L',
    price: 200,
    quantity: 1,
    category: 'Beverages',
  },
  {
    id: '3',
    name: 'Zinger Burger',
    price: 400,
    quantity: 1,
    category: 'Food',
  },
  {
    id: '4',
    name: 'Premium Bottle Service',
    price: 800,
    quantity: 1,
    category: 'Premium',
  },
  {
    id: '5',
    name: 'Appetizer Platter',
    price: 350,
    quantity: 1,
    category: 'Food',
  },
];

export const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
] as const;

export const DEFAULT_BUNDLE_VALUES: BundleFormValues = {
  name: '',
  description: '',
  price: 0,
  status: 'active',
  tickets: [],
  reservations: [],
  preorders: [],
};
