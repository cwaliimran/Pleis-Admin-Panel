import { Card, CardHeader } from '@/components/ui/card';
import { Users, UserPlus, UserCheck, UserMinus } from 'lucide-react';
import React, { FC } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface LoyaltyStat {
  title: string;
  amount: number;
}

interface LoyaltyStatsCardProps {
  stat: LoyaltyStat;
}

// ---------------------------------------------------------------------------
// Icon mapping based on stat title
// ---------------------------------------------------------------------------
const ICON_MAP: Record<string, React.ElementType> = {
  'Total Members': Users,
  'New Members': UserPlus,
  'Active Members': UserCheck,
  'Left Members': UserMinus,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const LoyaltyStatsCard: FC<LoyaltyStatsCardProps> = ({ stat }) => {
  const Icon = ICON_MAP[stat.title] ?? Users;

  return (
    <Card className="dark:bg-secondary rounded-[8px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold text-gray-500 dark:text-gray-400">{stat.title}</h3>
          <div className="bg-primary/10 rounded-lg p-2">
            <Icon className="text-primary h-5 w-5" />
          </div>
        </div>
        <p className="mt-1 text-3xl font-bold">{stat.amount?.toLocaleString()}</p>
      </CardHeader>
    </Card>
  );
};

export default LoyaltyStatsCard;
