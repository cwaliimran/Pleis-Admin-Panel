
"use client";

import { FC } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    LabelList,
    Tooltip,
} from "recharts";

interface VisitorAgeProps {
    data: { ageGroup: string; visitors: number }[];
}

const VisitorAge: FC<VisitorAgeProps> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.visitors));

    return (
        <>
            <div className="w-full h-[400px] ">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                        barCategoryGap={10}
                    >
                        <XAxis type="number" hide domain={[0, maxValue]} />
                        <YAxis type="category" dataKey="ageGroup" axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar
                            dataKey="visitors"
                            fill="#2563EB"
                            background={{ fill: '#f1f5f9',radius: 10 }}
                            radius={[10, 10, 10, 10]}
                        >
                            <LabelList dataKey="visitors" position="right" fill="#000" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Summary text */}
           
        </>
    );
};

export default VisitorAge;
