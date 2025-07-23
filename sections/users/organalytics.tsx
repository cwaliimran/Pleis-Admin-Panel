import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { dateTabs } from "./data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Settings2, X } from "lucide-react";
import {
  EventPerformanceComparsionInUserDetails,
  InterestPerCategory,
  PreferenceTrend,
  SaleTrend,
  ViewershipTrend,
  VisitorGanderAnalytics,
} from "./index"; // Adjust the d'

const OrgAnalytics = () => {
  const [active, setActive] = React.useState("info");

  return (
    <div>
      <div className="flex justify-start md:flex-row flex-col md:items-center items-start gap-4  p-2">
        <Tabs defaultValue="today">
          <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">

            <TabsList className="flex items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border rounded-full p-1">
              {dateTabs.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className={cn(
                    "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer"
                  )}
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <Badge className="bg-white text-black shadow-md px-3 py-1 rounded-2xl text-md flex items-center gap-2 w-fit">
          <Settings2 className="w-5 h-5" />

          <span className="whitespace-nowrap">Filter (3)</span>

          <X
            className="w-4 h-4 cursor-pointer "
            onClick={() => setActive("")}
          />
        </Badge>
      </div>
      <div className="w-full grid grid-cols-12 gap-4 mt-5">
        <div className="lg:col-span-6 col-span-12 ">
          <SaleTrend />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <ViewershipTrend />
        </div>

        <div className="lg:col-span-12 col-span-12">
          <EventPerformanceComparsionInUserDetails />
        </div>
        <div className="col-span-12 grid grid-cols-12 gap-4 relative overflow-hidden rounded-xl">
          {/* Grid Content (Blurred behind overlay) */}
          <div className="lg:col-span-6 col-span-12">
            <ViewershipTrend />
          </div>
          <div className="lg:col-span-6 col-span-12">
            <VisitorGanderAnalytics />
          </div>

          {/* Overlay with background blur */}
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-md">
            <div className="text-center space-y-4">
              <h2 className="text-white text-2xl font-semibold">
                To see detailed analytics
              </h2>
              <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 col-span-12 ">
          <PreferenceTrend />
        </div>
        <div className="lg:col-span-6 col-span-12 ">
          <InterestPerCategory />
        </div>
      </div>
    </div>
  );
};

export default OrgAnalytics;
