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
    // Legend,
} from "recharts";

interface PageProps {
    data: Array<{ month: string; followers: number }>;
}

const ViewsOverTime: FC<PageProps> = ({ data }) => {
    return (
        <div className=" ">
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="month" axisLine={false} />
                    <YAxis tickFormatter={(v) => `${v}`} axisLine={false} />
                    <Tooltip formatter={(value: any) => `${value.toLocaleString()}`} />
                    <Line
                        type="monotone"
                        dataKey="followers"
                        stroke="#3b82f6"
                        strokeWidth={4}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ViewsOverTime;
