"use client"

import { FC } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"



interface PageProps {
  chartData: Array<{ month: string; search: number;  }>
  chartConfig: {
    search: { label: string; color: string }
  }
}
const MostViewedEvent: FC<PageProps> = ({ chartData, chartConfig }) => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          {/* <CartesianGrid strokeDasharray="3 3" vertical={false} /> */}
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="search"
            fill={chartConfig.search.color}
            radius={[4, 4, 0, 0]}
            name={chartConfig.search.label}
            barSize={30}
          />
          

        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MostViewedEvent