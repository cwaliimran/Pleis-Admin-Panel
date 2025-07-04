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
  Legend,
} from "recharts";

interface PageProps {
    data: Array<{ month: string; current: number; previous: number }>;
}

const TrendChart:FC<PageProps>=({data})=> {
  return (
    <div className=" ">

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => `$${v}`} />
          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
          {/* <Legend
            formatter={(value) => (
              <span className="text-sm text-gray-500">{value === "current" ? "This month" : "Last month"}</span>
            )}
          /> */}
          <Line
            type="monotone"
            dataKey="current"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="previous"
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendChart;
