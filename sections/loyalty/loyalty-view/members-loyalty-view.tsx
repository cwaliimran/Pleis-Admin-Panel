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
import React, { useMemo, useState } from 'react';

import LoyaltyList from '../loyaltyList'; // your existing table component (Transaction History)
import GiftPointsModal from '@/sections/users/user-list-view/gift-points-modal';

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
  kind: 'ticket' | 'booking' | 'menu';
  amount: number;
  date: string;
  linkedToLoyalty?: boolean;
  status: 'completed' | 'refunded' | 'pending';
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
  title: string;
  ptsCost: number;
  available: boolean;
  progress?: number; // if part of challenge
};

type Interest = {
  id: string;
  label: string;
};

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
    kind: 'menu',
    amount: 18.0,
    date: '2025-09-01',
    linkedToLoyalty: true,
    status: 'completed',
  },
  {
    id: 'mt2',
    kind: 'ticket',
    amount: 45.0,
    date: '2025-08-28',
    linkedToLoyalty: true,
    status: 'completed',
  },
  {
    id: 'mt3',
    kind: 'booking',
    amount: 120.0,
    date: '2025-08-15',
    linkedToLoyalty: false,
    status: 'pending',
  },
];

const dummyProducts: ProductStat[] = [
  { id: 'p1', name: 'Latte', count: 42, amountSpent: 210 },
  { id: 'p2', name: 'Concert Ticket - VIP', count: 4, amountSpent: 400 },
  { id: 'p3', name: 'Burger', count: 30, amountSpent: 180 },
];

const dummyReferrals: Referral[] = [
  {
    id: 'r1',
    name: 'Ali Khan',
    email: 'ali@example.com',
    status: 'joined',
    date: '2025-06-12',
  },
  {
    id: 'r2',
    name: 'Sara Ahmed',
    email: 'sara@example.com',
    status: 'pending',
    date: '2025-09-18',
  },
];

const dummyRewards: Reward[] = [
  { id: 'rw1', title: 'Free Coffee', ptsCost: 100, available: true },
  {
    id: 'rw2',
    title: '10% Discount',
    ptsCost: 500,
    available: true,
    progress: 40,
  },
  { id: 'rw3', title: 'VIP Upgrade', ptsCost: 2000, available: false },
];

const dummyInterests: Interest[] = [
  { id: 'i1', label: 'Live Music' },
  { id: 'i2', label: 'Coffee & Snacks' },
  { id: 'i3', label: 'Outdoor Events' },
];

