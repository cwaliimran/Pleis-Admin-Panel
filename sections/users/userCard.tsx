import { Card, CardHeader } from '@/components/ui/card';
import React, { FC } from 'react';

interface InvoiceCardProps {
  item: {
    id: string;
    title: string;
    status: string;
    value: number;
    total?: number;
  };
}
const UserCard: FC<InvoiceCardProps> = ({ item }) => {
  return (
    <Card className="dark:bg-secondary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              {item.title.length > 20
                ? item.title.slice(0, 20) + '...'
                : item.title}
            </h3>
          </div>
          <div>
            <div className="flex h-[30px] w-[80px] items-center justify-center rounded-full bg-[#79D48B] text-sm font-semibold text-white">
              <p>{item.status}</p>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center text-4xl font-bold">
          0
          {item.total && (
            <sub className="ml-1 text-base font-medium">/ {item.total}k</sub>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default UserCard;
