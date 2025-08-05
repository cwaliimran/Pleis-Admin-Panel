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
const VisitorRegion: FC<PageProps> = ({ chartData, chartConfig }) => {
  return (
    <div className="w-full h-[270px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#ccc" strokeWidth={1} vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickMargin={10}
            style={{ fontSize: "14px" }}
          />
          <YAxis axisLine={false} className="text-[13px] font-bold " />
          <Tooltip />
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
          <Bar
            dataKey="others"
            fill={chartConfig?.others?.color}
            radius={[10, 10, 0, 0]}
            name={chartConfig?.others?.label}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitorRegion;
