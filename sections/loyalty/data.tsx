// Type definitions
export interface TabData {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface LoyaltyCardData {
  title: string;
  amount: number;
  raise?: string;
}

export interface LoyaltyPoints {
  id: number;
  name: string;
  points: number;
}

export interface RewardData {
  id: number;
  name: string;
  points: number;
  description: string;
  claimRewards: number;
}

export interface EngagedMember {
  name: string;
  points: number;
  level: string;
  tier: string;
  lifeTimeValue: string;
}

export interface LoyaltyListData {
  item: string;
  points: number;
  user: string;
  date: string;
  amount: number;
  total: number;
}

// Data exports
export const loyaltTabsData: TabData[] = [
  {
    value: "month",
    label: "Monthly",
  },
  {
    value: "week",
    label: "Weekly",
  },
  {
    value: "daily",
    label: "Daily",
  },
  {
    value: "year",
    label: "Yearly",
  },
];

export const tabsData: TabData[] = [
  {
    value: "overview",
    label: "Overview",
  },
  {
    value: "rewards",
    label: "Rewards",
  },
  {
    value: "tiers",
    label: "Tiers",
  },
  {
    value: "promotions&challenges",
    label: "Promotions&Challenges",
  },
];

export const loyaltyCardData: LoyaltyCardData[] = [
  {
    title: "Total Members",
    amount: 1234,
    raise: "15%",
  },
  {
    title: "Total Rewards",
    amount: 4234,
    raise: "12%",
  },
  {
    title: "Total Tiers",
    amount: 234,
  },
  {
    title: "Total Challenges",
    amount: 5432,
  },
];

export const loyaltPoints: LoyaltyPoints[] = [
  {
    id: 1,
    name: "Total points earned",
    points: 5000,
  },
  {
    id: 2,
    name: "Total points redeemed",
    points: 1200,
  },
  {
    id: 3,
    name: "Total points available",
    points: 3800,
  },
  {
    id: 4,
    name: "Total points expired",
    points: 200,
  },
];

export const rewardData: RewardData[] = [
  {
    id: 1,
    name: "Free Coffee",
    points: 100,
    description: "Get a free coffee on your next visit.",
    claimRewards: 50,
  },
  {
    id: 2,
    name: "Discount Voucher",
    points: 200,
    description: "Receive a 20% discount voucher for your next purchase.",
    claimRewards: 100,
  },
  {
    id: 3,
    name: "Exclusive Merchandise",
    points: 500,
    description: "Claim exclusive merchandise available only to loyal members.",
    claimRewards: 200,
  },
  {
    id: 4,
    name: "VIP Event Access",
    points: 1000,
    description:
      "Get VIP access to our upcoming events and special gatherings.",
    claimRewards: 300,
  },
  {
    id: 5,
    name: "Gift Card",
    points: 1500,
    description: "Receive a gift card to use at your favorite store.",
    claimRewards: 400,
  },
  {
    id: 6,
    name: "Charity Donation",
    points: 2000,
    description: "Donate your points to a charity of your choice.",
    claimRewards: 500,
  },
];

export const engagedMembers: EngagedMember[] = [
  {
    name: "John Doe",
    points: 1500,
    level: "Premium",
    tier: "Tier 1",
    lifeTimeValue: "60%",
  },
  {
    name: "Jane Smith",
    points: 1200,
    level: "Gold",
    tier: "Tier 2",
    lifeTimeValue: "50%",
  },
  {
    name: "Alice Johnson",
    points: 900,
    level: "Silver",
    tier: "Tier 3",
    lifeTimeValue: "40%",
  },
  {
    name: "Bob Brown",
    points: 700,
    level: "Bronze",
    tier: "Tier 4",
    lifeTimeValue: "30%",
  },
  {
    name: "Charlie White",
    points: 500,
    level: "Basic",
    tier: "Tier 5",
    lifeTimeValue: "20%",
  },
  {
    name: "David Green",
    points: 300,
    level: "New",
    tier: "Tier 6",
    lifeTimeValue: "10%",
  },
  {
    name: "Eve Black",
    points: 200,
    level: "New",
    tier: "Tier 7",
    lifeTimeValue: "5%",
  },
];

export const rewardsTabs: TabData[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "transaction",
    label: "Transaction",
  },
  {
    value: "refund",
    label: "Refund",
  },
];

export const loyaltylistData: LoyaltyListData[] = [
  {
    item: "Free Coffee",
    points: 100,
    user: "John Doe",
    date: "2023-10-01",
    amount: 50,
    total: 1000,
  },
  {
    item: "Discount Voucher",
    points: 200,
    user: "Jane Smith",
    date: "2023-10-02",
    amount: 100,
    total: 2000,
  },
  {
    item: "Exclusive Merchandise",
    points: 500,
    user: "Alice Johnson",
    date: "2023-10-03",
    amount: 200,
    total: 5000,
  },
  {
    item: "VIP Event Access",
    points: 1000,
    user: "Bob Brown",
    date: "2023-10-04",
    amount: 300,
    total: 10000,
  },
  {
    item: "Gift Card",
    points: 1500,
    user: "Charlie White",
    date: "2023-10-05",
    amount: 400,
    total: 15000,
  },
  {
    item: "Charity Donation",
    points: 2000,
    user: "David Green",
    date: "2023-10-06",
    amount: 500,
    total: 20000,
  },
];
