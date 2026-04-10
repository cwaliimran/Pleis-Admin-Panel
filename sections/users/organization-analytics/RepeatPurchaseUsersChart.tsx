import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact, RepeatPurchasePoint } from "./shared";

const RepeatPurchaseUsersChart = ({ data, isLoading = false }: { data: RepeatPurchasePoint[]; isLoading?: boolean }) => {
  const chartData =
    data.length > 0
      ? data
      : [
          { label: "Jan", percentage: 0, count: 0 },
          { label: "Feb", percentage: 0, count: 0 },
          { label: "Mar", percentage: 0, count: 0 },
          { label: "Apr", percentage: 0, count: 0 },
          { label: "May", percentage: 0, count: 0 },
          { label: "Jun", percentage: 0, count: 0 },
        ];

  return (
    <Card className="h-[430px] dark:bg-[#171717]">
      <CardHeader>
        <h3 className="text-xl font-semibold">Repeat Purchase Users Over Time</h3>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full rounded-lg" />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="label" axisLine={false} tickLine={false} style={{ fontSize: "14px" }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={formatCompact} width={58} />
                <Tooltip cursor={false} formatter={(value: any) => [`${Number(value).toLocaleString()}`, "Repeat Purchasers"]} />
                <Bar dataKey="count" name="Repeat Purchasers" fill="#2563EB" radius={[8, 8, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RepeatPurchaseUsersChart;
