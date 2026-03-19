'use client';

import { FC } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PageProps {
  chartData: Array<{ month: string; search: number }>;
  chartConfig: {
    search: { label: string; color: string };
  };
}

/**
 * Custom tick renderer for the X-axis.
 * Renders labels vertically (rotated -70°) with a small font size
 * so that full month names like "September", "November" fit without overlap.
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

const MostViewedEvent: FC<PageProps> = ({ chartData, chartConfig }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 70 }}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={<VerticalAxisTick />} interval={0} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip cursor={false} />
          <Bar dataKey="search" fill={chartConfig.search.color} radius={[4, 4, 0, 0]} name={chartConfig.search.label} barSize={34} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MostViewedEvent;
