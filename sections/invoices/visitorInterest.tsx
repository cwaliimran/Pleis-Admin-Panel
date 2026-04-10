'use client';

import { FC } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface PageProps {
  chartData: Array<{ month?: string; category?: string; males: number; females: number; others?: number }>;
  chartConfig: {
    males: { label: string; color: string };
    females: { label: string; color: string };
    others?: { label: string; color: string };
  };
}

/**
 * Custom tick renderer for the X-axis.
 * Renders labels vertically (rotated -90°) with a small font size
 * so that full category names like "Theater & Shows" fit without overlap.
 */
const VerticalAxisTick = ({ x, y, payload }: any) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="currentColor" fontSize={11} transform="rotate(-70)">
        {payload.value}
      </text>
    </g>
  );
};

const VisitorInterest: FC<PageProps> = ({ chartData, chartConfig }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 70 }}>
          <CartesianGrid stroke="#ccc" strokeWidth={1} vertical={false} />
          <XAxis dataKey="category" axisLine={false} tickLine={false} tick={<VerticalAxisTick />} interval={0} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="males" fill={chartConfig.males.color} radius={[10, 10, 0, 0]} name={chartConfig.males.label} barSize={13} />
          <Bar dataKey="females" fill={chartConfig.females.color} radius={[10, 10, 0, 0]} name={chartConfig.females.label} barSize={13} />
          {chartConfig.others ? <Bar dataKey="others" fill={chartConfig.others.color} radius={[10, 10, 0, 0]} name={chartConfig.others.label} barSize={13} /> : null}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitorInterest;