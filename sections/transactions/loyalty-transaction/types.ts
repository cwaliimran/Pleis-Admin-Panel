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
  sourceEntity?: string;
  onSourceEntityChange?: (value: string) => void;
  limit?: number;
  direction?: string;
  onDirectionChange?: (value: string) => void;
  sourceType?: string;
  onSourceTypeChange?: (value: string) => void;
  startPoints?: string;
  onStartPointsChange?: (value: string) => void;
  endPoints?: string;
  onEndPointsChange?: (value: string) => void;
  startBalance?: string;
  onStartBalanceChange?: (value: string) => void;
  endBalance?: string;
  onEndBalanceChange?: (value: string) => void;
  campaign?: string;
  onCampaignChange?: (value: string) => void;
  referralOnly?: boolean;
  onReferralOnlyChange?: (value: boolean) => void;
  purchaseBasedOnly?: boolean;
  onPurchaseBasedOnlyChange?: (value: boolean) => void;
  manualAdjustmentsOnly?: boolean;
  onManualAdjustmentsOnlyChange?: (value: boolean) => void;
  streakBasedOnly?: boolean;
  onStreakBasedOnlyChange?: (value: boolean) => void;
  challengeBasedOnly?: boolean;
  onChallengeBasedOnlyChange?: (value: boolean) => void;
  promotionBasedOnly?: boolean;
  onPromotionBasedOnlyChange?: (value: boolean) => void;
  rewardRedemptionOnly?: boolean;
  onRewardRedemptionOnlyChange?: (value: boolean) => void;
  startDate?: Date;
  endDate?: Date;
  onDateChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
  onResetFilters?: () => void;
  isSuperAdmin?: boolean;
}

export interface TableRowProps {
  item: any;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}
