import React, { FC } from 'react'
import { Cell, Pie, PieChart } from 'recharts'

interface PageProps {
    COLORS: string[]
    data: { name: string, value: number }[]
}
const ProgressChart: FC<PageProps> = ({ data, COLORS }) => {
    return (
         <div className=" relative flex flex-col items-center justify-center">
            <PieChart width={220} height={140}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="100"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={50}
                    outerRadius={70}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                </Pie>
            </PieChart>

            <div className="absolute top-[60px] text-xl font-bold text-center mt-3">41%</div>
            <div className="text-sm text-gray-700 font-semibold ">Attendees Confirmed</div>

            <div className="w-[200px] flex justify-between px-2 ">
                <span className="text-sm font-medium text-black">0</span>
                <span className="text-sm font-medium text-black">300</span>
            </div>
        </div>
    )
}

export default ProgressChart