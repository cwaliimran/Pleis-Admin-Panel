import { FC } from 'react';
import {
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';


interface PageProps {
    data: { day: string; value: number }[];
}
const TicketPerformanceChart: FC<PageProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={330}>
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false}/>
                <YAxis tick={{ fontSize: 12 }} axisLine={false} />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#3b82f6' }}
                    activeDot={{ r: 6 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
export default TicketPerformanceChart;