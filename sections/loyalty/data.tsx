// Type definitions
export interface TabData {
  value: string;
  label: string;
  link?: string;
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
  limitedAvail: boolean;
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
    value: 'month',
    label: 'Monthly',
  },
  {
    value: 'week',
    label: 'Weekly',
  },
  {
    value: 'daily',
    label: 'Daily',
  },
  {
    value: 'year',
    label: 'Yearly',
  },
];

export const tabsData: TabData[] = [
  {
    value: 'overview',
    link: 'overview',
    label: 'Overview',
  },
  {
    value: 'rewards',
    link: 'rewards',
    label: 'Rewards',
  },
  {
    value: 'tiers',
    link: 'tiers',
    label: 'Tiers',
  },
  {
    value: 'promotions',
    link: 'promotions',
    label: 'Promotions',
  },
  {
    value: 'challenges',
    link: 'challenges',
    label: 'Challenges',
  },
];

export const memberCardHeaderData: LoyaltyCardData[] = [
  {
    title: 'Stat 1',
    amount: 22,
    raise: '15%',
  },
  {
    title: 'Stat 2',
    amount: 22,
    raise: '12%',
  },
  {
    title: 'Manually gift loyalty points',
    amount: 432,
  },
  {
    title: 'Tier',
    amount: 22,
    raise: 'gold',
  },
];

export const reservationCardHeaderData = [
  {
    title: 'Total Reservations',
    amount: 1234,
  },
  {
    title: 'Confirmed Reservations',
    amount: 980,
  },
  {
    title: 'Pending Reservations',
    amount: 150,
  },
  {
    title: 'Rejected / Expired Reservations',
    amount: 104,
    percentage: '8%',
  },
  {
    title: 'Reservation Conversion Rate',
    amount: '87%',
  },
  {
    title: 'Total Revenue from Reservations',
    amount: '€12,340',
  },
  {
    title: 'Prepay Revenue',
    amount: '€4,520',
  },
  {
    title: 'Average Reservation Value',
    amount: '€125',
  },
  {
    title: 'Average Group Size',
    amount: 3.2,
  },
  {
    title: 'Total Capacity Reserved',
    amount: '820 / 1000',
  },
  {
    title: 'Remaining Available Spots',
    amount: 180,
  },
];

export const orderAnalyticsData = [
  {
    title: 'Total Orders',
    amount: 1542,
    raise: '+12%', // Example trend data
  },
  {
    title: 'Total Revenue',
    amount: '€24,500',
    raise: '+8%',
  },
  {
    title: 'Revenue after Commission',
    amount: '€22,050',
    // note: calculated as Total - Commission
  },
  {
    title: 'Average Order Value (AOV)',
    amount: '€15.90',
  },
  {
    title: 'Orders Frequency',
    amount: '45 / hr',
    // menu: true, // Enabled logic to toggle between Hour/Day in UI
  },
  {
    title: 'Most Ordered Category',
    amount: 'Drinks',
    // String value instead of number
  },
  {
    title: 'Total Items Sold',
    amount: 4320,
  },
  {
    title: 'Limited-Time Items Sold',
    amount: 320,
    // raise: 'New',
  },
];

export const globalNotificationData = [
  {
    title: 'Total Notifications Sent',
    amount: 10000,
    raise: '15%',
  },
  {
    title: 'Users Reached',
    amount: 3230,
  },
  {
    title: 'Total Unique Users Clicked',
    amount: 5432,
    raise: '8%',
  },
  {
    title: 'User Clicked %',
    amount: 5802,
    raise: '12%',
  },
  {
    title: 'Recipients Clicked %',
    amount: 5432,
    percent: true,
  },
];

export const transactionHistoryData: LoyaltyCardData[] = [
  {
    title: 'Total Transactions',
    amount: 10000,
    raise: '15%',
  },
  {
    title: 'Organizer Payouts',
    amount: 210000,
    raise: '12%',
  },
  {
    title: 'PLEIS Commission',
    amount: 8000,
    raise: '11%',
  },
  {
    title: 'Service Fees',
    amount: 5000,
    // raise: '15%',
  },
];

export const loyaltyCardHeaderData: LoyaltyCardData[] = [
  {
    title: 'Total Members',
    amount: 1234,
    raise: '15%',
  },
  {
    title: 'New Members this Month',
    amount: 4234,
    raise: '12%',
  },
  {
    title: 'Active Members',
    amount: 234,
  },
  {
    title: 'Inactive Members',
    amount: 5432,
  },
];

export const loyaltyMidCardData: LoyaltyCardData[] = [
  {
    title: 'New Members',
    amount: 1234,
    raise: '15%',
  },
  {
    title: 'Existing Members',
    amount: 4234,
    raise: '12%',
  },
];

export const loyaltyCardData: LoyaltyCardData[] = [
  {
    title: 'Total Members',
    amount: 1234,
    raise: '15%',
  },
  {
    title: 'Total Rewards',
    amount: 4234,
    raise: '12%',
  },
  {
    title: 'Total Tiers',
    amount: 234,
  },
  {
    title: 'Total Challenges',
    amount: 5432,
  },
];

