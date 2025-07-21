// "use client";

// import { FC } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// interface PageProps {
//     data: Array<{ month: string; current: number; previous: number }>;
// }

// const TrendChart:FC<PageProps>=({data})=> {
//   return (
//     <div className=" ">

//       <ResponsiveContainer width="100%" height={270}>
//         <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
//           <CartesianGrid strokeDasharray="4 4" />
//           <XAxis dataKey="month"  axisLine={false}/>
//           <YAxis tickFormatter={(v) => `${v}`} axisLine={false} />
//           <Tooltip formatter={(value: number) => `${value.toLocaleString()}`} />
          
//           <Line
//             type="monotone"
//             dataKey="current"
//             stroke="#3b82f6"
//             strokeWidth={2}
//             dot={false}
//           />
//           <Line
//             type="monotone"
//             dataKey="previous"
//             stroke="#9ca3af"
//             strokeWidth={2}
//             strokeDasharray="5 5"
//             dot={false}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// export default TrendChart;

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
  data: Array<{ month: string; current: number; previous: number }>;
  previousLineStyle?: "dotted" | "solid"; // NEW prop to control the previous line style
}

const TrendChart: FC<PageProps> = ({ data, previousLineStyle = "dotted" }) => {
  // Define stroke pattern based on prop
  const previousStrokeDasharray = previousLineStyle === "dotted" ? "5 5" : "";

  return (
    <div className="">
      <ResponsiveContainer width="100%" height={270}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="month" axisLine={false} />
          <YAxis tickFormatter={(v) => `${v}`} axisLine={false} />
          <Tooltip formatter={(value: number) => `${value.toLocaleString()}`} />

          {/* Blue current line */}
          <Line
            type="monotone"
            dataKey="current"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />

          {/* Gray previous line with dynamic style */}
          <Line
            type="monotone"
            dataKey="previous"
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray={previousStrokeDasharray}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
