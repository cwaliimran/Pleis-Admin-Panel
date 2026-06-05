import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { GenderDonutChart } from '../invoices';

interface VisitorGanderAnalyticsProps {
  data?: Array<{
    name: string;
    count: number;
    percent?: number;
  }>;
  isLoading?: boolean;
  title?: string;
}

const VisitorGanderAnalytics = ({ data = [], isLoading = false, title = 'Visitor Gender Analytics' }: VisitorGanderAnalyticsProps) => {
  const chartData = data.map((item) => ({ name: item.name, value: Number(item.count ?? 0) }));
  const isEmpty = chartData.length === 0 || chartData.every((d) => d.value === 0);

  return (
    <div>
      <Card className="m-0 h-112.5 p-0 shadow-lg dark:bg-[#171717]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{title}</h3>
            {!isEmpty && (
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-[#2563EB]" />
                  <h1 className="text-md leading-6">Males</h1>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-[#202C88] leading-10" />
                  <h1 className="text-md text-[#7DAEF4]">Females</h1>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-[#7DAEF4] leading-10" />
                  <h1 className="text-md text-[#7DAEF4]">Others</h1>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-82.5 w-full rounded-lg" />
          ) : isEmpty ? (
            <div className="flex h-82.5 w-full flex-col items-center justify-center gap-2">
              <p className="text-muted-foreground text-sm">No gender data available</p>
            </div>
          ) : (
            <GenderDonutChart data={chartData} COLORS={['#2563EB', '#202C88', '#7DAEF4']} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorGanderAnalytics;
