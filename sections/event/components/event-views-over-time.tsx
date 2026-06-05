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

const EventViewsOverTime = ({ viewData = [], isLoading = false }: EventViewsOverTimeProps) => {
  const totalViews = viewData.reduce((sum, item) => sum + Number(item.visitors ?? 0), 0);
  const isEmpty = viewData.length === 0 || totalViews === 0;

  const topSlot = !isEmpty
    ? viewData.reduce(
        (prev, curr) => (Number(curr.visitors ?? 0) > Number(prev.visitors ?? 0) ? curr : prev),
        viewData[0]
      )
    : null;
  const topSlotPercentage = topSlot ? Math.round((Number(topSlot.visitors) / totalViews) * 100) : 0;

  return (
    <Card className="h-[450px] dark:bg-[#171717]">
      <CardHeader>
        <h1 className="text-2xl font-bold">Views Over Time</h1>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[280px] w-full rounded-lg" />
        ) : isEmpty ? (
          <div className="flex h-[300px] w-full flex-col items-center justify-center gap-2">
            <p className="text-muted-foreground text-sm">No views data available</p>
          </div>
        ) : (
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={true} stroke="#e2e8f0" opacity={0.6} />
                <XAxis
                  dataKey="ageGroup"
                  axisLine={false}
                  tickLine={false}
                  style={{ fontSize: '12px' }}
                  interval="preserveStartEnd"
                />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: '12px' }} allowDecimals={false} />
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

        {!isLoading && !isEmpty && topSlot && (
          <div className="mx-4 mt-4">
            <p className="text-muted-foreground text-[12px] font-medium">
              <span className="text-xl font-bold text-black dark:text-white">{topSlotPercentage}%</span> views came from {topSlot.ageGroup}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventViewsOverTime;
