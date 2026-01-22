import React, { FC } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

interface PageProps {
  COLORS: string[];
  data: { name: string; value: number }[];
  percentage: number;
  min: number;
  max: number;
}
const ProgressChart: FC<PageProps> = ({ data, COLORS, percentage, min, max }) => {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <PieChart width={220} height={140}>
        <Pie data={data} cx="50%" cy="100" startAngle={180} endAngle={0} innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>

      <div className="absolute top-[60px] mt-3 text-center text-xl font-bold">{percentage}%</div>
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-400">Attendees Confirmed</div>

      <div className="flex w-[200px] justify-between px-2">
        <span className="text-sm font-medium text-black dark:text-white">{min}</span>
        <span className="text-sm font-medium text-black dark:text-white">{max}</span>
      </div>
    </div>
  );
};

export default ProgressChart;
