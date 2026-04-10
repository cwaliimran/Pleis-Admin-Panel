// "use client";

// import { FC } from "react";
// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     ResponsiveContainer,
//     Tooltip,
// } from "recharts";

// interface VisitorAgeProps {
//     data: { ageGroup: string; visitors: number }[];
// }

// const VisitorAge: FC<VisitorAgeProps> = ({ data }) => {
//     const maxValue = Math.max(...data.map((d) => d.visitors));
//     const topVisitor = data[0];

//     return (
//         <div className="w-full h-[280px] relative">
//             <div className="absolute right-13 top-[-10px] z-10 text-sm  ">
//                 10K
//             </div>

//             <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                     data={data}
//                     layout="vertical"
//                     margin={{ top: 10, right: 50, left: 10, bottom: 10 }}
//                     barCategoryGap={5}
//                 >
//                     <XAxis type="number" hide domain={[0, maxValue]} />
//                     <YAxis
//                         type="category"
//                         dataKey="ageGroup"
//                         axisLine={false}
//                         tickLine={false}
//                         className="text-[12px]"
//                     />
//                     <Tooltip
//                         cursor={false}
//                     />
//                     <Bar
//                         dataKey="visitors"
//                         fill="#2563EB"
//                         barSize={28}
//                         radius={[5, 5, 5, 5]}
//                         background={{ fill: '#f1f5f9', radius: 5 }}

//                     />
//                 </BarChart>
//             </ResponsiveContainer>
//         </div>
//     );
// };

// export default VisitorAge;

"use client";

import { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
// Custom tooltip for dark mode label visibility
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', color: '#222', border: '1px solid #e5e7eb', borderRadius: 4, padding: 8, boxShadow: '0 2px 8px #0001' }}>
        <div style={{ color: '#222', fontWeight: 600, marginBottom: 2, whiteSpace: 'pre-line' }}>{label}</div>
        <div style={{ color: '#2563EB' }}>visitors : {payload[0].value}</div>
      </div>
    );
  }
  return null;
};

interface VisitorAgeProps {
  data: { ageGroup: string; visitors: number }[];
  noHeaderTotal?: boolean;
  direction?: "vertical" | "horizontal";
  height?: number;
}

const VisitorAgeChart: FC<VisitorAgeProps> = ({
  data,
  // noHeaderTotal = true,
  direction = "vertical",
  height = 280,
}) => {
  const maxValue = Math.max(...data.map((d) => d.visitors));

  const isVertical = direction === "vertical";

  return (
    <div className={`w-full relative`} style={{ height }}>
      {/* {isVertical && noHeaderTotal && (
        <div className="absolute right-13 top-[-10px] z-10 text-sm">10K</div>
      )} */}

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={isVertical ? "vertical" : "horizontal"}
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          barCategoryGap={5}
        >
          {isVertical ? (
            <>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="ageGroup"
                axisLine={false}
                tickLine={false}
                // width={140}
                tick={({ x, y, payload }) => {
                  const label = payload.value;
                  const maxLen = 6;
                  const showTooltip = label.length > maxLen;
                  const display = showTooltip ? label.slice(0, maxLen) + '…' : label;
                  return (
                    <g>
                      <title>{showTooltip ? label : undefined}</title>
                      <text x={x} y={y + 4} textAnchor="end" fill="#cbd5e1" fontSize="12">
                        {display}
                      </text>
                    </g>
                  );
                }}
              />
            </>
          ) : (
            <>
              <XAxis
                type="category"
                dataKey="ageGroup"
                axisLine={false}
                tickLine={false}
                className="text-[12px]"
              />
              <YAxis type="number" domain={[0, maxValue]} hide />
            </>
          )}

          <RechartsTooltip cursor={false} content={<CustomTooltip />} />

          <Bar
            dataKey="visitors"
            fill="#2563EB"
            barSize={28}
            radius={[5, 5, 5, 5]}
            background={{ fill: "#f1f5f9", radius: 5 }}
            shape={(props: any) => {
              // Ensure a minimum bar width for small values
              const { x, y, width, height, fill } = props;
              const minWidth = 10; // Minimum width in px
              const adjustedWidth = width < minWidth && width > 0 ? minWidth : width;
              return (
                <rect
                  x={x}
                  y={y}
                  width={adjustedWidth}
                  height={height}
                  fill={fill}
                  rx={5}
                  ry={5}
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitorAgeChart;