export const loyaltPointsDashboard: LoyaltyPoints[] = [
  {
    id: 1,
    name: 'Total points earned',
    points: 5000,
  },
  {
    id: 2,
    name: 'Total points redeemed',
    points: 1200,
  },
  {
    id: 3,
    name: 'Average points per user',
    points: 3800,
  },
  {
    id: 4,
    name: 'Total points activity',
    points: 200,
  },
  {
    id: 5,
    name: 'Total points balance',
    points: 200,
  },
];

export const loyaltPoints: LoyaltyPoints[] = [
  {
    id: 1,
    name: 'Total points earned',
    points: 5000,
  },
  {
    id: 2,
    name: 'Total points redeemed',
    points: 1200,
  },
  {
    id: 3,
    name: 'Total points available',
    points: 3800,
  },
  {
    id: 4,
    name: 'Total points expired',
    points: 200,
  },
];

export const rewardData: RewardData[] = [
  {
    id: 1,
    name: 'Free Coffee',
    points: 100,
    description: 'Get a free coffee on your next visit.',
    claimRewards: 50,
    limitedAvail: false,
  },
  {
    id: 2,
    name: 'Discount Voucher',
    points: 200,
    description: 'Receive a 20% discount voucher for your next purchase.',
    claimRewards: 100,
    limitedAvail: false,
  },
  {
    id: 3,
    name: 'Exclusive Merchandise',
    points: 500,
    description: 'Claim exclusive merchandise available only to loyal members.',
    claimRewards: 200,
    limitedAvail: false,
  },
  {
    id: 4,
    name: 'Exclusive Merchandise',
    points: 500,
    description: 'Claim exclusive merchandise available only to loyal members.',
    claimRewards: 200,
    limitedAvail: false,
  },
];

export const rewardDataWithLimitedAvail: RewardData[] = [
  {
    id: 1,
    name: 'Free Coffee',
    points: 100,
    description: 'Get a free coffee on your next visit.',
    claimRewards: 50,
    limitedAvail: true,
  },
  {
    id: 2,
    name: 'Discount Voucher',
    points: 200,
    description: 'Receive a 20% discount voucher for your next purchase.',
    claimRewards: 100,
    limitedAvail: true,
  },
  {
    id: 3,
    name: 'Exclusive Merchandise',
    points: 500,
    description: 'Claim exclusive merchandise available only to loyal members.',
    claimRewards: 200,
    limitedAvail: true,
  },
];

export const engagedMembers: EngagedMember[] = [
  {
    name: 'John Doe',
    points: 1500,
    level: 'Premium',
    tier: 'Tier 1',
    lifeTimeValue: '60%',
  },
  {
    name: 'Jane Smith',
    points: 1200,
    level: 'Gold',
    tier: 'Tier 2',
    lifeTimeValue: '50%',
  },
  {
    name: 'Alice Johnson',
    points: 900,
    level: 'Silver',
    tier: 'Tier 3',
    lifeTimeValue: '40%',
  },
  {
    name: 'Bob Brown',
    points: 700,
    level: 'Bronze',
    tier: 'Tier 4',
    lifeTimeValue: '30%',
  },
  {
    name: 'Charlie White',
    points: 500,
    level: 'Basic',
    tier: 'Tier 5',
    lifeTimeValue: '20%',
  },
  {
    name: 'David Green',
    points: 300,
    level: 'New',
    tier: 'Tier 6',
    lifeTimeValue: '10%',
  },
  {
    name: 'Eve Black',
    points: 200,
    level: 'New',
    tier: 'Tier 7',
    lifeTimeValue: '5%',
  },
];

export const rewardsTabs: TabData[] = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'transaction',
    label: 'Transaction',
  },
  {
    value: 'refund',
    label: 'Refund',
  },
];

export const loyaltylistData: LoyaltyListData[] = [
  {
    item: 'Free Coffee',
    points: 100,
    user: 'John Doe',
    date: '2023-10-01',
    amount: 50,
    total: 1000,
  },
  {
    item: 'Discount Voucher',
    points: 200,
    user: 'Jane Smith',
    date: '2023-10-02',
    amount: 100,
    total: 2000,
  },
  {
    item: 'Exclusive Merchandise',
    points: 500,
    user: 'Alice Johnson',
    date: '2023-10-03',
    amount: 200,
    total: 5000,
  },
  {
    item: 'VIP Event Access',
    points: 1000,
    user: 'Bob Brown',
    date: '2023-10-04',
    amount: 300,
    total: 10000,
  },
  {
    item: 'Gift Card',
    points: 1500,
    user: 'Charlie White',
    date: '2023-10-05',
    amount: 400,
    total: 15000,
  },
  {
    item: 'Charity Donation',
    points: 2000,
    user: 'David Green',
    date: '2023-10-06',
    amount: 500,
    total: 20000,
  },
];
