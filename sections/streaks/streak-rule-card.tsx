import React from 'react';

interface StreakRuleCardProps {
  visits: number | string;
  points: number | string;
  global?: boolean;
}

const StreakRuleCard: React.FC<StreakRuleCardProps> = ({ visits, points, global }) => {
  return (
    <div className="card dark:bg-secondary rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-none">
      <div className="card-body">
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
      </div>
    </div>
  );
};

export default StreakRuleCard;
