'use client';

import { FC } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PageProps {
  chartData: Array<{
    month: string;
    fixed: number;
    prepay: number;
    minSpend?: number;
  }>;
  chartConfig: {
    fixed: { label: string; color: string };
    prepay: { label: string; color: string };
    minSpend?: { label: string; color: string };
  };
}

const VisitorRegionV2: FC<PageProps> = ({ chartData, chartConfig }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#ccc" strokeWidth={1} vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickMargin={10} style={{ fontSize: '14px' }} />
          <YAxis axisLine={false} className="text-[13px] font-bold" />
          <Tooltip />

          {/* Fixed */}
          <Bar dataKey="fixed" fill={chartConfig.fixed.color} radius={[10, 10, 0, 0]} name={chartConfig.fixed.label} />
          {/* Prepay */}
          <Bar dataKey="prepay" fill={chartConfig.prepay.color} radius={[10, 10, 0, 0]} name={chartConfig.prepay.label} />
          {/* Min Spend */}
          {chartConfig.minSpend && (
            <Bar dataKey="minSpend" fill={chartConfig.minSpend.color} radius={[10, 10, 0, 0]} name={chartConfig.minSpend.label} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitorRegionV2;
