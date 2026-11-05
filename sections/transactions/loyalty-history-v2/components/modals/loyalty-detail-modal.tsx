'use client';

import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { FC } from 'react';
import { LoyaltyEntry } from '../../types/types';
import { InfoLine, SectionHeading } from '../table/detail-parts';

interface LoyaltyDetailModalProps {
  open: boolean;
  onClose: () => void;
  entry: LoyaltyEntry | null;
}

const LoyaltyDetailModal: FC<LoyaltyDetailModalProps> = ({ open, onClose, entry }) => {
  if (!entry) return null;

  const { entry: entryInfo, pointMath, reward, rewardEmptyNote } = entry.detail;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col overflow-hidden md:max-w-175!">
          <DialogHeader className="shrink-0 border-b pb-3 dark:border-gray-700">
            <DialogTitle>Loyalty entry · {entry.userName}</DialogTitle>
            <p className="text-muted-foreground text-sm capitalize">
              {entry.scope} scope · {entry.timestamp}
            </p>
          </DialogHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-1 py-4">
            <section>
              <SectionHeading title="Entry" />
              <InfoLine label="Type" value={entryInfo.type} />
              <InfoLine label="Source" value={entryInfo.source} />
              <InfoLine label="Description" value={entryInfo.description} />
              <InfoLine label="Paired entry" value={entryInfo.pairedEntryNote} />
              <InfoLine label="Transaction" value={entryInfo.transactionId || '—'} />
            </section>

            <section>
              <SectionHeading title="Point math · base = bill € × (10 + tier 1–5 + status 1–5), cap 20/EUR" />
              <InfoLine label="Base points" value={pointMath.basePoints} />
              <InfoLine label="Promotion delta · applies to base, never compounds" value={pointMath.promotionDelta >= 0 ? `+${pointMath.promotionDelta}` : pointMath.promotionDelta} />
              <InfoLine label="Total change" value={pointMath.totalChange >= 0 ? `+${pointMath.totalChange}` : pointMath.totalChange} />
              <InfoLine label="Balance after" value={pointMath.balanceAfter} />
              <InfoLine label="Tier / status at the time" value={pointMath.tierStatusAtTime} />
              <InfoLine label="Expires" value={pointMath.expires} />
            </section>

            <section>
              <SectionHeading title="Reward" />
              {reward ? (
                <>
                  <InfoLine label="Reward" value={reward.label} />
                  <InfoLine label="Kind" value={reward.kind === 'internal' ? 'Internal' : 'Third-party partner'} />
                  <InfoLine label="QR issued" value={reward.qrIssued ? 'Yes' : 'No'} />
                  <InfoLine label="Collection" value={reward.collection} />
                  <InfoLine label="Collected by" value={reward.collectedBy} />
                  <InfoLine label="Collected via" value={reward.collectedVia} />
                </>
              ) : (
                <p className="text-muted-foreground text-sm">{rewardEmptyNote}</p>
              )}
            </section>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default LoyaltyDetailModal;
