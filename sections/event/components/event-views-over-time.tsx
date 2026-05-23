'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface EventViewsOverTimeProps {
  viewData?: Array<{
    ageGroup: string;
    visitors: number;
  }>;
  isLoading?: boolean;
}

const defaultViewData = [
  { ageGroup: 'Jan', visitors: 0 },
  { ageGroup: 'Feb', visitors: 0 },
  { ageGroup: 'Mar', visitors: 0 },
  { ageGroup: 'Apr', visitors: 0 },
  { ageGroup: 'May', visitors: 0 },
  { ageGroup: 'Jun', visitors: 0 },
  { ageGroup: 'Jul', visitors: 0 },
  { ageGroup: 'Aug', visitors: 0 },
  { ageGroup: 'Sep', visitors: 0 },
  { ageGroup: 'Oct', visitors: 0 },
  { ageGroup: 'Nov', visitors: 0 },
  { ageGroup: 'Dec', visitors: 0 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#fff',
          color: '#222',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          padding: '10px 16px',
          minWidth: 130,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4, opacity: 0.6 }}>{label}</div>
        <div style={{ color: '#2563EB', fontWeight: 700, fontSize: 15 }}>{payload[0]?.value} Views</div>
      </div>
    );
  }
  return null;
};

const EventViewsOverTime = ({ viewData = defaultViewData, isLoading = false }: EventViewsOverTimeProps) => {
  const data = viewData.length > 0 ? viewData : defaultViewData;

  const totalViews = data.reduce((sum, item) => sum + Number(item.visitors ?? 0), 0);
  const topSlot = data.reduce(
    (prev, curr) => (Number(curr.visitors ?? 0) > Number(prev.visitors ?? 0) ? curr : prev),
    data[0] ?? { ageGroup: 'N/A', visitors: 0 }
  );
  const topSlotPercentage = totalViews > 0 ? Math.round((Number(topSlot.visitors ?? 0) / totalViews) * 100) : 0;

  return (
    <Card className="h-[450px] dark:bg-[#171717]">
      <CardHeader>
        <h1 className="text-2xl font-bold">Views Over Time</h1>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[280px] w-full rounded-lg" />
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={true} stroke="#e2e8f0" opacity={0.6} />
                <XAxis
                  dataKey="ageGroup"
                  axisLine={false}
                  tickLine={false}
                  style={{ fontSize: '12px' }}
                  interval="preserveStartEnd"
                />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#2563EB', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mx-4 mt-4">
          <p className="text-muted-foreground text-[12px] font-medium">
            <span className="text-xl font-bold text-black dark:text-white">{topSlotPercentage}%</span> views came from {topSlot.ageGroup}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventViewsOverTime;
