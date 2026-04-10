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
  paymentStatus?: string;
  onPaymentStatusChange?: (value: string) => void;
  paymentMethod?: string;
  onPaymentMethodChange?: (value: string) => void;
  minimalSpendRes?: string;
  onMinimalSpendResChange?: (value: string) => void;
  transactionStartDate?: Date;
  transactionEndDate?: Date;
  onTransactionDateRangeChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
  reservationStartDate?: Date;
  reservationEndDate?: Date;
  onReservationDateRangeChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
  reservationDate?: Date;
  onReservationDateChange?: (date: Date | undefined) => void;
  timeStart?: string;
  onTimeStartChange?: (value: string) => void;
  timeEnd?: string;
  onTimeEndChange?: (value: string) => void;
  reservationTimeline?: string;
  onReservationTimelineChange?: (value: string) => void;
  prepayOnly?: boolean;
  onPrepayOnlyChange?: (value: boolean) => void;
  ticketRequiredOnly?: boolean;
  onTicketRequiredOnlyChange?: (value: boolean) => void;
  cancelledOnly?: boolean;
  onCancelledOnlyChange?: (value: boolean) => void;
  noShowOnly?: boolean;
  onNoShowOnlyChange?: (value: boolean) => void;
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  onResetFilters?: () => void;
}

export interface TableRowProps {
  item: any;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}
