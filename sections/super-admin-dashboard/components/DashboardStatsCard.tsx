import { Card, CardHeader } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';
import React, { FC } from 'react';

// ---------------------------------------------------------------------------
// Types — matches the API stats[] shape
// ---------------------------------------------------------------------------
interface SubFilter {
  key: string;
  label: string;
}

interface StatItem {
  key: string;
  title: string;
  value: number;
  growth: number;
  subFilters: SubFilter[];
  selectedSubFilter: string;
}

interface DashboardStatsCardProps {
  stat: StatItem;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format large numbers with commas and up to 2 decimal places */
const formatValue = (value: number): string => {
  if (Number.isInteger(value)) {
    return value.toLocaleString();
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

/** Prefix monetary stats with $ */
const MONETARY_KEYS = new Set(['averageTicketPrice', 'averageRevenuePerUser']);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const DashboardStatsCard: FC<DashboardStatsCardProps> = ({ stat }) => {
  const isMoney = MONETARY_KEYS.has(stat.key);
  const isPositiveGrowth = stat.growth >= 0;

  return (
    <Card className="dark:bg-secondary rounded-[8px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold">{stat.title}</h3>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-3xl font-bold">
            {isMoney && '€'}
            {formatValue(stat.value)}
          </p>

          {stat.growth !== undefined && (
            <div
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white ${
                isPositiveGrowth ? 'bg-[#79D48B]' : 'bg-red-400'
              }`}
            >
              {isPositiveGrowth ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(stat.growth)}%</span>
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default DashboardStatsCard;
