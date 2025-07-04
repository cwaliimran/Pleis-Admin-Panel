"use client"

import { FC } from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts"



interface PageProps {
    chartData: Array<{ month: string; desktop: number; mobile: number }>
    chartConfig: {
        desktop: { label: string; color: string }
        mobile: { label: string; color: string }
    }
}
const EventPerformanceComparison: FC<PageProps> = ({ chartData ,chartConfig}) => {
    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                        dataKey="desktop"
                        fill={chartConfig.desktop.color}
                        radius={[4, 4, 0, 0]}
                        name={chartConfig.desktop.label}
                    />
                    <Bar
                        dataKey="mobile"
                        fill={chartConfig.mobile.color}
                        radius={[4, 4, 0, 0]}
                        name={chartConfig.mobile.label}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default EventPerformanceComparison