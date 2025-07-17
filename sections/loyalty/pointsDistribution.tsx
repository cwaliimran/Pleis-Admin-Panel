import { FC } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from 'recharts';
interface PointsDistributionProps {
    data: { ageGroup: string; visitors: number }[];
}
const PointsDistribution: FC<PointsDistributionProps> = ({ data }) => {

    const maxValue = Math.max(...data.map((d) => d.visitors));

    return (
        <div className="w-full h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 0, right: 50, left: 20, bottom: 0 }}
                    barCategoryGap={5}
                >
                    <XAxis type="number" hide domain={[0, maxValue]} />
                    <YAxis type="category" dataKey="ageGroup" axisLine={false} tickLine={false} hide />
                    <Tooltip />
                    <Bar
                        dataKey="visitors"
                        fill="#2563EB"
                        background={{ fill: '#f1f5f9', radius: 10 }}
                        radius={[10, 10, 10, 10]}

                    >
                        {/* Show ageGroup as custom label */}
                        <LabelList dataKey="ageGroup" content={CustomAgeLabel} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PointsDistribution;


const CustomAgeLabel = ({ x, y, width, value }: any) => {
    return (
        <text
            x={x + 0 + 10} 
            y={y + 0}           
            fill="gray"
            fontSize={16}
        >
            {value}
        </text>
    );
};
