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
  chartData: Array<{ month: string; males: number; females: number }>
  chartConfig: {
    males: { label: string; color: string }
    females: { label: string; color: string }
  }
}
const VisitorInterest: FC<PageProps> = ({ chartData, chartConfig }) => {
  return (
    <div className="w-full  h-[300px]  ">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="month" axisLine={false}/>
          {/* <CartesianGrid strokeDasharray="3 3" vertical={false} /> */}
          <CartesianGrid stroke="#ccc" strokeWidth={1} vertical={false} />
          <YAxis  axisLine={false}/>
          <Tooltip />
          <Bar
            dataKey="males"
            fill={chartConfig.males.color}
            radius={[4, 4, 0, 0]}
            name={chartConfig.males.label}
            barSize={13}
            
          />
          <Bar
            dataKey="females"
            fill={chartConfig.females.color}
            radius={[4, 4, 0, 0]}
            name={chartConfig.females.label}
            barSize={13}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default VisitorInterest