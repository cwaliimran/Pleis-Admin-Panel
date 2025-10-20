import { Card, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';
import React, { FC } from 'react';

interface InvoiceCardProps {
  item: {
    id: string;
    title: string;
    amount: number;
    status: string;
    raise?: string;
    menu?: boolean;
  };
}
const ReservationStatsCard: FC<InvoiceCardProps> = ({ item }) => {
  return (
    <Card className="dark:bg-secondary rounded-[8px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-md font-semibold">
              {/* {item.title.length > 20
                ? item.title.slice(0, 20) + "..."
                : item.title} */}
              {item.title}
            </h3>
          </div>
          <div>
            {item.menu && (
              <Select defaultValue="all">
                <SelectTrigger className="rounded-3xl">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent className="dark:bg-secondary">
                  <SelectGroup className="w-auto">
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="perday">Per Day</SelectItem>
                    <SelectItem value="overall">Overall</SelectItem>
                    <SelectItem value="upcoming">UpComing</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        {item.amount && (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-3xl font-bold">{item?.amount}</p>

            {item.raise && item.raise !== 'gold' && (
              <div className="flex items-center rounded-full bg-[#79D48B] px-3 py-1 text-xs font-semibold text-white">
                <TrendingUp />
                <p>{item.raise}</p>
              </div>
            )}
          </div>
        )}
      </CardHeader>
    </Card>
  );
};

export default ReservationStatsCard;
