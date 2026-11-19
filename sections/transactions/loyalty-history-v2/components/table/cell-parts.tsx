import { FC } from 'react';
import { COLLECTION_CONFIG, ENTRY_TYPE_CONFIG, POINTS_CLASS, SCOPE_CONFIG } from '../../config/config';
import { EntryType, LoyaltyReward, LoyaltyScope } from '../../types/types';

export const ScopeCell: FC<{ scope: LoyaltyScope; clubName?: string }> = ({ scope, clubName }) => {
  const config = SCOPE_CONFIG[scope];
  return (
    <div>
      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}>{config.label}</span>
      {clubName && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{clubName}</p>}
    </div>
  );
};

export const EntryTypeCell: FC<{ entryType: EntryType }> = ({ entryType }) => {
  const config = ENTRY_TYPE_CONFIG[entryType];
  return (
    <div>
      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}>{config.label}</span>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{entryType}</p>
    </div>
  );
};

export const PointsCell: FC<{ points: number; note?: string }> = ({ points, note }) => (
  <div>
    <p className={`font-semibold ${POINTS_CLASS(points)}`}>{points > 0 ? `+${points}` : points}</p>
    {note && <p className="text-xs text-gray-500 dark:text-gray-400">{note}</p>}
  </div>
);

export const RewardCell: FC<{ reward: LoyaltyReward | null }> = ({ reward }) => {
  if (!reward) return <span className="text-gray-400">—</span>;
  return (
    <div className="max-w-48">
      <p className="font-medium">{reward.label}</p>
      <p className="flex flex-wrap items-center gap-1 text-xs whitespace-normal text-gray-500 dark:text-gray-400">
        {reward.collectedBy ? (
          `QR · collected by ${reward.collectedBy}`
        ) : (
          <>
            {reward.qrIssued && 'QR issued · '}
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${COLLECTION_CONFIG[reward.collection].className}`}>
              {reward.collection}
            </span>
          </>
        )}
      </p>
    </div>
  );
};
