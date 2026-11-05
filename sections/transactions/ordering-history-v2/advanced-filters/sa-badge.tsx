import { FC } from 'react';

const SaBadge: FC<{ className?: string }> = ({ className = '' }) => (
  <span
    className={`flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 ${className}`}
  >
    SA
  </span>
);

export default SaBadge;
