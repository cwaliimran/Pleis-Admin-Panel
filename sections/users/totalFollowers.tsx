import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React from 'react';
import { GenderDonutChart } from '../invoices';

const TotalFollowers = () => {
  return (
    <div>
      <Card className="shadow-lg dark:bg-[#171717]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Total Followers</h1>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">0</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <GenderDonutChart
            size={110}
            data={[
              { name: 'New', value: 300 },
              { name: 'Old', value: 400 },
              { name: 'Others', value: 100 },
            ]}
            COLORS={['#7DAEF4', '#2563EB', '#202C88']}
          />
          <div className="flex flex-col">
            <div className="flex justify-between px-4">
              <div className="mb-2 flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-[#2563EB]" />
                <h1 className="text-md leading-6">Old</h1>
              </div>
              <h1>300</h1>
            </div>
            <div className="flex justify-between px-4">
              <div className="mt-2 flex text-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-[#202C88] leading-10" />
                <h1 className="text-md text-[#7DAEF4]">Others</h1>
              </div>
              <h1>100</h1>
            </div>
            <div className="flex justify-between px-4">
              <div className="mt-2 flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-[#7DAEF4] leading-10" />
                <h1 className="text-md text-[#7DAEF4]">New</h1>
              </div>
              <h1>400</h1>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalFollowers;
