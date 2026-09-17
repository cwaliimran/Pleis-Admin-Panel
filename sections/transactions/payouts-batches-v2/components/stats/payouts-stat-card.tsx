import { Card, CardHeader } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { FC } from 'react';

interface PayoutsStatCardProps {
  title: string;
  value: string;
  note: string;
  raise: string;
}

const PayoutsStatCard: FC<PayoutsStatCardProps> = ({ title, value, note, raise }) => (
  <Card className="dark:bg-secondary rounded-xl">
    <CardHeader>
      <h3 className="text-md font-semibold">{title}</h3>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-3xl font-bold">{value}</p>
        <div className="flex items-center rounded-full bg-[#79D48B] px-3 py-1 text-xs font-semibold text-white">
          <TrendingUp className="h-4 w-4" />
          <p>{raise}</p>
        </div>
      </div>

      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{note}</p>
    </CardHeader>
  </Card>
);

export default PayoutsStatCard;
