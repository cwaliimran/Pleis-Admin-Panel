import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TagPoint } from "./shared";

const SERIES_COLORS = {
  males: "#2563EB",
  females: "#202C88",
  others: "#7DAEF4",
};

const FollowersTagsChart = ({ data, isLoading = false }: { data: TagPoint[]; isLoading?: boolean }) => {
  const chartData =
    data.length > 0
      ? [...data]
          .sort(
            (a, b) =>
              b.males + b.females + b.others - (a.males + a.females + a.others)
          )
          .slice(0, 10)
      : [
          { tag: "Popular", males: 0, females: 0, others: 0 },
          { tag: "Premium", males: 0, females: 0, others: 0 },
          { tag: "Verified", males: 0, females: 0, others: 0 },
          { tag: "Featured", males: 0, females: 0, others: 0 },
          { tag: "Limited", males: 0, females: 0, others: 0 },
        ];

  return (
    <Card className="h-[430px] dark:bg-[#171717]">
      <CardHeader className="flex flex-row justify-between">
        <h3 className="text-xl font-semibold">Followers Tags</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: SERIES_COLORS.males }} />
            <span className="text-base leading-none">Males</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: SERIES_COLORS.females }} />
            <span className="text-base leading-none text-[#202C88]">Females</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: SERIES_COLORS.others }} />
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
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(148, 163, 184, 0.45)" />
                <XAxis dataKey="tag" axisLine={false} tickLine={false} angle={-20} textAnchor="end" interval={0} height={70} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={false} formatter={(value: any) => `${Number(value).toLocaleString()}`} />
                <Bar dataKey="males" stackId="tag" fill={SERIES_COLORS.males} barSize={24} />
                <Bar dataKey="females" stackId="tag" fill={SERIES_COLORS.females} barSize={24} />
                <Bar dataKey="others" stackId="tag" fill={SERIES_COLORS.others} radius={[8, 8, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowersTagsChart;
