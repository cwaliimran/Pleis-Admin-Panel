'use client';

import { FC } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface PageProps {
  chartData: Array<{ month: string; males: number; females: number }>;
  chartConfig: {
    males: { label: string; color: string };
    females: { label: string; color: string };
  };
}

/**
 * Custom tick renderer for the X-axis.
 * - Truncates labels longer than `maxLen` characters and appends "…"
 * - Renders at a -35° angle so all category names stay visible
 */
const AngleAxisTick = ({ x, y, payload }: any) => {
  const maxLen = 12;
  const label = payload.value.length > maxLen ? `${payload.value.slice(0, maxLen)}…` : payload.value;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={10} textAnchor="end" fill="currentColor" fontSize={11} transform="rotate(-35)">
        {label}
      </text>
    </g>
  );
};

const VisitorInterest: FC<PageProps> = ({ chartData, chartConfig }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
          <CartesianGrid stroke="#ccc" strokeWidth={1} vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={<AngleAxisTick />} interval={0} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="males" fill={chartConfig.males.color} radius={[10, 10, 0, 0]} name={chartConfig.males.label} barSize={13} />
          <Bar dataKey="females" fill={chartConfig.females.color} radius={[10, 10, 0, 0]} name={chartConfig.females.label} barSize={13} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitorInterest;
