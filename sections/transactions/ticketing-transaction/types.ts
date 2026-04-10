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
  type?: string;
  onTypeChange?: (status: string) => void;
  paymentStatus?: string;
  onPaymentStatusChange?: (value: string) => void;
  validationStatus?: string;
  onValidationStatusChange?: (value: string) => void;
  paymentMethod?: string;
  onPaymentMethodChange?: (value: string) => void;
  event?: string;
  onEventChange?: (value: string) => void;
  transferredOrSentOnly?: boolean;
  onTransferredOrSentOnlyChange?: (value: boolean) => void;
  refundedOnly?: boolean;
  onRefundedOnlyChange?: (value: boolean) => void;
  minAmount?: string;
  onMinAmountChange?: (value: string) => void;
  maxAmount?: string;
  onMaxAmountChange?: (value: string) => void;
  // date?: Date;
  startDate?: Date;
  endDate?: Date;
  // onDateChange?: (date: Date | undefined) => void;
  onDateChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
  onResetFilters?: () => void;
}

export interface TableRowProps {
  item: any;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}
