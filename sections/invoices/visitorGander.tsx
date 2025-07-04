"use client"

import { FC } from "react"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts"


interface PageProps {
    data: Array<{ name: string; value: number }>
    COLORS: string[]
}

const GenderDonutChart: FC<PageProps> = ({ data, COLORS }) => {
    return (
        <div className="w-full h-[400px] ">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Tooltip />
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60} 
                        fill="#8884d8"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}


export default GenderDonutChart