
"use client";

import { FC, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Text,
} from "recharts";

interface PageProps {
  data: Array<{ name: string; value: number }>;
  COLORS: string[];
}

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}
const renderCustomizedLabel: FC<LabelProps> = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
}) => {

  // Increase radius to push label outside
   const RADIAN = Math.PI / 180;

  const offset = 0; // distance outside the pie
  const radius = outerRadius + offset;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const lineX = cx + outerRadius * Math.cos(-midAngle * RADIAN);
  const lineY = cy + outerRadius * Math.sin(-midAngle * RADIAN);

  const label = `${(percent * 100).toFixed(0)}%`;
  const fontSize = 12;
  const circleRadius = 20;
  return (
    <g>
    

      <circle cx={x} cy={y} r={circleRadius} fill="#f3f4f6" />

      <text
        x={x}
        y={y}
        fill="#111827" 
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight={600}
      >
        {label}
      </text>
    </g>
  );
};




const GenderDonutChart: FC<PageProps> = ({ data, COLORS }) => {
  const isMobile = useIsMobile();
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={isMobile ? 90 : 130}
            innerRadius={isMobile ? 35 : 60}
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          {/* TOTAL in the center */}
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={16}
            fontWeight={600}
            fill="#4B5563"
          >
            {total}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenderDonutChart;
