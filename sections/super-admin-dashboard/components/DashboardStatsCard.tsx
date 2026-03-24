import { Card, CardHeader } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';
import React, { FC } from 'react';
import { formatCompactNumber } from '@/utils/format-compact-number';

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

/** Prefix monetary stats with € */
const MONETARY_KEYS = new Set(['averageTicketPrice', 'averageRevenuePerUser', 'totalRevenue']);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const DashboardStatsCard: FC<DashboardStatsCardProps> = ({ stat }) => {
  const isMoney = MONETARY_KEYS.has(stat.key);
  const isPositiveGrowth = stat.growth >= 0;
  const prefix = isMoney ? '€' : '';
  const displayValue = `${prefix}${formatCompactNumber(stat.value)}`;

  // Full precise value shown on hover
  const fullValue = `${prefix}${stat.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <Card className="dark:bg-secondary rounded-[8px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold">{stat.title}</h3>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-3xl font-bold" title={fullValue}>
            {displayValue}
          </p>

          {stat.growth !== undefined && (
            <div
              className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white ${
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

// import { Card, CardHeader } from '@/components/ui/card';
// import { TrendingDown, TrendingUp } from 'lucide-react';
// import React, { FC } from 'react';

// // ---------------------------------------------------------------------------
// // Types — matches the API stats[] shape
// // ---------------------------------------------------------------------------
// interface SubFilter {
//   key: string;
//   label: string;
// }

// interface StatItem {
//   key: string;
//   title: string;
//   value: number;
//   growth: number;
//   subFilters: SubFilter[];
//   selectedSubFilter: string;
// }

// interface DashboardStatsCardProps {
//   stat: StatItem;
// }

// // ---------------------------------------------------------------------------
// // Helpers
// // ---------------------------------------------------------------------------

// /** Prefix monetary stats with € */
// const MONETARY_KEYS = new Set(['averageTicketPrice', 'averageRevenuePerUser', 'totalRevenue', 'totalMobilePayments']);

// /**
//  * Formats a number for display inside a stat card.
//  * - Small numbers (< 1M): full format with commas → "12,652" or "39.66"
//  * - Large numbers (≥ 1M): compact form → "541.0M", "3.6B"
//  */
// const formatValue = (value: number): string => {
//   const abs = Math.abs(value);
//   if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
//   if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
//   if (Number.isInteger(value)) return value.toLocaleString();
//   return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
// };

// // ---------------------------------------------------------------------------
// // Component
// // ---------------------------------------------------------------------------
// const DashboardStatsCard: FC<DashboardStatsCardProps> = ({ stat }) => {
//   const isMoney = MONETARY_KEYS.has(stat.key);
//   const isPositiveGrowth = stat.growth >= 0;
//   const displayValue = `${isMoney ? '€' : ''}${formatValue(stat.value)}`;

//   // Full precise value shown on hover via title attribute
//   const fullValue = `${isMoney ? '€' : ''}${stat.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

//   return (
//     <Card className="dark:bg-secondary rounded-[8px]">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <h3 className="text-md font-semibold">{stat.title}</h3>
//         </div>

//         <div className="mt-2 flex items-center justify-between gap-2">
//           <p className="min-w-0 truncate text-3xl font-bold" title={fullValue}>
//             {displayValue}
//           </p>

//           {stat.growth !== undefined && (
//             <div
//               className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white ${
//                 isPositiveGrowth ? 'bg-[#79D48B]' : 'bg-red-400'
//               }`}
//             >
//               {isPositiveGrowth ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
//               <span>{Math.abs(stat.growth)}%</span>
//             </div>
//           )}
//         </div>
//       </CardHeader>
//     </Card>
//   );
// };

// export default DashboardStatsCard;
