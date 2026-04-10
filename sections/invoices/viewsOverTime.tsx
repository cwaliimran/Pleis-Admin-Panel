"use client";

import { FC } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  // Legend,
} from "recharts";
import { useTheme } from 'next-themes';

interface PageProps {
  data: Array<{ month: string; views: number }>;
  height?: number;
}

const formatCompact = (v: number): string => {
  if (Math.abs(v) >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return `${v}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  const { theme } = useTheme ? useTheme() : { theme: 'light' };
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#fff',
          color: '#222',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          padding: '10px 16px',
          minWidth: 120,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, opacity: 0.9 }}>{label}</div>
        {payload.map((entry: any, idx: number) => (
          <div key={idx} style={{ color: entry.color || '#3b82f6', fontWeight: 500, fontSize: 15 }}>
            {entry.name} : {Number(entry.value).toLocaleString()}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ViewsOverTime: FC<PageProps> = ({ data, height = 270 }) => {
  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.views)) : 0;
  const yAxisWidth = maxValue >= 1_000_000_000 ? 55 : maxValue >= 1_000_000 ? 50 : maxValue >= 1_000 ? 45 : 40;

  return (
    <div className=" ">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 16, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="month" axisLine={false} />
          <YAxis tickFormatter={formatCompact} axisLine={false} width={yAxisWidth} />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="views"
            name="Value"
            stroke="#3b82f6"
            strokeWidth={4}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ViewsOverTime;
