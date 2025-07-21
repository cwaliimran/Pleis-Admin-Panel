import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InterestPerCategory from "./interestPerCategory";
import MostViewedEvent from "../invoices/mostViewedEvent";
import React from "react";

const UserInfo = () => {
  return (
    <div className="grid grid-cols-12 gap-6 mt-7">
      <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
        {/* User Basic Info */}
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold mb-2">User</h2>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-black">Male</Badge>
              <Badge className="bg-blue-100 text-black">
                February 15, 1990
              </Badge>
              <Badge className="bg-blue-100 text-black">Australia</Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="mt-2 shadow-lg">
          <CardHeader>
            <h1 className="text-slate-500 font-semibold">CATEGORIES</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors">
                One
              </Badge>
              <Badge className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors">
                Two
              </Badge>
              <Badge className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors">
                Three
              </Badge>
            </div>
          </CardHeader>
        </Card>
        <Card className="mt-2 shadow-lg">
          <CardHeader>
            <h1 className="text-slate-500 font-semibold">TAGS</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors">
                One
              </Badge>
              <Badge className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors">
                Two
              </Badge>
              <Badge className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors">
                Three
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Global Loyalty Info */}
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold mb-2">Loyalty Program</h2>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-yellow-100 text-black">Gold Tier</Badge>
              <Badge className="bg-yellow-100 text-black">2,500 Points</Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Interests */}
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold mb-2">User Interests</h2>
          </CardHeader>
          <CardContent>
            <InterestPerCategory />
          </CardContent>
        </Card>
      </div>

      <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
        {/* Followed Events */}
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold mb-2">Interactions</h2>
          </CardHeader>
          <CardContent>
            <MostViewedEvent
              chartData={[
                { month: "Likes", search: 189 },
                { month: "Comments", search: 305 },
                { month: "Shares", search: 237 },
              ]}
              chartConfig={{
                search: { label: "Followed", color: "#2563EB" },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserInfo;
