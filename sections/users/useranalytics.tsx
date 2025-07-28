import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SaleTrend from "./saleTrend";
import ViewsOverTime from "../invoices/viewsOverTime";
import PointsDistribution from "../loyalty/pointsDistribution";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Settings2, X } from "lucide-react";
import ViewershipTrend from "./viewershipTrend";
import EventPerformanceComparsionInUserDetails from "./eventPerformanceComparsion";
import VisitorGanderAnalytics from "./visitorGanderAnalytics";
import PreferenceTrend from "./preferenceTrend";
import InterestPerCategory from "./interestPerCategory";

const Useranalytics = () => {
  const [active, setActive] = React.useState("");

  return (
    <div className="grid grid-cols-12 gap-6 mt-7">
      <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
        {/* Transactions */}
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold mb-2">Transaction History</h2>
          </CardHeader>
          <CardContent>
            <SaleTrend />
          </CardContent>
        </Card>

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
        <div className="md:col-span-6 col-span-12 ">
          <SaleTrend />
        </div>
        <div className="md:col-span-6 col-span-12">
          <ViewershipTrend />
        </div>

        <div className="md:col-span-12 col-span-12">
          <EventPerformanceComparsionInUserDetails />
        </div>
        <div className="col-span-12 grid grid-cols-12 gap-4 relative overflow-hidden rounded-xl">
          {/* Grid Content (Blurred behind overlay) */}
          <div className="md:col-span-6 col-span-12">
            <ViewershipTrend />
          </div>
          <div className="md:col-span-6 col-span-12">
            <VisitorGanderAnalytics />
          </div>

          {/* Overlay with background blur */}
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-md">
            <div className="text-center space-y-4">
              <h2 className="text-white text-2xl font-semibold">
                To see detailed analytics
              </h2>
              <button className="px-5 py-2 bg-primary hover:bg-primary text-white text-sm font-medium rounded-md">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-6 col-span-12 ">
          <PreferenceTrend />
        </div>
        <div className="md:col-span-6 col-span-12 ">
          <InterestPerCategory />
        </div>
      </div>

      <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
        {/* Bookings */}
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold mb-2">Booking History</h2>
          </CardHeader>
          <CardContent>
            <ViewsOverTime
              data={[
                { month: "Jan", views: 2400 },
                { month: "Feb", views: 1398 },
                { month: "Mar", views: 9800 },
                { month: "Apr", views: 3908 },
                { month: "May", views: 4800 },
                { month: "Jun", views: 3800 },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Useranalytics;
