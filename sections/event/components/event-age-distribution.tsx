'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface EventAgeDistributionProps {
  ageDemographics?: Array<{
    ageGroup: string;
    total?: number;
    Male?: number;
    Female?: number;
    Other?: number;
  }>;
}

const defaultAgeDemographics = [
  { ageGroup: '18-25', total: 0, Male: 0, Female: 0, Other: 0 },
  { ageGroup: '25-34', total: 0, Male: 0, Female: 0, Other: 0 },
  { ageGroup: '35-44', total: 0, Male: 0, Female: 0, Other: 0 },
  { ageGroup: '45-54', total: 0, Male: 0, Female: 0, Other: 0 },
  { ageGroup: '55+', total: 0, Male: 0, Female: 0, Other: 0 },
];

const EventAgeDistribution = ({ ageDemographics = [] }: EventAgeDistributionProps) => {
  const chartData = ageDemographics.map((item) => ({
    ageGroup: item.ageGroup,
    visitors: Number(item.total ?? item.Male ?? 0) + Number(item.Female ?? 0) + Number(item.Other ?? 0),
  }));

  const totalVisitors = chartData.reduce((sum, item) => sum + item.visitors, 0);
  const isEmpty = chartData.length === 0 || totalVisitors === 0;
  const maxValue = Math.max(...chartData.map((d) => d.visitors), 1);

  const topGroup = chartData.reduce(
    (prev, curr) => (curr.visitors > prev.visitors ? curr : prev),
    chartData[0] ?? { ageGroup: 'N/A', visitors: 0 }
  );
  const topGroupPercentage = totalVisitors > 0 ? Math.round((topGroup.visitors / totalVisitors) * 100) : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const count = payload[0].value;
      const percentage = totalVisitors > 0 ? Math.round((count / totalVisitors) * 100) : 0;
      return (
        <div
          style={{
            background: '#fff',
            color: '#222',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '10px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            minWidth: 160,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
          <div style={{ color: '#2563EB', fontWeight: 600 }}>
            visitors: {count} ({percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-112.5 shadow-lg dark:bg-[#171717]">
      <CardHeader>
        <h1 className="text-2xl font-bold">Audience Age Distribution</h1>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex h-70 w-full flex-col items-center justify-center gap-2">
            <p className="text-muted-foreground text-sm">No age distribution data available</p>
          </div>
        ) : (
          <div className="relative h-70 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                barCategoryGap={5}
              >
                <XAxis type="number" hide domain={[0, maxValue]} />
                <YAxis
                  type="category"
                  dataKey="ageGroup"
                  axisLine={false}
                  tickLine={false}
                  tick={({ x, y, payload }: any) => (
                    <text x={x} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize={12}>
                      {payload.value}
                    </text>
                  )}
                />
                <Tooltip cursor={false} content={<CustomTooltip />} />
                <Bar
                  dataKey="visitors"
                  fill="#2563EB"
                  barSize={28}
                  radius={[5, 5, 5, 5]}
                  background={{ fill: '#f1f5f9', radius: 5 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {!isEmpty && (
          <div className="mx-4 mt-4">
            <p className="text-muted-foreground text-[12px] font-medium">
              <span className="text-xl font-bold text-black dark:text-white">{topGroupPercentage}%</span> visitors are {topGroup.ageGroup} years old
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventAgeDistribution;
