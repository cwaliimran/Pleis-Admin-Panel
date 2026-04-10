'use client';

import { FC } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from 'next-themes';

interface PageProps {
  chartData: Array<{ month: string; search: number }>;
  chartConfig: {
    search: { label: string; color: string };
  };
}
const CustomTooltip = ({ active, payload, label }: any) => {
  const { theme } = useTheme ? useTheme() : { theme: 'light' };
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: theme === 'dark' ? '#fff' : '#fff',
          color: theme === 'dark' ? '#222' : '#222',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          padding: '10px 16px',
          minWidth: 120,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, opacity: 0.9 }}>{label}</div>
        {payload?.map((entry: any, idx: number) => (
          <div key={idx} style={{ color: entry?.color || '#2563EB', fontWeight: 500, fontSize: 15 }}>
            {entry?.name} : {entry?.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MostViewedEvent: FC<PageProps> = ({ chartData, chartConfig }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis
            dataKey="month"
            axisLine={false}
            style={{ fontSize: '14px' }}
          />
          {/* <CartesianGrid strokeDasharray="3 3" vertical={false} /> */}
          <YAxis axisLine={false} />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Bar
            dataKey="search"
            fill={chartConfig.search.color}
            radius={[4, 4, 0, 0]}
            name={chartConfig.search.label}
            barSize={34}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MostViewedEvent;
