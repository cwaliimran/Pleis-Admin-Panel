"use client";

import { FC } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from 'next-themes';

interface PageProps {
  chartData: Array<{
    month: string;
    males: number;
    females: number;
    others?: number;
  }>;
  chartConfig: {
    males: { label: string; color: string };
    females: { label: string; color: string };
    others?: { label: string; color: string };
  };
}

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
          <div key={idx} style={{ color: entry.color || '#2563EB', fontWeight: 500, fontSize: 15 }}>
            {entry.name} : {entry.value.toLocaleString()}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const VisitorRegion: FC<PageProps> = ({ chartData, chartConfig }) => {
  // Format large numbers with K, M, B suffixes
  const formatYAxis = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <div className="w-full h-[270px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
        >
          <CartesianGrid stroke="#ccc" strokeWidth={1} vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickMargin={10}
            style={{ fontSize: "14px" }}
          />
          <YAxis 
            axisLine={false} 
            className="text-[13px] font-bold"
            tickFormatter={formatYAxis}
            width={60}
          />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Bar
            dataKey="males"
            fill={chartConfig.males.color}
            radius={[10, 10, 0, 0]}
            name={chartConfig.males.label}
          />
          <Bar
            dataKey="females"
            fill={chartConfig.females.color}
            radius={[10, 10, 0, 0]}
            name={chartConfig.females.label}
          />
          {chartConfig.others && (
            <Bar
              dataKey="others"
              fill={chartConfig.others.color}
              radius={[10, 10, 0, 0]}
              name={chartConfig.others.label}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitorRegion;