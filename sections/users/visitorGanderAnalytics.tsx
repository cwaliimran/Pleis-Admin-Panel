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
  const chartData =
    data.length > 0
      ? data.map((item) => ({
          name: item.name,
          value: Number(item.count ?? 0),
        }))
      : [
          { name: 'Males', value: 0 },
          { name: 'Females', value: 0 },
          { name: 'Others', value: 0 },
        ];

  return (
    <div>
      <Card className="m-0 h-[450px] p-0 shadow-lg dark:bg-[#171717]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{title}</h3>
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
          </div>
        </CardHeader>
        <CardContent className="">
          {isLoading ? (
            <Skeleton className="h-[330px] w-full rounded-lg" />
          ) : (
            <GenderDonutChart data={chartData} COLORS={['#2563EB', '#202C88', '#7DAEF4']} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorGanderAnalytics;
