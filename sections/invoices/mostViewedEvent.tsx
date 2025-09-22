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

interface PageProps {
  chartData: Array<{ month: string; search: number }>;
  chartConfig: {
    search: { label: string; color: string };
  };
}
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
          <Tooltip cursor={false} />
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
