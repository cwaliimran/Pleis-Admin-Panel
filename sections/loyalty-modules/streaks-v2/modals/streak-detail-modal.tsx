'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fDate } from '@/utils/format-time';
import React from 'react';
import StreakBadgeLabel from '../components/streak-badge-label';
import { STREAK_COUNT_BASE_LABELS, STREAK_DATE_TIME_FORMAT } from '../constants';
import { StreakMember, StreakRules } from '../types';
import { formatThresholdLadder } from '../utils';

interface StreakDetailModalProps {
  open: boolean;
  member: StreakMember | null;
  rules: StreakRules | null;
  onClose: () => void;
}

const InfoRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-center justify-between gap-4 border-b border-gray-200 py-2.5 last:border-b-0 dark:border-gray-700/60">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-right text-sm font-semibold text-gray-900 dark:text-gray-100">{children}</span>
  </div>
);

const MetricTile: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700/60">
    <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">{label}</p>
    <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">{children}</div>
  </div>
);

export const StreakDetailModal: React.FC<StreakDetailModalProps> = ({ open, member, rules, onClose }) => {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="dark:bg-secondary flex max-h-[90vh] w-full flex-col overflow-y-auto sm:max-w-140!">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="pr-6 text-xl leading-tight font-bold">{member.username}</DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">{member.name} · Member streak detail</p>
        </DialogHeader>

        <section className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700/60">
          <h4 className="mb-1 text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">Active streak rule</h4>

          <InfoRow label="Rule">{rules ? `${formatThresholdLadder(rules)} visits` : 'Not set'}</InfoRow>

          <InfoRow label="Count base">{rules ? STREAK_COUNT_BASE_LABELS[rules.countBase] : 'Not set'}</InfoRow>

          <InfoRow label="Last Visit">{fDate(member.lastVisitAt, STREAK_DATE_TIME_FORMAT) || '—'}</InfoRow>
        </section>

        <section>
          <h4 className="mb-2 text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">Streak stats</h4>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <MetricTile label="Current Streak">{member.streak.toLocaleString()}</MetricTile>
            <MetricTile label="Longest Streak">{member.longestStreak.toLocaleString()}</MetricTile>

            <MetricTile label="Highest Badge (kept on reset)">
              <StreakBadgeLabel badge={member.highestBadge} className="text-xl font-semibold" />
            </MetricTile>

            <MetricTile label="Total Visits">{member.visits.toLocaleString()}</MetricTile>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default StreakDetailModal;
