export interface SampleMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface SamplePageProps {
  page: any;
  title?: string;
  type?: string;
  data: any[];
  meta: SampleMeta;
  loading?: boolean;
  handleAcceptRequest?: (id: string) => void;
  handleRejectRequest?: (id: string) => void;
  handleUnLinkClub?: (id: string) => void;
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
  type?: string;
  handleAcceptRequest?: (id: string) => void;
  handleRejectRequest?: (id: string) => void;
  handleUnLinkClub?: (id: string) => void;
}

export interface ClubsViewProps {
  title: string;
  type: string;
}
