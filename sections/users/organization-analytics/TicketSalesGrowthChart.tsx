import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fallbackTimeline, formatCompact, TimelinePoint } from "./shared";

const TicketSalesGrowthChart = ({ data, isLoading = false }: { data: TimelinePoint[]; isLoading?: boolean }) => {
  const chartData = data.length > 0 ? data : fallbackTimeline();

  return (
    <Card className="h-[430px] dark:bg-[#171717]">
      <CardHeader>
        <h3 className="text-xl font-semibold">Ticket Sales Growth Over Time</h3>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full rounded-lg" />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 20 }}>
                <XAxis dataKey="label" axisLine={false} tickLine={false} style={{ fontSize: "14px" }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={formatCompact} width={58} />
                <Tooltip cursor={false} formatter={(value: any) => `${Number(value).toLocaleString()}`} />
                <Bar dataKey="value" name="Ticket Sales" fill="#2563EB" radius={[6, 6, 0, 0]} barSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketSalesGrowthChart;
