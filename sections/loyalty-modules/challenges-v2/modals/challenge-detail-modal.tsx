'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fDate, formatStr } from '@/utils/format-time';
import { getStatusVariant } from '@/utils/short-utils';
import React from 'react';
import { CHALLENGE_REWARD_TYPE_LABELS, CHALLENGE_STATUS_LABELS, CHALLENGE_TASK_TYPE_LABELS } from '../constants';
import { Challenge } from '../types';
import { formatAvgProgress, formatGoal, formatMetric, getCompletionRate, getParticipationRate, getRemainingClaims, getTierName } from '../utils';

interface ChallengeDetailModalProps {
  open: boolean;
  challenge: Challenge | null;
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

export const ChallengeDetailModal: React.FC<ChallengeDetailModalProps> = ({ open, challenge, onClose }) => {
  if (!challenge) return null;

  const remainingClaims = getRemainingClaims(challenge);
  const ticket = challenge.specialTicket;

  /** Points rewards spell out the payout inline; the others have their own row. */
  const rewardTypeValue =
    challenge.rewardType === 'points'
      ? `${CHALLENGE_REWARD_TYPE_LABELS.points} · ${challenge.pointReward.toLocaleString()} pts`
      : CHALLENGE_REWARD_TYPE_LABELS[challenge.rewardType];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="dark:bg-secondary flex max-h-[90vh] w-full flex-col overflow-y-auto sm:max-w-160!">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex flex-wrap items-center gap-2 pr-6">
            <DialogTitle className="text-xl leading-tight font-bold">{challenge.name}</DialogTitle>
            {/* Only surfaced when it needs explaining — an active challenge is the norm. */}
            {challenge.status === 'inactive' && (
              <CustomBadge variant={getStatusVariant(challenge.status)}>{CHALLENGE_STATUS_LABELS[challenge.status]}</CustomBadge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
              {CHALLENGE_TASK_TYPE_LABELS[challenge.taskType]}
            </span>
            <span>{CHALLENGE_REWARD_TYPE_LABELS[challenge.rewardType]}</span>
            <span>Tier: {getTierName(challenge)}</span>
          </div>
        </DialogHeader>

        <section className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700/60">
          <h4 className="mb-1 text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">Info entered during creation</h4>

          <InfoRow label="Status">
            <CustomBadge variant={getStatusVariant(challenge.status)}>{CHALLENGE_STATUS_LABELS[challenge.status]}</CustomBadge>
          </InfoRow>

          <InfoRow label="Task Type">{CHALLENGE_TASK_TYPE_LABELS[challenge.taskType]}</InfoRow>

          <InfoRow label="Goal (X)">{formatGoal(challenge)}</InfoRow>

          {challenge.taskType === 'buyMenuItem' && (
            <InfoRow label="Qualifying Items">{challenge.taskMenuItems.map((item) => item.name).join(', ') || '—'}</InfoRow>
          )}

          <InfoRow label="Reward Type">{rewardTypeValue}</InfoRow>

          {challenge.rewardType === 'menuItem' && (
            <InfoRow label="Reward Items">{challenge.rewardMenuItems.map((item) => item.name).join(', ') || '—'}</InfoRow>
          )}

          {challenge.rewardType === 'linkedReward' && <InfoRow label="Linked Reward">{challenge.linkedRewardName || '—'}</InfoRow>}

          {challenge.rewardType === 'customReward' && (
            <>
              <InfoRow label="Reward Title">{challenge.customRewardTitle || '—'}</InfoRow>
              {challenge.customRewardDescription && <InfoRow label="Reward Details">{challenge.customRewardDescription}</InfoRow>}
            </>
          )}

          {challenge.rewardType === 'specialTicket' && (
            <>
              <InfoRow label="Event">{ticket?.eventName || '—'}</InfoRow>
              <InfoRow label="Organization">{ticket?.organizationName || '—'}</InfoRow>
              <InfoRow label="Fast Track">{ticket?.isFastTrack ? 'Yes' : 'No'}</InfoRow>
            </>
          )}

          <InfoRow label="Claim Limit (total)">{challenge.claimLimit === null ? 'No limit' : challenge.claimLimit.toLocaleString()}</InfoRow>

          <InfoRow label="Repeat Completions">{challenge.repeatable ? 'Allowed' : 'Not allowed'}</InfoRow>

          <InfoRow label="End Time">{fDate(challenge.endDate, formatStr.split.date)}</InfoRow>

          <InfoRow label="Tier Limit">{getTierName(challenge)}</InfoRow>
        </section>

        <section>
          <h4 className="mb-2 text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">Performance</h4>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MetricTile label="Views" value={challenge.views.toLocaleString()} />
            <MetricTile label="Favorites" value={challenge.favorites.toLocaleString()} />
            <MetricTile label="View → Join" value={formatMetric(getParticipationRate(challenge), '%')} />

            <MetricTile label="Participants" value={challenge.participants.toLocaleString()} />
            <MetricTile label="Completions" value={challenge.completions.toLocaleString()} />
            <MetricTile label="Completion Rate" value={formatMetric(getCompletionRate(challenge), '%')} />

            <MetricTile label="Avg Progress" value={formatAvgProgress(challenge)} />
            <MetricTile label="Currently In Progress" value={challenge.inProgress.toLocaleString()} />

            {/* A capped challenge cares about stock left; an uncapped one about drop-off. */}
            {remainingClaims === null ? (
              <MetricTile label="Expired Without Completion" value={challenge.expired.toLocaleString()} />
            ) : (
              <MetricTile label="Remaining Claims" value={`${remainingClaims.toLocaleString()} / ${challenge.claimLimit?.toLocaleString()}`} />
            )}
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeDetailModal;
