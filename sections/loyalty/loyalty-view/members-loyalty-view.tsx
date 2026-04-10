'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GenderDonutChart,
  MostViewedEvent,
  ViewsOverTime,
} from '@/sections/invoices';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import React, { useMemo, useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import {
  useGetClubMembersAnalyticsQuery,
  useGetClubMembersAnalyticsSummaryQuery,
} from '@/store/Reducer/members-api';
import { MembersLoyaltySkeleton } from './members-skeleton';

import LoyaltyList from '../loyaltyList'; // your existing table component (Transaction History)
import GiftPointsModal from '@/sections/loyalty-modules/members/gift-points-modal';

/* ------------------- Utility Functions ------------------- */
const formatDateOnly = (isoDate: string): string => {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const formatEuro = (amount: number): string => {
  return `€${amount.toLocaleString()}`;
};

const formatDateTime = (isoDate: string): string => {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const monetaryStatusChipClassMap: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  refunded: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
};

const getMonetaryStatusChipClass = (status: string): string => {
  const normalizedStatus = String(status || '').toLowerCase();
  return monetaryStatusChipClassMap[normalizedStatus] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
};

/* ------------------- Types ------------------- */
type MemberDetail = {
  username: string;
  status: 'active' | 'inactive' | 'banned';
  currentTier: string;
  progressToNextTier: number; // 0-100
  currentPoints: number;
  membershipStart: string; // ISO date
  highestTier: string;
  referralCount: number;
  streak: number; // days
  totalEarned: number;
  totalRedeemed: number;
  avgPointsPerMonth: number;
  totalSpending: number;
  totalTransactions: number;
};

type LoyaltyTx = {
  id: string;
  type: 'earned' | 'redeemed' | 'gift' | 'streak' | 'badge';
  points: number;
  date: string;
  note?: string;
};

type MonetaryTx = {
  id: string;
  kind: WebhookOrderType | '-';
  amount: number;
  date: string;
  linked: string;
  status: string;
};

type ProductStat = {
  id: string;
  name: string;
  count: number;
  amountSpent: number;
};

type Referral = {
  id: string;
  name: string;
  email?: string;
  status: 'joined' | 'pending' | 'declined';
  date: string;
};

type Reward = {
  id: string;
  type?: string;
  title: string;
  ptsCost: number;
  available: boolean;
  createdAt?: string;
  progress?: number; // if part of challenge
};

type Interest = {
  id: string;
  label: string;
};

enum PurchaseCategoryType {
  TICKETING_BOOKINGS = 'ticketingbookings',
  USER_RESERVATIONS = 'userreservations',
  MENU_ORDERS = 'menuorders',
  TICKET_TRANSFER = 'tickettransfer',
}

enum WebhookOrderType {
  TICKETING_BOOKINGS = 'ticketingbookings',
  USER_RESERVATIONS = 'userreservations',
  MENU_ORDERS = 'menuorders',
  TICKET_TRANSFER = 'tickettransfer',
}

const webhookOrderTypeLabelMap: Record<WebhookOrderType, string> = {
  [WebhookOrderType.TICKETING_BOOKINGS]: 'Ticketing Bookings',
  [WebhookOrderType.USER_RESERVATIONS]: 'Reservations',
  [WebhookOrderType.MENU_ORDERS]: 'Menu Orders',
  [WebhookOrderType.TICKET_TRANSFER]: 'Ticket Transfer',
};

const isWebhookOrderType = (value: string): value is WebhookOrderType =>
  Object.values(WebhookOrderType).includes(value as WebhookOrderType);

const purchaseCategoryLabelMap: Record<PurchaseCategoryType, string> = {
  [PurchaseCategoryType.TICKETING_BOOKINGS]: 'Ticketing',
  [PurchaseCategoryType.USER_RESERVATIONS]: 'Reservations',
  [PurchaseCategoryType.MENU_ORDERS]: 'Menu Orders',
  [PurchaseCategoryType.TICKET_TRANSFER]: 'Ticket Transfer',
};

const isPurchaseCategoryType = (value: string): value is PurchaseCategoryType =>
  Object.values(PurchaseCategoryType).includes(value as PurchaseCategoryType);

type AuditEntry =
  | { kind: 'gift'; by: string; amount: number; reason?: string; date: string }
  | {
      kind: 'tier_change';
      by: string;
      from: string;
      to: string;
      reason?: string;
      date: string;
    };

const normalizeReferralStatus = (value: string): Referral['status'] => {
  const normalized = String(value || '').toLowerCase();
  if (normalized === 'joined') return 'joined';
  if (normalized === 'pending') return 'pending';
  return 'declined';
};

/* ------------------- Dummy initial data ------------------- */
const initialMember: MemberDetail = {
  username: 'johndoe123',
  status: 'active',
  currentTier: 'Gold',
  progressToNextTier: 65,
  currentPoints: 1200,
  membershipStart: '2022-01-15',
  highestTier: 'Platinum',
  referralCount: 8,
  streak: 12,
  totalEarned: 15000,
  totalRedeemed: 3800,
  avgPointsPerMonth: 1250,
  totalSpending: 54000,
  totalTransactions: 87,
};

const dummyLoyaltyTx: LoyaltyTx[] = [
  {
    id: 'lt1',
    type: 'earned',
    points: 200,
    date: '2025-09-01',
    note: 'Purchase: Coffee',
  },
  {
    id: 'lt2',
    type: 'redeemed',
    points: -150,
    date: '2025-08-20',
    note: 'Reward Redemption',
  },
  {
    id: 'lt3',
    type: 'gift',
    points: 100,
    date: '2025-07-10',
    note: 'Manual gift',
  },
  {
    id: 'lt4',
    type: 'streak',
    points: 25,
    date: '2025-09-20',
    note: '7-day streak',
  },
];

const dummyMonetaryTx: MonetaryTx[] = [
  {
    id: 'mt1',
    kind: WebhookOrderType.MENU_ORDERS,
    amount: 18.0,
    date: '2025-09-01',
    linked: 'yes',
    status: 'completed',
  },
  {
    id: 'mt2',
    kind: WebhookOrderType.TICKETING_BOOKINGS,
    amount: 45.0,
    date: '2025-08-28',
    linked: 'yes',
    status: 'completed',
  },
  {
    id: 'mt3',
    kind: WebhookOrderType.USER_RESERVATIONS,
    amount: 120.0,
    date: '2025-08-15',
    linked: 'no',
    status: 'pending',
  },
];

const dummyProducts: ProductStat[] = [
  { id: 'p1', name: 'Latte', count: 42, amountSpent: 210 },
  { id: 'p2', name: 'Concert Ticket - VIP', count: 4, amountSpent: 400 },
  { id: 'p3', name: 'Burger', count: 30, amountSpent: 180 },
];

/* ------------------- MembersLoyaltyView ------------------- */
const MembersLoyaltyView: React.FC = () => {
  // Get route params and company ID
  const params = useParams();
  const pathname = usePathname();
  const userId = params?.id as string;
  const { companyId } = useCompanySelectionState();
  const usertype = pathname?.includes('/super-admin/') ? 'super-admin' : 'organizer';

  // Fetch club members analytics API directly with user ID from route
  const analyticsQueryArgs = {
    user: userId || '',
    companyOrganizer: companyId || undefined,
  };

  const shouldFetchAnalytics = !!userId;

  const { data: analyticsData, isLoading: analyticsLoading, error, isFetching, refetch: refetchAnalytics } = useGetClubMembersAnalyticsQuery(
    analyticsQueryArgs,
    { 
      skip: !shouldFetchAnalytics,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: loyaltySummaryData,
    isLoading: loyaltySummaryLoading,
    isFetching: loyaltySummaryFetching,
    error: loyaltySummaryError,
    refetch: refetchLoyaltySummary,
  } = useGetClubMembersAnalyticsSummaryQuery(analyticsQueryArgs, {
    skip: !shouldFetchAnalytics,
    refetchOnMountOrArgChange: true,
  });

  const stats = analyticsData?.data?.stats;
  const clubData = useMemo(
    () =>
      stats?.clubmembersData?.find((m: any) => m?.user?._id === userId) ||
      stats?.clubmembersData?.[0],
    [stats, userId]
  );
  const currentTierFromApi = clubData?.tier?.title || stats?.userNextLevelDetails?.currentLevel || '-';

  // Log API response to console for mapping
  useEffect(() => {
    if (stats) {
      const username = clubData?.user ? `${clubData.user.firstName} ${clubData.user.lastName}` : '-';

      setMember({
        username,
        status: (clubData?.status || 'inactive') as 'active' | 'inactive' | 'banned',
        currentTier: currentTierFromApi,
        progressToNextTier: stats.userNextLevelDetails?.percentageRemaining ?? 0,
        currentPoints: clubData?.points ?? 0,
        membershipStart: clubData?.memberShipStartDate || '',
        highestTier: clubData?.tier?.title || '-',
        referralCount: 0,
        streak: stats.userStreak?.streak ?? 0,
        totalEarned: stats.userCompanyLoyaltyStats?.totalEarned ?? 0,
        totalRedeemed: stats.userCompanyLoyaltyStats?.totalRedeemed ?? 0,
        avgPointsPerMonth: stats.userCompanyLoyaltyStats?.averagePerMonth ?? 0,
        totalSpending: stats.userSpendingsAndTransactions?.totalSpendings ?? 0,
        totalTransactions: stats.userSpendingsAndTransactions?.transactionCount ?? 0,
      });
    }
  }, [stats, clubData, currentTierFromApi]);

  // Member state (so organizer actions update what's shown)
  const [member, setMember] = useState<MemberDetail>(initialMember);

  const [hasConsent, setHasConsent] = useState<boolean>(true);

  // Organizer actions state
  const [giftModalOpen, setGiftModalOpen] = useState(false);

  const [changeTierOpen, setChangeTierOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>(member.currentTier);
  const [tierReason, setTierReason] = useState<string>('');
  const [rewardDetailsOpen, setRewardDetailsOpen] = useState(false);
  const [selectedRewardId, setSelectedRewardId] = useState<string>('');

  // Audit trail
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);

  useEffect(() => {
    setSelectedTier(currentTierFromApi);
  }, [currentTierFromApi]);

  const loyaltyTx = useMemo(() => {
    const summaryPayload = loyaltySummaryData?.data || {};
    const list: any[] = Array.isArray(summaryPayload?.loyaltyTransections)
      ? summaryPayload.loyaltyTransections
      : Array.isArray(summaryPayload?.loyaltyTransactions)
        ? summaryPayload.loyaltyTransactions
        : Array.isArray(summaryPayload?.transactions)
          ? summaryPayload.transactions
          : [];

    const mapped = list.map((item: any, index: number) => ({
      id: String(item?._id || item?.id || `summary-${index}`),
      type: (item?.type || item?.transactionType || 'earned') as LoyaltyTx['type'],
      points: Number(item?.points ?? 0),
      date: item?.createdAt || item?.date || '',
      note: item?.description || item?.note || '-',
    })) as LoyaltyTx[];

    return mapped.sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
      if (Number.isNaN(aTime)) return 1;
      if (Number.isNaN(bTime)) return -1;
      return bTime - aTime;
    });
  }, [loyaltySummaryData]);

  const loyaltySummaryLoadingState = loyaltySummaryLoading || loyaltySummaryFetching;
  const loyaltySummaryErrorMessage =
    (loyaltySummaryError as any)?.data?.message ||
    (loyaltySummaryError as any)?.error ||
    (loyaltySummaryError ? 'Failed to load loyalty transactions.' : '');

  const monetaryTx = useMemo(() => {
    const summaryPayload = loyaltySummaryData?.data || {};
    const list: any[] = Array.isArray(summaryPayload?.webhookTransactions)
      ? summaryPayload.webhookTransactions
      : [];

    const mapped = list.map((item: any, index: number) => {
      const kindRaw = String(item?.orderType || '').toLowerCase();

      return {
      id: String(item?._id || item?.id || `webhook-${index}`),
      kind: isWebhookOrderType(kindRaw) ? kindRaw : '-',
      amount: Number(item?.amount ?? 0),
      date: item?.createdAt || item?.date || '',
      status: String(item?.paymentStatus || '-'),
      linked: String(item?.linked || '-'),
    };
    }) as MonetaryTx[];

    return mapped.sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
      if (Number.isNaN(aTime)) return 1;
      if (Number.isNaN(bTime)) return -1;
      return bTime - aTime;
    });
  }, [loyaltySummaryData]);

  const mostPurchasedSorted = useMemo(() => {
    const summaryPayload = loyaltySummaryData?.data || {};
    const list: any[] = Array.isArray(summaryPayload?.topRepeatedOrders)
      ? summaryPayload.topRepeatedOrders
      : [];

    const mapped = list.map((item: any, index: number) => ({
      id: String(item?.orderNumber || item?._id || item?.id || `top-order-${index}`),
      name: String(item?.title || item?.name || '-'),
      count: Number(item?.count ?? 0),
      amountSpent: Number(item?.amount ?? 0),
    })) as ProductStat[];

    return mapped.sort((a, b) => b.count - a.count);
  }, [loyaltySummaryData]);

  const referrals = useMemo(() => {
    const summaryPayload = loyaltySummaryData?.data || {};
    const list: any[] = Array.isArray(summaryPayload?.latestReferrals)
      ? summaryPayload.latestReferrals
      : [];

    const mapped = list.map((item: any, index: number) => {
      const firstName = item?.user?.firstName || item?.firstName || '';
      const lastName = item?.user?.lastName || item?.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim();

      return {
        id: String(item?._id || item?.id || `referral-${index}`),
        name: fullName || item?.name || '-',
        email: item?.user?.email || item?.email,
        status: normalizeReferralStatus(item?.status),
        date: item?.createdAt || item?.date || '',
      };
    }) as Referral[];

    return mapped.sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
      if (Number.isNaN(aTime)) return 1;
      if (Number.isNaN(bTime)) return -1;
      return bTime - aTime;
    });
  }, [loyaltySummaryData]);

  const rewards = useMemo(() => {
    const summaryPayload = loyaltySummaryData?.data || {};
    const list: any[] = Array.isArray(summaryPayload?.activeRewardsAndChallenges)
      ? summaryPayload.activeRewardsAndChallenges
      : [];

    const mapped = list.map((item: any, index: number) => ({
      id: String(item?._id || item?.id || `reward-${index}`),
      type: String(item?.type || 'reward'),
      title: String(item?.title || '-'),
      ptsCost: Number(item?.points ?? item?.ptsCost ?? 0),
      available: true,
      createdAt: item?.createdAt || item?.date || '',
      progress: undefined,
    })) as Reward[];

    return mapped.sort((a, b) => b.ptsCost - a.ptsCost);
  }, [loyaltySummaryData]);

  const interests = useMemo(() => {
    const summaryPayload = loyaltySummaryData?.data || {};
    const list: any[] = Array.isArray(summaryPayload?.userVenueTypes)
      ? summaryPayload.userVenueTypes
      : [];

    const mapped = list
      .map((item: any, index: number) => {
        const label =
          (typeof item === 'string' ? item : item?.title || item?.name || item?.label || '')
            .toString()
            .trim();

        if (!label) return null;

        return {
          id: String(item?._id || item?.id || `interest-${index}`),
          label,
        } as Interest;
      })
      .filter(Boolean) as Interest[];

    return mapped;
  }, [loyaltySummaryData]);

  const selectedReward = useMemo(
    () => rewards.find((item) => item.id === selectedRewardId) || null,
    [rewards, selectedRewardId]
  );

  const handleViewRewardOrChallenge = (item: Reward) => {
    setSelectedRewardId(item.id);
    setRewardDetailsOpen(true);
  };

  const handleChangeTierSubmit = () => {
    if (!selectedTier) return alert('Select a tier');
    const now = new Date().toISOString();
    setMember((prev) => ({ ...prev, currentTier: selectedTier }));
    setHasConsent(true); // assume consent for demo
    setAuditTrail((prev) => [
      {
        kind: 'tier_change',
        by: 'Organizer',
        from: member.currentTier,
        to: selectedTier,
        reason: tierReason,
        date: now,
      },
      ...prev,
    ]);
    setTierReason('');
    setChangeTierOpen(false);
  };

  /* ---------- Derived values / small helpers ---------- */
  const displayStatus = clubData?.status ?? '-';

  const tierColorClass = useMemo(() => {
    switch (displayStatus) {
      case 'active':
        return 'text-green-600';
      case 'inactive':
        return 'text-gray-500';
      case 'banned':
        return 'text-red-600';
      default:
        return '';
    }
  }, [displayStatus]);

  const displayUsername = clubData?.user
    ? `${clubData.user.firstName ?? ''} ${clubData.user.lastName ?? ''}`.trim()
    : '-';
  const nextLevelLabel = stats?.userNextLevelDetails?.nextLevel || '-';
  const currentLevelLabel = currentTierFromApi;
  const remainingToNextTier = stats?.userNextLevelDetails?.percentageRemaining;

  const pointBalance = clubData?.points;
  const membershipStart = clubData?.memberShipStartDate;
  const highestTier = clubData?.tier?.title;
  const referralCount = stats?.userReferralStats?.totalReferrals;
  const streak = stats?.userStreak?.streak;
  const totalEarned = stats?.userCompanyLoyaltyStats?.totalEarned;
  const totalRedeemed = stats?.userCompanyLoyaltyStats?.totalRedeemed;
  const avgPointsPerMonth = stats?.userCompanyLoyaltyStats?.averagePerMonth;
  const totalSpending = stats?.userSpendingsAndTransactions?.totalSpendings;
  const totalTransactions = stats?.userSpendingsAndTransactions?.transactionCount;

  const pointsOverTimeData = useMemo(() => {
    const points = stats?.pointsOverTime ?? analyticsData?.data?.pointsOverTime;

    if (!Array.isArray(points)) return [];

    return points.map((item: any) => ({
      month: item?.month ?? '-',
      earn: Number(item?.earn ?? 0),
      redeem: Math.abs(Number(item?.redeem ?? 0)),
    }));
  }, [stats, analyticsData]);

  const spendingOverTimeData = useMemo(() => {
    const spendings =
      stats?.spendingOverTime ?? analyticsData?.data?.spendingOverTime;

    if (!Array.isArray(spendings)) return [];

    return spendings.map((item: any) => ({
      month: item?.month ?? '-',
      views: Number(item?.value ?? 0),
    }));
  }, [stats, analyticsData]);

  const purchaseCategoryData = useMemo(() => {
    const categories =
      stats?.purchaseCategoryDistribution ??
      analyticsData?.data?.purchaseCategoryDistribution;

    if (!Array.isArray(categories)) return [];

    return categories.map((item: any) => {
      const rawName = String(item?.name ?? '').toLowerCase();
      const categoryName = isPurchaseCategoryType(rawName)
        ? purchaseCategoryLabelMap[rawName]
        : rawName || '-';

      return {
        name: categoryName,
        value: Number(item?.count ?? 0),
      };
    });
  }, [stats, analyticsData]);

  const referralsOverTimeData = useMemo(() => {
    const referrals =
      stats?.referralsOverTime ?? analyticsData?.data?.referralsOverTime;

    if (!Array.isArray(referrals)) return [];

    return referrals.map((item: any) => ({
      month: item?.month ?? '-',
      search: Number(item?.value ?? 0),
    }));
  }, [stats, analyticsData]);

  const hasPointsOverTimeData = pointsOverTimeData.some(
    (item) => item.earn > 0 || item.redeem > 0
  );
  const hasSpendingOverTimeData = spendingOverTimeData.some(
    (item) => item.views > 0
  );
  const purchaseCategoryColors = ['#2563EB', '#202C88', '#7DAEF4'];
  const hasPurchaseCategoryData = purchaseCategoryData.some(
    (item) => item.value > 0
  );
  const hasReferralsOverTimeData = referralsOverTimeData.some(
    (item) => item.search > 0
  );
  const purchaseCategoryTotal = purchaseCategoryData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const purchaseCategoryLegendData = purchaseCategoryData
    .filter((item) => item.value > 0)
    .map((item, index) => ({
      ...item,
      color: purchaseCategoryColors[index % purchaseCategoryColors.length],
      percent: purchaseCategoryTotal > 0 ? Math.round((item.value / purchaseCategoryTotal) * 100) : 0,
    }));

  // Show skeleton while loading
  if (analyticsLoading) {
    return <MembersLoyaltySkeleton />;
  }

  return (
    <>
      {/* ------------ MEMBER HEADER ------------ */}
      <Card className="dark:bg-secondary mt-5 shadow-md">
        <CardHeader>
          <div className="w-full">
            <div>
              <CardTitle className="text-2xl font-bold">
                {displayUsername || '-'}
              </CardTitle>
              <div className={`text-sm font-medium ${tierColorClass}`}>
                Status: {displayStatus}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">
                Current Status: {currentLevelLabel}
              </p>
              <Progress value={typeof remainingToNextTier === 'number' ? 100 - remainingToNextTier : 0} />
              <p className="text-muted-foreground text-xs">
                {typeof remainingToNextTier === 'number' ? `${remainingToNextTier}%` : '-'} remaining to next status{' '}
                <span className="text-blue-500">{nextLevelLabel}</span>
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <StatCard title="Point Balance" value={pointBalance ?? '-'} />
            <StatCard title="Membership Start" value={membershipStart ? formatDateOnly(membershipStart) : '-'} />
            <StatCard title="Highest Tier" value={highestTier ?? '-'} />
            <StatCard title="Referral Count" value={referralCount ?? '-'} />
            <StatCard title="Streak" value={typeof streak === 'number' ? `${streak} days` : '-'} />
            <StatCard title="Total Earned" value={totalEarned ?? '-'} />
            <StatCard title="Total Redeemed" value={totalRedeemed ?? '-'} />
            <StatCard title="Avg / Month" value={avgPointsPerMonth ?? '-'} />
            <StatCard
              title="Total Spending"
              value={typeof totalSpending === 'number' ? formatEuro(totalSpending) : '-'}
            />
            <StatCard
              title="Total Transactions"
              value={totalTransactions ?? '-'}
            />
          </div>
        </CardContent>
      </Card>

      {/* ------------ ANALYTICS (Charts) ------------ */}
      <div className="mt-5 grid grid-cols-12 gap-4">
        {/* Points Over Time */}
        <div className="col-span-12 md:col-span-6">
          <Card className="dark:bg-secondary shadow-md">
            <CardHeader>
              <h3 className="text-xl font-semibold">
                Points Over Time (earned vs redeemed)
              </h3>
            </CardHeader>
            {!hasPointsOverTimeData ? (
              <div className="text-muted-foreground flex h-[300px] items-center justify-center text-sm">
                No Data Available
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={pointsOverTimeData}
                    margin={{ top: 10, right: 20, left: 16, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="month" axisLine={false} />
                    <YAxis axisLine={false} />
                    <Tooltip cursor={false} />
                    <Line
                      type="monotone"
                      dataKey="earn"
                      name="Earn"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="redeem"
                      name="Redeem"
                      stroke="#6b7280"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>

        {/* Spending Over Time */}
        <div className="col-span-12 md:col-span-6">
          <Card className="dark:bg-secondary shadow-md">
            <CardHeader>
              <h3 className="text-xl font-semibold">Spending Over Time</h3>
            </CardHeader>
            {!hasSpendingOverTimeData ? (
              <div className="text-muted-foreground flex h-[300px] items-center justify-center text-sm">
                No Data Available
              </div>
            ) : (
              <ViewsOverTime
                height={300}
                data={spendingOverTimeData}
              />
            )}
          </Card>
        </div>

        {/* Purchase Category Breakdown */}
        <div className="col-span-12 md:col-span-4">
          <Card className="dark:bg-secondary shadow-md md:h-[430px]">
            <CardHeader>
              <div className="items-start justify-between md:flex">
                <h3 className="text-lg font-semibold">Purchase Category Breakdown</h3>

                <div className="mt-2 flex flex-col items-start rounded-md md:mt-0 md:gap-2">
                  {purchaseCategoryLegendData.map((item, index) => (
                    <div key={`${item.name}-${index}`} className="flex w-full items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <div
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-[14px]" style={{ color: item.color }}>
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[14px] text-gray-700 dark:text-white">
                        {item.percent}% / {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            {!hasPurchaseCategoryData ? (
              <div className="text-muted-foreground flex h-[330px] items-center justify-center text-sm">
                No Data Available
              </div>
            ) : (
              <div className="flex h-[300px] w-full items-center justify-center px-3 pb-3">
                <div className="w-full max-w-[300px]">
                  <GenderDonutChart
                    data={purchaseCategoryData}
                    COLORS={purchaseCategoryColors}
                    size={125}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Referrals Over Time */}
        <div className="col-span-12 md:col-span-8">
          <Card className="dark:bg-secondary h-[430px] shadow-md">
            <CardHeader>
              <h3 className="text-lg font-semibold">Referrals</h3>
            </CardHeader>
            {!hasReferralsOverTimeData ? (
              <div className="text-muted-foreground flex h-[330px] items-center justify-center text-sm">
                No Data Available
              </div>
            ) : (
              <div className="h-[330px]">
                <MostViewedEvent
                  chartData={referralsOverTimeData}
                  chartConfig={{
                    search: { label: 'Referrals', color: '#2563EB' },
                  }}
                />
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ------------ LISTS / TABLES -------------- */}
      <div className="mt-6 grid grid-cols-12 gap-4">
        {/* Transaction History (reuses LoyaltyList) */}
        <div className="col-span-12 lg:col-span-12">
          <Card className="dark:bg-secondary shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Transaction History</h3>
                <Badge className="text-sm">All</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <LoyaltyList userId={userId} companyOrganizer={companyId || undefined} />
            </CardContent>
          </Card>
        </div>

        {/* Loyalty Transactions */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="dark:bg-secondary min-h-[20rem] shadow-md">
            <CardHeader>
              <h3 className="text-lg font-semibold">Loyalty Transactions</h3>
            </CardHeader>
            <CardContent>
              <SimpleTableLoyalty
                data={loyaltyTx}
                isLoading={loyaltySummaryLoadingState}
                errorMessage={loyaltySummaryErrorMessage}
              />
            </CardContent>
          </Card>
        </div>

        {/* Monetary Transactions */}
        <div className="col-span-12 md:col-span-6">
          <Card className="dark:bg-secondary min-h-[20rem] shadow-md">
            <CardHeader>
              <h3 className="text-lg font-semibold">Monetary Transactions</h3>
            </CardHeader>
            <CardContent>
              <SimpleTableMonetary
                data={monetaryTx}
                isLoading={loyaltySummaryLoadingState}
                errorMessage={loyaltySummaryErrorMessage}
              />
            </CardContent>
          </Card>
        </div>

        {/* Most Purchased Products */}
        <div className="col-span-12 md:col-span-6">
          <Card className="dark:bg-secondary min-h-[20rem] shadow-md">
            <CardHeader>
              <h3 className="text-lg font-semibold">Most Purchased Products</h3>
            </CardHeader>
            <CardContent>
              <MostPurchasedList items={mostPurchasedSorted} />
            </CardContent>
          </Card>
        </div>

        {/* Referrals Made */}
        <div className="col-span-12 md:col-span-6">
          <Card className="dark:bg-secondary min-h-[20rem] shadow-md">
            <CardHeader>
              <h3 className="text-lg font-semibold">Referrals Made</h3>
            </CardHeader>
            <CardContent>
              <ReferralsList items={referrals} />
            </CardContent>
          </Card>
        </div>

        {/* Active Rewards & Challenges */}
        <div className="col-span-12 md:col-span-6">
          <Card className="dark:bg-secondary min-h-[20rem] shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Active Rewards & Challenges
                </h3>
                <div className="text-muted-foreground text-sm">
                  {rewards.length} items
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ActiveRewardsList items={rewards} onView={handleViewRewardOrChallenge} />
            </CardContent>
          </Card>
        </div>

        {/* Interests (consent-gated) */}
        {hasConsent && (
          <div className="col-span-12 md:col-span-6">
            <Card className="dark:bg-secondary min-h-[20rem] shadow-md">
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  Interests (consent given)
                </h3>
              </CardHeader>
              <CardContent>
                <InterestsList items={interests} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* ------------ Organizer Actions + Audit Trail ------------ */}
      <div className="mt-6 grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6">
          <Card className="dark:bg-secondary shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Organizer Actions</h3>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => setGiftModalOpen(true)}>
                    Gift Points
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setChangeTierOpen(true)}
                  >
                    Change Tier
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Actions taken here will be recorded in the audit trail below.
              </p>
              <div className="mt-4 space-y-2">
                <div>
                  <strong>Current points:</strong> {member.currentPoints}
                </div>
                <div>
                  <strong>Current tier:</strong> {member.currentTier}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit trail */}
        {/* <div className="col-span-12 lg:col-span-6">
          <Card className="dark:bg-secondary shadow-md">
            <CardHeader>
              <h3 className="text-lg font-semibold">Audit Trail</h3>
            </CardHeader>
            <CardContent>
              {auditTrail.length === 0 ? (
                <div className="text-muted-foreground text-sm">
                  No audit entries yet.
                </div>
              ) : (
                <ul className="space-y-2">
                  {auditTrail.map((a, i) => (
                    <li key={i} className="rounded-md border p-3">
                      {'kind' in a && a.kind === 'gift' ? (
                        <>
                          <div className="font-semibold">
                            Gifted {a.amount} pts
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {a.reason}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {new Date(a.date).toLocaleString()}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="font-semibold">
                            Tier changed from {(a as any).from} to{' '}
                            {(a as any).to}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {(a as any).reason}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {new Date((a as any).date).toLocaleString()}
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div> */}
      </div>

      {/* ------------ Access Rules Recap ------------ */}
      {/* <div className="mt-6">
        <Card className="dark:bg-secondary shadow-md">
          <CardHeader>
            <h3 className="text-lg font-semibold">Access Rules Recap</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Default Access:</strong> Username, status, loyalty data
                (points, tiers, streaks, referrals, transactions).
              </div>
              <div>
                <strong>Extended Access:</strong> Personal data (name, email,
                demographics, interests) — requires subscription + user consent.
              </div>
              <div className="mt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={hasConsent}
                    onChange={() => setHasConsent((v) => !v)}
                    className="h-4 w-4 rounded border"
                  />
                  <span>Consent to show interests (toggle)</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* ------------ Modals: Gift Points ------------ */}
      {giftModalOpen && (
        <GiftPointsModal
          open={giftModalOpen}
          onClose={() => setGiftModalOpen(false)}
          companyOrganizer={companyId || ''}
          userId={userId || ''}
          usertype={usertype}
          onSuccess={async () => {
            await Promise.all([refetchAnalytics(), refetchLoyaltySummary()]);
          }}
        />
        // <Dialog open={giftModalOpen} onOpenChange={setGiftModalOpen}>
        //   <DialogOverlay className="fixed inset-0 bg-black/30" />
        //   <DialogContent
        //     aria-describedby={undefined}
        //     className="dark:bg-secondary max-w-lg"
        //   >
        //     <DialogTitle>Gift Points</DialogTitle>
        //     <div className="mt-4 space-y-3">
        //       <div>
        //         <label className="block text-sm">Amount</label>
        //         <Input
        //           type="number"
        //           value={giftAmount}
        //           onChange={(e: any) => setGiftAmount(Number(e.target.value))}
        //           placeholder="Points to gift"
        //         />
        //       </div>
        //       <div>
        //         <label className="block text-sm">Reason</label>
        //         <Input
        //           value={giftReason}
        //           onChange={(e: any) => setGiftReason(e.target.value)}
        //           placeholder="Optional reason"
        //         />
        //       </div>
        //     </div>

        //     <div className="mt-4 flex justify-end gap-2">
        //       <Button variant="outline" onClick={() => setGiftModalOpen(false)}>
        //         Cancel
        //       </Button>
        //       <Button onClick={handleGiftSubmit}>Send Gift</Button>
        //     </div>
        //   </DialogContent>
        // </Dialog>
      )}

      {/* Reward/Challenge Details Modal */}
      {rewardDetailsOpen && (
        <Dialog open={rewardDetailsOpen} onOpenChange={setRewardDetailsOpen}>
          <DialogOverlay className="fixed inset-0 bg-black/30" />
          <DialogContent
            aria-describedby={undefined}
            className="dark:bg-secondary max-w-lg"
          >
            <DialogTitle>Details</DialogTitle>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <span className="font-semibold">Title:</span>{' '}
                {selectedReward?.title || '-'}
              </div>
              <div>
                <span className="font-semibold">Type:</span>{' '}
                {selectedReward?.type || '-'}
              </div>
              <div>
                <span className="font-semibold">Points:</span>{' '}
                {selectedReward?.ptsCost ?? '-'}
              </div>
              <div>
                <span className="font-semibold">Created At:</span>{' '}
                {selectedReward?.createdAt
                  ? formatDateTime(selectedReward.createdAt)
                  : '-'}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{' '}
                <span className="text-green-600 dark:text-green-400">Available</span>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setRewardDetailsOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Change Tier Modal */}
      {changeTierOpen && (
        <Dialog open={changeTierOpen} onOpenChange={setChangeTierOpen}>
          <DialogOverlay className="fixed inset-0 bg-black/30" />
          <DialogContent
            aria-describedby={undefined}
            className="dark:bg-secondary max-w-lg"
          >
            <DialogTitle>Change Tier</DialogTitle>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm">Select Tier</label>
                <Select
                  value={selectedTier}
                  onValueChange={(v: string) => setSelectedTier(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-secondary w-full">
                    <SelectItem value="Bronze">Bronze</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                    <SelectItem value="Diamond">Diamond</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm">Reason / Note</label>
                <Input
                  value={tierReason}
                  onChange={(e: any) => setTierReason(e.target.value)}
                  placeholder="Audit note"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setChangeTierOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleChangeTierSubmit}>Confirm Change</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

/* ------------------- Subcomponents ------------------- */

const StatCard: React.FC<{ title: string; value: string | number }> = ({
  title,
  value,
}) => (
  <Card className="dark:bg-secondary gap-2 shadow-sm">
    <CardHeader>
      <CardTitle className="text-md font-medium dark:text-gray-400">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-xl font-semibold">{value}</p>
    </CardContent>
  </Card>
);

/* Simple loyalty transactions table (inlined to avoid external deps) */
const SimpleTableLoyalty: React.FC<{
  data: LoyaltyTx[];
  isLoading?: boolean;
  errorMessage?: string;
}> = ({ data, isLoading = false, errorMessage = '' }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-muted-foreground text-left">
          <th className="py-2">Type</th>
          <th className="py-2">Points</th>
          <th className="py-2">Date</th>
          <th className="py-2">Description</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={4} className="py-8 text-center text-sm text-gray-400">
              Loading loyalty transactions...
            </td>
          </tr>
        ) : errorMessage ? (
          <tr>
            <td colSpan={4} className="py-8 text-center text-sm text-red-500">
              {errorMessage}
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={4} className="py-8 text-center text-sm text-gray-400">
              No loyalty transactions available
            </td>
          </tr>
        ) : (
          data.map((d) => (
            <tr key={d.id} className="border-t">
              <td className="py-2 capitalize">{d.type}</td>
              <td className="py-2 font-semibold">{d.points}</td>
              <td className="py-2">{formatDateTime(d.date)}</td>
              <td className="text-muted-foreground py-2">{d.note || '-'}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

/* Monetary */
const SimpleTableMonetary: React.FC<{
  data: MonetaryTx[];
  isLoading?: boolean;
  errorMessage?: string;
}> = ({ data, isLoading = false, errorMessage = '' }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-muted-foreground text-left">
          <th className="py-2">Kind</th>
          <th className="py-2">Amount</th>
          <th className="py-2">Date</th>
          <th className="py-2">Status</th>
          <th className="py-2">Linked</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={5} className="py-8 text-center text-sm text-gray-400">
              Loading monetary transactions...
            </td>
          </tr>
        ) : errorMessage ? (
          <tr>
            <td colSpan={5} className="py-8 text-center text-sm text-red-500">
              {errorMessage}
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={5} className="py-8 text-center text-sm text-gray-400">
              No monetary transactions available
            </td>
          </tr>
        ) : (
          data.map((d) => (
            <tr key={d.id} className="border-t">
              <td className="py-2">
                {d.kind !== '-' ? webhookOrderTypeLabelMap[d.kind] : '-'}
              </td>
              <td className="py-2">€{d.amount.toFixed(2)}</td>
              <td className="py-2">{formatDateTime(d.date)}</td>
              <td className="py-2">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${getMonetaryStatusChipClass(d.status)}`}
                >
                  {String(d.status || '-')}
                </span>
              </td>
              <td className="py-2 capitalize">{d.linked}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

/* Most purchased list */
const MostPurchasedList: React.FC<{ items: ProductStat[] }> = ({ items }) => (
  <ul className="space-y-2">
    {items.map((p, idx) => (
      <li
        key={p.id}
        className="flex items-center justify-between rounded-md border px-3 py-2"
      >
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground w-8">{idx + 1}</div>
          <div>
            <div className="font-medium">{p.name}</div>
            <div className="text-muted-foreground text-xs">
              {p.count} purchases
            </div>
          </div>
        </div>
        <div className="text-sm font-semibold">${p.amountSpent}</div>
      </li>
    ))}
  </ul>
);

/* Referrals list */
const ReferralsList: React.FC<{ items: Referral[] }> = ({ items }) => (
  <ul className="space-y-2">
    {items.length === 0 && (
      <li className="text-muted-foreground rounded-md border px-3 py-6 text-center text-sm">
        No referrals available
      </li>
    )}
    {items.map((r) => (
      <li
        key={r.id}
        className="flex items-center justify-between rounded-md border px-3 py-2"
      >
        <div>
          <div className="font-medium">{r.name}</div>
          <div className="text-muted-foreground text-xs">{r.email ?? '—'}</div>
        </div>
        <div className="text-sm">
          <span
            className={`rounded-full px-2 py-1 text-xs ${r.status === 'joined' ? 'bg-green-100 text-green-700' : r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}
          >
            {r.status}
          </span>
          {/* <div className="text-muted-foreground text-xs">
            {new Date(r.date).toLocaleDateString()}
          </div> */}
        </div>
      </li>
    ))}
  </ul>
);

/* Rewards list */
const ActiveRewardsList: React.FC<{
  items: Reward[];
  onView: (item: Reward) => void;
}> = ({ items, onView }) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
    {items.length === 0 && (
      <div className="text-muted-foreground rounded-md border p-4 text-center text-sm md:col-span-2">
        No active rewards or challenges available
      </div>
    )}
    {items.map((it) => (
      <div key={it.id} className="rounded-md border p-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-semibold">{it.title}</div>
            <div className="text-muted-foreground text-xs">
              {it.ptsCost} pts
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-sm font-medium ${it.available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
            >
              {it.available ? 'Available' : 'Unavailable'}
            </div>
            {/* {typeof it.progress === 'number' && (
              <div className="text-muted-foreground text-xs">
                Progress: {it.progress}%
              </div>
            )} */}
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          {/* <Button size="sm" disabled={!it.available}>
            Redeem
          </Button> */}
          <Button size="sm" variant="outline" onClick={() => onView(it)}>
            View
          </Button>
        </div>
      </div>
    ))}
  </div>
);

/* Interests */
const InterestsList: React.FC<{ items: Interest[] }> = ({ items }) => (
  <div className="flex flex-wrap gap-2">
    {items.length === 0 && (
      <div className="text-muted-foreground flex min-h-[120px] w-full items-center justify-center text-sm">
        No interests available
      </div>
    )}
    {items.map((i) => (
      <Badge key={i.id} className="rounded-md px-3 py-1">
        {i.label}
      </Badge>
    ))}
  </div>
);

export default MembersLoyaltyView;
