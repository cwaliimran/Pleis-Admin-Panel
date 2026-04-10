import { Card, CardHeader } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { FC } from 'react';

interface InvoiceCardProps {
  item: {
    id: string;
    title: string;
    amount: number;
    status: string;
    percent?: boolean;
    raise?: string;
    menu?: boolean;
    isCurrency?: boolean;
  };
}
const TransactionCard: FC<InvoiceCardProps> = ({ item }) => {
  const formatAmount = () => {
    const value = Number(item?.amount ?? 0);

    if (item?.isCurrency) {
      return new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
        maximumFractionDigits: 2,
      }).format(value);
    }

    return value.toLocaleString();
  };

  return (
    <Card className="dark:bg-secondary rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-md font-semibold">{item.title}</h3>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-3xl font-bold">
            {formatAmount()}
            {item.percent && '%'}
          </p>
          {item.raise && item.raise !== 'gold' && (
            <div className="flex items-center rounded-full bg-[#79D48B] px-3 py-1 text-xs font-semibold text-white">
              <TrendingUp />
              <p>{item.raise}</p>
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default TransactionCard;
