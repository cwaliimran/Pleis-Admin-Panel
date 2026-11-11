export type LoyaltyScope = 'local' | 'global';

export type EntryType = 'earn' | 'spend' | 'reward_grant' | 'expire' | 'manual_adjustment' | 'reversal';

export type SourceType =
  | 'purchase'
  | 'challenge'
  | 'streak'
  | 'referral'
  | 'badge'
  | 'reservation_bonus'
  | 'manual_gift'
  | 'reward_redemption'
  | 'expiration'
  | 'order_cancelled'
  | 'bonus_correction';

export type EarningMode = 'seeded_by_local' | 'direct';

export type PromotionType = 'extra_points_for_item' | 'happy_hour';

export type RewardSource = 'points_redemption' | 'challenge' | 'streak' | 'manual_gift';

export type RewardKind = 'internal' | 'third_party';

export type CollectionStatus = 'collected' | 'uncollected';

export interface LoyaltyReward {
  label: string;
  kind: RewardKind;
  source: RewardSource;
  qrIssued: boolean;
  collection: CollectionStatus;
  collectedBy?: string;
  collectedVia?: string;
}

export interface LoyaltyDetail {
  entry: {
    type: EntryType;
    source: SourceType;
    description: string;
    pairedEntryNote: string;
    transactionId: string | null;
  };
  pointMath: {
    basePoints: number;
    promotionDelta: number;
    totalChange: number;
    balanceAfter: number;
    tierStatusAtTime: string;
    expires?: string;
  };
  reward: LoyaltyReward | null;
  rewardEmptyNote: string;
}

export interface LoyaltyEntry {
  id: string;
  transactionId: string | null;
  scope: LoyaltyScope;
  clubName?: string;
  userName: string;
  userClubTier: string;
  company?: string;
  organization?: string;
  venue?: string;
  entryType: EntryType;
  sourceType: SourceType;
  earningMode: EarningMode;
  sourceNote: string;
  description: string;
  points: number;
  pointsNote?: string;
  balanceAfter: number;
  balanceNote?: string;
  reward: LoyaltyReward | null;
  timestamp: string;
  expiresNote?: string;
  hasTransaction: boolean;
  hasPairedEntry: boolean;
  billAmount?: number;
  basePoints: number;
  hasPromotion: boolean;
  promotionType?: PromotionType;
  promotionDelta: number;
  tierAtTime?: string;
  statusAtTime?: string;
  tierBonus?: number;
  statusBonus?: number;
  capApplied: boolean;
  detail: LoyaltyDetail;
}
