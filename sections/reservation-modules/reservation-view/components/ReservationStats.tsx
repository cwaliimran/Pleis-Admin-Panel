import { Card, CardContent } from '@/components/ui/card';

interface ReservationStatsProps {
  totalCovers: number;
  avgPartySize: string;
  totalBookings: number;
  reservationTypesCount: number;
}

export default function ReservationStats({ totalCovers, avgPartySize, totalBookings, reservationTypesCount }: ReservationStatsProps) {
  return (
    <Card className="mt-4 border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900">
      <CardContent className="p-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-zinc-500">Total Covers</div>
            <div className="text-2xl font-bold">{totalCovers}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-zinc-500">Avg Party Size</div>
            <div className="text-2xl font-bold">{avgPartySize}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-zinc-500">Total Bookings</div>
            <div className="text-2xl font-bold">{totalBookings}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-zinc-500">Reservation Types</div>
            <div className="text-2xl font-bold">{reservationTypesCount}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
