'use client';

import { FC } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ChartDataItem {
  month: string;
  total: number;
  net: number;
}

interface RevenueTrendsChartProps {
  chartData: Array<ChartDataItem>;
  chartConfig: {
    total: { label: string; color: string };
    net: { label: string; color: string };
  };
}

const RevenueTrendsChart: FC<RevenueTrendsChartProps> = ({ chartData, chartConfig }) => {
  return (
    <div className="h-full w-full pl-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#ccc" strokeWidth={1} vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickMargin={10} style={{ fontSize: '14px' }} />
          <YAxis axisLine={false} className="text-[13px] font-bold" />
          <Tooltip />

          {/* Bar for TOTAL Revenue */}
          <Bar dataKey="total" fill={chartConfig.total.color} radius={[10, 10, 0, 0]} name={chartConfig.total.label} />
          {/* Bar for NET Income */}
          <Bar dataKey="net" fill={chartConfig.net.color} radius={[10, 10, 0, 0]} name={chartConfig.net.label} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueTrendsChart;
