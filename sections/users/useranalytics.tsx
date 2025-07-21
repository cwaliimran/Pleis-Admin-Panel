import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SaleTrend from "./saleTrend";
import ViewsOverTime from "../invoices/viewsOverTime";
import PointsDistribution from "../loyalty/pointsDistribution";
import React from "react";

const Useranalytics = () => {
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

        {/* Loyalty Program Breakdown */}
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