/* ------------------- MembersLoyaltyView ------------------- */
const MembersLoyaltyView: React.FC = () => {
  // Member state (so organizer actions update what's shown)
  const [member, setMember] = useState<MemberDetail>(initialMember);

  const [hasConsent, setHasConsent] = useState<boolean>(true);

  // Organizer actions state
  const [giftModalOpen, setGiftModalOpen] = useState(false);

  const [changeTierOpen, setChangeTierOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>(member.currentTier);
  const [tierReason, setTierReason] = useState<string>('');

  // Audit trail
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  console.log('auditTrail', auditTrail);

  // Local copies of lists (replace with API fetch)
  const [loyaltyTx] = useState<LoyaltyTx[]>(dummyLoyaltyTx);
  const [monetaryTx] = useState<MonetaryTx[]>(dummyMonetaryTx);
  const [products] = useState<ProductStat[]>(dummyProducts);
  const [referrals] = useState<Referral[]>(dummyReferrals);
  const [rewards] = useState<Reward[]>(dummyRewards);
  const [interests] = useState<Interest[]>(dummyInterests);

  const handleGiftConfirm = (points: string, note: string) => {
    console.log('Gift points sent:', points, 'Note:', note);
    setGiftModalOpen(false);
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
  const tierColorClass = useMemo(() => {
    switch (member.status) {
      case 'active':
        return 'text-green-600';
      case 'inactive':
        return 'text-gray-500';
      case 'banned':
        return 'text-red-600';
      default:
        return '';
    }
  }, [member.status]);

  const mostPurchasedSorted = useMemo(() => {
    return [...products].sort((a, b) => b.count - a.count);
  }, [products]);

  return (
    <>
      {/* ------------ MEMBER HEADER ------------ */}
      <Card className="dark:bg-secondary mt-5 shadow-md">
        <CardHeader>
          <div className="w-full">
            <div>
              <CardTitle className="text-2xl font-bold">
                {member.username}
              </CardTitle>
              <div className={`text-sm font-medium ${tierColorClass}`}>
                Status: {member.status}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">
                Current Tier: {member.currentTier}
              </p>
              <Progress value={member.progressToNextTier} />
              <p className="text-muted-foreground text-xs">
                {member.progressToNextTier}% toward next tier
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <StatCard title="Point Balance" value={`${member.currentPoints}`} />
            <StatCard title="Membership Start" value={member.membershipStart} />
            <StatCard title="Highest Tier" value={member.highestTier} />
            <StatCard title="Referral Count" value={member.referralCount} />
            <StatCard title="Streak" value={`${member.streak} days`} />
            <StatCard title="Total Earned" value={member.totalEarned} />
            <StatCard title="Total Redeemed" value={member.totalRedeemed} />
            <StatCard title="Avg / Month" value={member.avgPointsPerMonth} />
            <StatCard
              title="Total Spending"
              value={`$${member.totalSpending.toLocaleString()}`}
            />
            <StatCard
              title="Total Transactions"
              value={member.totalTransactions}
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
            <ViewsOverTime
              height={300}
              data={[
                { month: 'Jan', views: 400 },
                { month: 'Feb', views: 600 },
                { month: 'Mar', views: 1200 },
                { month: 'Apr', views: 900 },
                { month: 'May', views: 1500 },
              ]}
            />
          </Card>
        </div>

        {/* Spending Over Time */}
        <div className="col-span-12 md:col-span-6">
          <Card className="dark:bg-secondary shadow-md">
            <CardHeader>
              <h3 className="text-xl font-semibold">Spending Over Time</h3>
            </CardHeader>
            <ViewsOverTime
              height={300}
              data={[
                { month: 'Jan', views: 2000 },
                { month: 'Feb', views: 1800 },
                { month: 'Mar', views: 2400 },
                { month: 'Apr', views: 2100 },
                { month: 'May', views: 2600 },
              ]}
            />
          </Card>
        </div>

        {/* Purchase Category Breakdown */}
        <div className="col-span-12 md:col-span-4">
          <Card className="dark:bg-secondary shadow-md">
            <CardHeader>
              <h3 className="text-lg font-semibold">
                Purchase Category Breakdown
              </h3>
            </CardHeader>
            <GenderDonutChart
              data={[
                { name: 'Menu', value: 400 },
                { name: 'Tickets', value: 300 },
                { name: 'Bookings', value: 300 },
              ]}
              COLORS={['#2563EB', '#202C88', '#7DAEF4']}
            />
          </Card>
        </div>

        {/* Referrals Over Time */}
        <div className="col-span-12 md:col-span-8">
          <Card className="dark:bg-secondary shadow-md">
            <CardHeader>
              <h3 className="text-lg font-semibold">Referrals</h3>
            </CardHeader>
            <MostViewedEvent
              chartData={Array.from({ length: 12 }, (_, i) => ({
                month: `M${i + 1}`,
                search: Math.floor(Math.random() * 20) + 5,
              }))}
              chartConfig={{
                search: { label: 'Referrals', color: '#2563EB' },
              }}
            />
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
              <LoyaltyList />
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
              <SimpleTableLoyalty data={loyaltyTx} />
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
              <SimpleTableMonetary data={monetaryTx} />
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
              <ActiveRewardsList items={rewards} />
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
          onOpenChange={setGiftModalOpen}
          onConfirm={handleGiftConfirm}
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
const SimpleTableLoyalty: React.FC<{ data: LoyaltyTx[] }> = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-muted-foreground text-left">
          <th className="py-2">Type</th>
          <th className="py-2">Points</th>
          <th className="py-2">Date</th>
          <th className="py-2">Note</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr key={d.id} className="border-t">
            <td className="py-2 capitalize">{d.type}</td>
            <td className="py-2 font-semibold">{d.points}</td>
            <td className="py-2">{new Date(d.date).toLocaleDateString()}</td>
            <td className="text-muted-foreground py-2">{d.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* Monetary */
const SimpleTableMonetary: React.FC<{ data: MonetaryTx[] }> = ({ data }) => (
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
        {data.map((d) => (
          <tr key={d.id} className="border-t">
            <td className="py-2 capitalize">{d.kind}</td>
            <td className="py-2">${d.amount.toFixed(2)}</td>
            <td className="py-2">{new Date(d.date).toLocaleDateString()}</td>
            <td className="py-2">{d.status}</td>
            <td className="py-2">{d.linkedToLoyalty ? 'Yes' : 'No'}</td>
          </tr>
        ))}
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
const ActiveRewardsList: React.FC<{ items: Reward[] }> = ({ items }) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
            <div className="text-sm">
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
          <Button size="sm" variant="outline">
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
    {items.map((i) => (
      <Badge key={i.id} className="rounded-md px-3 py-1">
        {i.label}
      </Badge>
    ))}
  </div>
);

export default MembersLoyaltyView;
