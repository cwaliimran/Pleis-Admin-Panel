import { Card, CardHeader } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { FC } from 'react';
import { TransactionStat } from '../../types/types';

const TransactionStatCard: FC<{ stat: TransactionStat }> = ({ stat }) => (
  <Card className="dark:bg-secondary rounded-xl">
    <CardHeader>
      <h3 className="text-md font-semibold">{stat.title}</h3>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-3xl font-bold">{stat.value}</p>
        <div className="flex items-center rounded-full bg-[#79D48B] px-3 py-1 text-xs font-semibold text-white">
          <TrendingUp className="h-4 w-4" />
          <p>{stat.raise}</p>
        </div>
      </div>

      {stat.note && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{stat.note}</p>}
    </CardHeader>
  </Card>
);

export default TransactionStatCard;
