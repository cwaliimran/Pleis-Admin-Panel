import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FC } from 'react';

// ---------------------------------------------------------------------------
// Types — matches the marketing API response shape
// ---------------------------------------------------------------------------
interface MarketingUser {
  _id: string;
  profileIcon?: string;
  firstName: string;
  lastName: string;
}

interface MarketingItem {
  _id: string;
  userId: MarketingUser;
  title: string;
  description: string;
  budget: number;
  status: string;
  createdAt: string;
}

interface DashboardCardProps {
  item: MarketingItem;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const STATUS_STYLES: Record<string, string> = {
  pending: 'text-yellow-800 bg-yellow-100',
  active: 'text-green-800 bg-green-100',
  inactive: 'text-red-800 bg-red-100',
  completed: 'text-blue-800 bg-blue-100',
};

const getInitials = (first: string, last: string): string => `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const DashboardCard: FC<DashboardCardProps> = ({ item }) => {
  const user = item.userId;
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  const statusStyle = STATUS_STYLES[item.status] ?? 'text-gray-800 bg-gray-100';

  return (
    <Card className="dark:bg-secondary w-full shadow-lg md:h-full">
      <CardContent>
        {/* User info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            {user?.profileIcon ? <AvatarImage src={user.profileIcon} alt={fullName} className="cursor-pointer object-cover" /> : null}
            <AvatarFallback className="text-xs">{getInitials(user?.firstName, user?.lastName)}</AvatarFallback>
          </Avatar>
          <h1 className="text-sm font-medium">{fullName}</h1>
        </div>

        {/* Title & Description */}
        <h1 className="mt-2 text-lg font-semibold">{item.title}</h1>
        <p className="text-md my-3 text-gray-500">{item.description?.length > 100 ? `${item.description.slice(0, 100)}...` : item.description}</p>

        {/* Budget */}
        <div className="flex items-center gap-2">
          {/* <DollarSign size={16} className="text-muted-foreground" /> */}
          <span className="text-sm font-medium">
            Budget: <span className="font-bold">€{item.budget?.toLocaleString()}</span>
          </span>
        </div>

        <div className="mt-5">
          <Badge className={`${statusStyle} rounded-full px-3 py-1 text-xs font-medium`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
