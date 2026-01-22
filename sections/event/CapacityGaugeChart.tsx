import { Card, CardHeader } from '@/components/ui/card';
import ProgressChart from './progressChart';

export default function CapacityGaugeChart({ data }: { data?: any }) {
  const confirmed = data?.attendeesCount || 0;
  const total = data?.ticketingStats?.grandTotal?.count || 0;
  const percentage = total > 0 ? Math.round((confirmed / total) * 100) : 0;

  return (
    <Card className="text-center shadow-lg dark:bg-[#171717]">
      <CardHeader>
        <h2 className="text-md font-semibold">Capacity vs. Attendance</h2>
        <p className="text-center text-sm text-slate-500">See how many attendees have confirmed versus the event capacity.</p>
      </CardHeader>

      <ProgressChart
        COLORS={['#3b82f6', '#e5e7eb']}
        data={[
          { name: 'Confirmed', value: confirmed },
          { name: 'Remaining', value: total - confirmed },
        ]}
        percentage={percentage}
        min={0}
        max={total}
      />
    </Card>
  );
}
