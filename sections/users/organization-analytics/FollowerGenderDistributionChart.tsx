import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { GenderPoint } from "./shared";

const COLORS = ["#2563EB", "#202C88", "#7DAEF4", "#94A3B8"];

const FollowerGenderDistributionChart = ({ data, isLoading = false }: { data: GenderPoint[]; isLoading?: boolean }) => {
  const chartData =
    data.length > 0
      ? data
      : [
          { name: "Males", value: 0, percent: 0 },
          { name: "Females", value: 0, percent: 0 },
          { name: "Others", value: 0, percent: 0 },
        ];

  const total = chartData.reduce((sum, item) => sum + Number(item.value ?? 0), 0);

  const renderPercentBadge = (props: any) => {
    const { x, y, payload } = props;
    if (typeof x !== "number" || typeof y !== "number") {
      return null;
    }

    const calculatedPercent = total > 0 ? Math.round((Number(payload?.value ?? 0) / total) * 100) : 0;
    const percent = Number(payload?.percent ?? calculatedPercent);

    return (
      <g>
        <circle cx={x} cy={y} r={16} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth={1.5} />
        <text x={x} y={y + 5} textAnchor="middle" fill="#0F172A" fontSize={13} fontWeight={700}>
          {`${percent}%`}
        </text>
      </g>
    );
  };

  return (
    <Card className="h-[430px] dark:bg-[#171717]">
      <CardHeader className="flex flex-row justify-between">
        <h3 className="text-xl font-semibold">Visitor Gender Analytics</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[0] }} />
            <span className="text-base leading-none">Males</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[1] }} />
            <span className="text-base leading-none text-[#7DAEF4]">Females</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[2] }} />
            <span className="text-base leading-none text-[#7DAEF4]">Others</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full rounded-lg" />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={105}
                  innerRadius={55}
                  paddingAngle={1}
                  labelLine={false}
                  label={renderPercentBadge}
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={`${entry.name}-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowerGenderDistributionChart;
