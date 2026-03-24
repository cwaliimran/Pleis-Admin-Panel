'use client';

import { FC } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PageProps {
  data: Array<{ month: string; current: number; previous: number }>;
  previousLineStyle?: 'dotted' | 'solid';
}

/**
 * Formats large numbers into compact readable labels for the Y-axis.
 * e.g. 540979351 → "541M", 9016322518 → "9B", 4882 → "4.9K", 20 → "20"
 */
const formatCompact = (value: number): string => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
};

const TrendChart: FC<PageProps> = ({ data, previousLineStyle = 'dotted' }) => {
  const previousStrokeDasharray = previousLineStyle === 'dotted' ? '5 5' : '';

  return (
    <div>
      <ResponsiveContainer width="100%" height={270}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 5, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={14} />
          <YAxis axisLine={false} tickLine={false} tickFormatter={formatCompact} width={60} fontSize={12} />
          <Tooltip formatter={(value: any) => `${Number(value).toLocaleString()}`} />

          <Line type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="previous" stroke="#9ca3af" strokeWidth={2} strokeDasharray={previousStrokeDasharray} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
