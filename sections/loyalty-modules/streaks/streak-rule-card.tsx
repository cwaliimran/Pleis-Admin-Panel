import { Trash2 } from 'lucide-react';
import React from 'react';

interface StreakRuleCardProps {
  id?: string;
  visits: number | string;
  points: number | string;
  global?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
  handleDelete?: (id: string) => void;
}

const StreakRuleCard: React.FC<StreakRuleCardProps> = ({
  id,
  visits,
  points,
  global,
  selected = false,
  // onSelect,
  handleDelete,
}) => {
  return (
    <div
      // onClick={() => {
      //   if (id) onSelect?.(id);
      // }}
      className={`card dark:bg-secondary rounded-md border bg-white px-4 py-3 shadow-sm transition ${
        selected ? 'border-gray-200' : 'border-gray-200 hover:border-gray-300 dark:border-none dark:hover:border-gray-600'
      }`}
    >
      <div className="card-body">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center justify-start gap-4">
            <h5 className="flex size-10 items-center justify-center rounded-md bg-gray-800 text-lg font-semibold text-white dark:bg-gray-300 dark:text-black">
              {visits || 'N/A'}
            </h5>

            <div>
              <h5 className="card-title text-lg font-semibold">Every {visits || 'N/A'} Visits</h5>

              <p className="text-md font-medium">{points || 'N/A'} Points</p>

              {global && <span className="text-sm text-gray-500">48 hours expiry</span>}
            </div>
          </div>

          <button
            title="Delete Streak Rule"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (id) handleDelete?.(id);
            }}
            className="cursor-pointer rounded-md bg-red-100 p-1.5 transition hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
          >
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreakRuleCard;
