
"use client";

import { FC } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

interface VisitorAgeProps {
    data: { ageGroup: string; visitors: number }[];
}

const VisitorAge: FC<VisitorAgeProps> = ({ data }) => {
    const maxValue = Math.max(...data.map((d) => d.visitors));
    const topVisitor = data[0];

    return (
        <div className="w-full h-[280px] relative">
            <div className="absolute right-13 top-[-10px] z-10 text-sm  ">
                10K
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 10, right: 50, left: 10, bottom: 10 }}
                    barCategoryGap={5}
                >
                    <XAxis type="number" hide domain={[0, maxValue]} />
                    <YAxis
                        type="category"
                        dataKey="ageGroup"
                        axisLine={false}
                        tickLine={false}
                        className="text-[12px]"
                    />
                    <Tooltip
                        cursor={false}
                    />
                    <Bar
                        dataKey="visitors"
                        fill="#2563EB"
                        barSize={28}
                        radius={[5, 5, 5, 5]}
                        background={{ fill: '#f1f5f9', radius: 5 }}

                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default VisitorAge;