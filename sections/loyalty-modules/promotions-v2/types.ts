export type PromotionStatus = 'active' | 'inactive';

export type PromotionType = 'extraPoints' | 'happyHour' | 'itemDiscount' | 'claimPromotion';

export type PromotionActiveDaysMode = 'all' | 'specific';

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type PromotionSortKey = 'title' | 'type' | 'status' | 'views' | 'favorites' | 'participations' | 'pointsAwarded';

export type PromotionSortOrder = 'asc' | 'desc' | '';

export interface Promotion {
  id: string;
  title: string;
  image: string;
  description: string;
  type: PromotionType;
  status: PromotionStatus;

  menuId?: string;
  qualifyingItemIds: string[];
  qualifyingItems: { id: string; name: string }[];
  extraPointsPerPurchase: number;
  pointsMultiplier: number;
  discountPercent: number;
  rewardName?: string;

  startDate: string;
  endDate: string;

  activeDaysMode?: PromotionActiveDaysMode;
  activeWeekdays: Weekday[];
  startTime?: string;
  endTime?: string;

  views: number;
  favorites: number;
  participations: number;
  pointsAwarded: number;
  viewToUseRate: number;
  avgPointsPerParticipant: number;
}

export interface PromotionStats {
  totalViews: number;
  totalFavorites: number;
  totalParticipations: number;
  pointsAwarded: number;
  mostEngaged: { title: string; uses: number } | null;
}

export interface PromotionsQuery {
  page: number;
  limit: number;
  search: string;
  type: PromotionType | '';
  startDateFrom?: Date;
  endDateTo?: Date;
  sortBy: PromotionSortKey | '';
  sortOrder: PromotionSortOrder;
}

export interface PromotionsMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface MenuItemOption {
  id: string;
  menuId: string;
  name: string;
}
