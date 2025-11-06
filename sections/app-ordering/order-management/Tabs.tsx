import { FC } from 'react';
import type { TabId } from './types';

interface Props {
  active: TabId;
  onChange: (id: TabId) => void;
  counts: Record<TabId, number>;
}

export const Tabs: FC<Props> = ({ active, onChange, counts }) => {
  const tabs: { id: TabId; label: string }[] = [
    { id: 'active', label: 'Active Orders' },
    { id: 'preorders', label: 'Preorders' },
    { id: 'past', label: 'Past Orders' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto bg-white px-5 py-2 whitespace-nowrap">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex items-center gap-1 rounded-t-lg px-5 py-3 text-sm font-semibold transition ${active === t.id ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'} `}
        >
          {t.label}
          {counts[t.id] > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">{counts[t.id]}</span>
          )}
        </button>
      ))}
    </div>
  );
};
