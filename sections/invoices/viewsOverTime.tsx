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
    data: Array<{ month: string; views: number }>;
}

const ViewsOverTime: FC<PageProps> = ({ data }) => {
    return (
        <div className=" ">
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `${v}`} />
                    <Tooltip formatter={(value: number) => `${value.toLocaleString()}`} />
                    <Line
                        type="monotone"
                        dataKey="views"
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
