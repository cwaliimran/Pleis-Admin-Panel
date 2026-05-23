'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface EventTopInterestsProps {
  data?: Array<Record<string, any>>;
  isLoading?: boolean;
}

const VerticalAxisTick = ({ x, y, payload }: any) => (
  <g transform={`translate(${x},${y})`}>
    <text x={0} y={0} dy={4} textAnchor="end" fill="currentColor" fontSize={11} transform="rotate(-60)">
      {payload.value}
    </text>
  </g>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#fff',
          color: '#222',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '10px 16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          minWidth: 150,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
        <div style={{ color: '#2563EB', fontWeight: 600 }}>{payload[0]?.value} interested</div>
      </div>
    );
  }
  return null;
};

const resolveLabel = (item: Record<string, any>): string =>
  item.category ?? item.name ?? item.label ?? item.tag ?? item.venueType ?? 'Unknown';

const resolveTotal = (item: Record<string, any>): number => {
  if (item.total != null) return Number(item.total);
  if (item.count != null) return Number(item.count);
  if (item.value != null) return Number(item.value);
  return Number(item.males ?? 0) + Number(item.females ?? 0) + Number(item.others ?? 0);
};

const EventTopInterests = ({ data = [], isLoading = false }: EventTopInterestsProps) => {
  const chartData = data
    .map((item) => ({ label: resolveLabel(item), total: resolveTotal(item) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  return (
    <Card className="h-[450px] shadow-lg dark:bg-[#171717]">
      <CardHeader>
        <h3 className="text-xl font-semibold">Top Interests</h3>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full rounded-lg" />
        ) : (
          <div className="h-[330px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 16, left: -8, bottom: 80 }}
              >
                <CartesianGrid stroke="#e2e8f0" strokeWidth={1} vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={<VerticalAxisTick />}
                  interval={0}
                />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37,99,235,0.06)' }} />
                <Bar
                  dataKey="total"
                  fill="#2563EB"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                  name="Interested"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventTopInterests;
