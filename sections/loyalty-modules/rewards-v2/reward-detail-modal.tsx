'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { getStatusVariant } from '@/utils/short-utils';
import React from 'react';
import { REWARD_CREATION_METHOD_LABELS, REWARD_STATUS_LABELS } from './constants';
import { Reward } from './types';
import {
  formatMetric,
  getBrowsingMetric,
  getConversion,
  getEventName,
  getMenuItemNames,
  getPointsSpent,
  getRedemptionRate,
  getRemainingClaims,
  getTierName,
} from './utils';

interface RewardDetailModalProps {
  open: boolean;
  reward: Reward | null;
  onClose: () => void;
}

/** One label/value line inside the "info entered during creation" panel. */
const InfoRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-center justify-between gap-4 border-b border-gray-200 py-2.5 last:border-b-0 dark:border-gray-700/60">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-right text-sm font-semibold text-gray-900 dark:text-gray-100">{children}</span>
  </div>
);

const MetricTile: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700/60">
    <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">{label}</p>
    <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
  </div>
);

/** Green when on, plain when off — mirrors the "Available as Reward" toggle. */
const OnOffValue: React.FC<{ on: boolean }> = ({ on }) =>
  on ? (
    <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      On
    </span>
  ) : (
    <span className="text-gray-500 dark:text-gray-400">Off</span>
  );

export const RewardDetailModal: React.FC<RewardDetailModalProps> = ({ open, reward, onClose }) => {
  if (!reward) return null;

  const linkedItems = getMenuItemNames(reward.menuItemIds);
  const remainingClaims = getRemainingClaims(reward);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={undefined}
        className="dark:bg-secondary flex max-h-[90vh] w-full flex-col overflow-y-auto sm:max-w-160!"
      >
        <DialogHeader className="space-y-2 text-left">
          <div className="flex flex-wrap items-center gap-2 pr-6">
            <DialogTitle className="text-xl leading-tight font-bold">{reward.name}</DialogTitle>
            {/* Only surfaced when it needs explaining — an active reward is the norm. */}
            {reward.status === 'inactive' && (
              <CustomBadge variant={getStatusVariant(reward.status)}>{REWARD_STATUS_LABELS[reward.status]}</CustomBadge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
              {REWARD_CREATION_METHOD_LABELS[reward.creationMethod]}
            </span>
            {/* The badge already says "Ticket Reward", so the type would repeat it. */}
            {reward.creationMethod !== 'ticketReward' && reward.type && <span className="capitalize">{reward.type}</span>}
            <span>Point Cost: {reward.pointCost.toLocaleString()}</span>
            <span>Tier: {getTierName(reward.tierLimit)}</span>
          </div>
        </DialogHeader>

        <section className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700/60">
          <h4 className="mb-1 text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">Info entered during creation</h4>

          <InfoRow label="Status">
            <CustomBadge variant={getStatusVariant(reward.status)}>{REWARD_STATUS_LABELS[reward.status]}</CustomBadge>
          </InfoRow>

          <InfoRow label="Creation Method">{REWARD_CREATION_METHOD_LABELS[reward.creationMethod]}</InfoRow>

          {reward.creationMethod === 'buyMenuItemReward' && (
            <InfoRow label="Linked Items">{linkedItems.length > 0 ? linkedItems.join(', ') : '—'}</InfoRow>
          )}

          {reward.creationMethod === 'ticketReward' && <InfoRow label="Event">{getEventName(reward.eventId)}</InfoRow>}

          <InfoRow label="Point Cost">{reward.pointCost.toLocaleString()}</InfoRow>

          <InfoRow label="Total Limit">{reward.totalLimit === null ? 'No limit' : reward.totalLimit.toLocaleString()}</InfoRow>

          <InfoRow label="Max Claims Per User">{reward.maxClaimsPerUser === null ? 'No limit' : reward.maxClaimsPerUser.toLocaleString()}</InfoRow>

          <InfoRow label="Tier Limit">{getTierName(reward.tierLimit)}</InfoRow>

          <InfoRow label="% Off">{reward.percentOff}%</InfoRow>

          <InfoRow label="Available as Reward">
            <OnOffValue on={reward.availableAsReward} />
          </InfoRow>

          <InfoRow label="Challenge Only">{reward.challengeOnly ? 'Yes' : 'No'}</InfoRow>
        </section>

        {reward.statusNote && <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{reward.statusNote}</p>}

        <section>
          <h4 className="mb-2 text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">Performance</h4>

          <div className={cn('grid gap-3', 'grid-cols-1 sm:grid-cols-3')}>
            <MetricTile label="Views" value={formatMetric(getBrowsingMetric(reward, reward.views))} />
            <MetricTile label="Favorites" value={formatMetric(getBrowsingMetric(reward, reward.favorites))} />
            <MetricTile label="Conversion" value={formatMetric(getConversion(reward), '%')} />

            <MetricTile label="Total Claims" value={reward.claims.toLocaleString()} />
            <MetricTile label="Total Redemptions" value={reward.redeemed.toLocaleString()} />
            <MetricTile label="Redemption Rate" value={formatMetric(getRedemptionRate(reward), '%')} />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <MetricTile
              label="Remaining Claims (Total)"
              value={remainingClaims === null ? '— (no limit)' : `${remainingClaims.toLocaleString()} / ${reward.totalLimit?.toLocaleString()}`}
            />
            <MetricTile label="Points Spent On This Reward" value={`${getPointsSpent(reward).toLocaleString()} pts`} />
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default RewardDetailModal;
