'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { getStatusVariant } from '@/utils/short-utils';
import React from 'react';
import PromotionTypeBadge from '../components/promotion-type-badge';
import { PROMOTION_DEPRECATION_NOTE, PROMOTION_STATUS_LABELS, isDeprecatedType } from '../constants';
import { Promotion } from '../types';
import {
  formatActiveTime,
  formatDateRange,
  formatMetric,
  getAvgPointsPerParticipant,
  getMenuItemNames,
  getTypeDetailLabel,
  getViewToUseRate,
  isExpired,
} from '../utils';

interface PromotionDetailModalProps {
  open: boolean;
  promotion: Promotion | null;
  onClose: () => void;
}

const InfoRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-center justify-between gap-4 border-b border-gray-200 py-2.5 last:border-b-0 dark:border-gray-700/60">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-right text-sm font-semibold text-gray-900 dark:text-gray-100">{children}</span>
  </div>
);

const MetricTile: React.FC<{ label: string; value: string; alert?: boolean }> = ({ label, value, alert = false }) => (
  <div className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700/60">
    <p
      className={cn(
        'text-[11px] font-semibold tracking-wide uppercase',
        alert ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
      )}
    >
      {label}
    </p>
    <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
  </div>
);

export const PromotionDetailModal: React.FC<PromotionDetailModalProps> = ({ open, promotion, onClose }) => {
  if (!promotion) return null;

  const deprecated = isDeprecatedType(promotion.type);
  const qualifyingItems = getMenuItemNames(promotion.qualifyingItemIds);
  const activeTime = formatActiveTime(promotion);
  const expired = isExpired(promotion);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="dark:bg-secondary flex max-h-[90vh] w-full flex-col overflow-y-auto sm:max-w-160!">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex flex-wrap items-center gap-2 pr-6">
            <DialogTitle className="text-xl leading-tight font-bold">{promotion.title}</DialogTitle>
            {deprecated && (
              <span className="rounded-md border border-amber-500/60 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-600 uppercase dark:text-amber-400">
                Deprecated
              </span>
            )}
          </div>

          <PromotionTypeBadge type={promotion.type} />
        </DialogHeader>

        {deprecated && <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{PROMOTION_DEPRECATION_NOTE}</p>}

        <section className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700/60">
          <h4 className="mb-1 text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">Info entered during creation</h4>

          <InfoRow label="Status">
            <CustomBadge variant={getStatusVariant(promotion.status)}>{PROMOTION_STATUS_LABELS[promotion.status]}</CustomBadge>
          </InfoRow>

          <InfoRow label="Type">{getTypeDetailLabel(promotion.type)}</InfoRow>

          {qualifyingItems.length > 0 && <InfoRow label="Qualifying Items">{qualifyingItems.join(', ')}</InfoRow>}

          {promotion.type === 'extraPoints' && (
            <InfoRow label="Extra Points per Purchase">{promotion.extraPointsPerPurchase.toLocaleString()}</InfoRow>
          )}

          {promotion.rewardName && <InfoRow label="Reward">{promotion.rewardName}</InfoRow>}

          <InfoRow label="Date Range">{formatDateRange(promotion)}</InfoRow>

          {activeTime && <InfoRow label="Active Time">{activeTime}</InfoRow>}
        </section>

        <section>
          <h4 className="mb-2 text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">Performance</h4>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MetricTile label="Views" value={promotion.views.toLocaleString()} />
            <MetricTile label="Favorites" value={promotion.favorites.toLocaleString()} />
            <MetricTile label="View → Use" value={formatMetric(getViewToUseRate(promotion), '%')} />

            {/* A legacy claim promotion counts claims and never awards points, so
                the average would always read 0 — its lifecycle is the useful figure. */}
            {deprecated ? (
              <>
                <MetricTile label="Total Claims" value={promotion.participations.toLocaleString()} />
                <MetricTile label="Points Awarded" value={promotion.pointsAwarded.toLocaleString()} />
                <MetricTile label="Status" value={expired ? 'Expired' : PROMOTION_STATUS_LABELS[promotion.status]} alert={expired} />
              </>
            ) : (
              <>
                <MetricTile label="Total Participations" value={promotion.participations.toLocaleString()} />
                <MetricTile label="Total Points Awarded" value={promotion.pointsAwarded.toLocaleString()} />
                <MetricTile label="Avg Points / Participant" value={formatMetric(getAvgPointsPerParticipant(promotion))} />
              </>
            )}
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionDetailModal;
