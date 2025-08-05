"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBoolean } from "@/hooks/useBoolean";
import { cn } from "@/lib/utils";
import {
  GenderDonutChart,
  InvoiceCard,
  MostViewedEvent,
  ViewsOverTime,
  VisitorAge,
  VisitorRegion,
} from "@/sections/invoices";
import { LoyaltyCard, MostEngagedMembers } from "@/sections/loyalty";
import {
  loyaltPointsDashboard,
  loyaltyCardHeaderData,
  loyaltyMidCardData,
  LoyaltyPoints,
  rewardData,
  rewardDataWithLimitedAvail,
  TabData,
  tabsData,
} from "@/sections/loyalty/data";
import LoyaltyList from "@/sections/loyalty/loyaltyList";
import RewardCard from "@/sections/loyalty/rewardCard";
import { Plus, Settings2 } from "lucide-react";
import React from "react";

const LoyaltyView = () => {
  const openModal = useBoolean();

  const [mainActive, setMainActive] = React.useState("overview");
  const [activeTransactionTab, setActiveTransactionTab] = React.useState("all");
  const [activeDurationTab, setActiveDurationTab] = React.useState("monthly");

  const activePercent = 75;
  const inactivePercent = 25;

  return (
    <>
      <div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-10">
        <div className="text-sm w-[70%] font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            {tabsData.map((tab: TabData, index: number) => (
              <li key={index} className="me-0">
                <div
                  onClick={() => setMainActive(tab.value)}
                  className={`inline-block text-[13px] sm:text-[15px] p-4 pb-1 border-b-3 cursor-pointer rounded-t-lg ${
                    mainActive === tab.value
                      ? "text-gray-700 font-semibold border-[#64748B] dark:text-white"
                      : "text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300 dark:hover:text-gray-300 dark:text-gray-200"
                  }`}
                >
                  {tab.label}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex gap-2 md:justify-end items-center">
          <Badge className="bg-white text-black border border-gray-300 px-4 py-2 rounded-3xl text-md flex items-center gap-2 cursor-pointer">
            <Settings2 className="w-5 h-5" />
            <span className="whitespace-nowrap">Filter</span>
          </Badge>

          <Button
            className="bg-primary border border-primary text-white rounded-3xl transition-colors flex items-center gap-2 px-4 py-2 cursor-pointer"
            onClick={openModal.onTrue}
          >
            <Plus />
            Create Program
          </Button>
        </div>
      </div>

      <div className="w-full mt-5">
        {/* Show select on small screens */}
        <div className="block sm:hidden">
          <Select
            value={activeDurationTab}
            onValueChange={setActiveDurationTab}
          >
            <SelectTrigger className="w-full bg-[#EBEBEB] dark:bg-black dark:text-white">
              <SelectValue placeholder="Select tab" />
            </SelectTrigger>
            <SelectContent className="dark:bg-secondary">
              <SelectItem className="py-3" value="monthly">
                Monthly
              </SelectItem>
              <SelectItem className="py-3" value="daily">
                Daily
              </SelectItem>
              <SelectItem className="py-3" value="weekly">
                Weekly
              </SelectItem>
              <SelectItem className="py-3" value="yearly">
                Yearly
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Show tabs on medium and larger screens */}
        <div className="hidden sm:block">
          <Tabs
            value={activeDurationTab}
            onValueChange={setActiveDurationTab}
            defaultValue="all"
            className="w-full"
          >
            <TabsList className="h-[2.6rem] flex items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border rounded-full p-1">
              <TabsTrigger
                value="monthly"
                className={cn(
                  "text-md font-normal relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer",
                  "data-[state=active]:font-semibold data-[state=active]:dark:bg-white data-[state=active]:dark:text-black"
                )}
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="daily"
                className={cn(
                  "text-md font-normal relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer",
                  "data-[state=active]:font-semibold data-[state=active]:dark:bg-white data-[state=active]:dark:text-black"
                )}
              >
                Daily
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                className={cn(
                  "text-md font-normal relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer",
                  "data-[state=active]:font-semibold data-[state=active]:dark:bg-white data-[state=active]:dark:text-black"
                )}
              >
                Weekly
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className={cn(
                  "text-md font-normal relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer",
                  "data-[state=active]:font-semibold data-[state=active]:dark:bg-white data-[state=active]:dark:text-black"
                )}
              >
                Yearly
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* --------------- LOYALTY TOP STATS ---------------*/}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-x-4 md:gap-y-4 gap-2 mt-5">
        {loyaltyCardHeaderData?.map((card: any, index) => (
          <InvoiceCard key={index} item={card} />
        ))}
      </div>

      {/* --------------- LOYALTY FIRST LAYER --------------- */}
      <div className="grid grid-cols-12 gap-4 mt-5">
        {/* -------------- New Members -------------- */}
        <div className="md:col-span-6 col-span-12">
          <Card className="shadow-md col-span-12 md:col-span-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">New Members</h3>
              </div>
            </CardHeader>

            <ViewsOverTime
              height={330}
              data={[
                { month: "Jan", views: 2400 },
                { month: "Feb", views: 1398 },
                { month: "Mar", views: 9800 },
                { month: "Apr", views: 3908 },
                { month: "May", views: 4800 },
                { month: "Jun", views: 3800 },
                { month: "Jul", views: 4300 },
                { month: "Aug", views: 5000 },
                { month: "Sep", views: 6000 },
                { month: "Oct", views: 7000 },
                { month: "Nov", views: 8000 },
                { month: "Dec", views: 9000 },
              ]}
            />
          </Card>
        </div>

        {/* -------------- Member Activity -------------- */}
        <div className="md:col-span-6 col-span-12">
          <div className="flex flex-col gap-3">
            {/* Member Activity Card */}
            <Card className="shadow-md w-full">
              <CardHeader>
                <div className="flex justify-start items-center">
                  <h3 className="text-xl font-semibold">Member Activity</h3>
                </div>
              </CardHeader>

              <div className="flex-1">
                {/* Active Members */}
                <div className="mt-2 flex justify-between items-start gap-4 mx-4">
                  <h4 className="text-md font-medium mb-2">Active Members</h4>
                  <h4 className="text-md font-medium mb-2">{activePercent}%</h4>
                </div>
                <div className="flex-1 flex flex-col mx-4">
                  <div className="w-full h-3 bg-gray-200 rounded-full mb-2 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${activePercent}%` }}
                    ></div>
                  </div>
                  <h4 className="text-md font-medium mb-2">6000</h4>
                </div>

                {/* Inactive Members */}
                <div className="mt-2 flex justify-between items-start mx-4">
                  <h4 className="text-md font-medium mb-2">Inactive Members</h4>
                  <h4 className="text-md font-medium mb-2">
                    {inactivePercent}%
                  </h4>
                </div>
                <div className="flex-1 flex flex-col mx-4">
                  <div className="w-full h-3 bg-gray-200 rounded-full mb-2 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${inactivePercent}%` }}
                    ></div>
                  </div>
                  <h4 className="text-md font-medium mb-2">2000</h4>
                </div>
              </div>
            </Card>

            {/* Loyalty Cards */}
            <div className="grid md:grid-cols-2 gap-5">
              {loyaltyMidCardData?.slice(0, 2).map((card: any, index) => (
                <InvoiceCard key={index} item={card} />
              ))}
            </div>
          </div>
        </div>

        {/* -------------- Age Demographics -------------- */}
        <div className="md:col-span-4 col-span-12">
          <Card className="shadow-md w-full h-[450px]">
            <CardHeader>
              <div className="flex justify-start items-center">
                <h3 className="text-xl font-semibold">Age Demographics</h3>
              </div>
            </CardHeader>
            <div className="flex-1 ">
              <VisitorAge
                data={[
                  { ageGroup: "18-24", visitors: 120 },
                  { ageGroup: "25-34", visitors: 200 },
                  { ageGroup: "35-44", visitors: 150 },
                  { ageGroup: "45-54", visitors: 90 },
                  { ageGroup: "55+", visitors: 70 },
                ]}
              />
              <div className="mx-4 mt-4">
                <p className="text-sm text-muted-foreground font-medium">
                  <span className="text-xl font-bold text-black">66%</span>{" "}
                  visitors are 45-55 years old
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* -------------- Location -------------- */}
        <div className="md:col-span-4 col-span-12">
          <Card className="shadow-md h-[450px]">
            <CardHeader>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">Location</h3>

                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#2563EB] mr-2" />
                    <h1 className="text-sm">Males</h1>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#202C88] mr-2" />
                    <h1 className="text-[#7DAEF4] text-sm">Females</h1>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#7DAEF4] mr-2" />
                    <h1 className="text-[#7DAEF4] text-sm">Other</h1>
                  </div>
                </div>
              </div>
            </CardHeader>
            <VisitorRegion
              chartData={[
                { month: "Jan", males: 186, females: 80, others: 50 },
                { month: "Feb", males: 305, females: 200, others: 100 },
                { month: "Mar", males: 237, females: 120, others: 70 },
                { month: "April", males: 73, females: 190, others: 60 },
                { month: "May", males: 209, females: 130, others: 90 },
                { month: "June", males: 214, females: 140, others: 80 },
              ]}
              chartConfig={{
                males: { label: "Males", color: "#2563eb" },
                females: { label: "Females", color: "#202C88" },
                others: { label: "Others", color: "#7DAEF4" },
              }}
            />
          </Card>
        </div>

        {/* -------------- Gender Analytics -------------- */}
        <div className="md:col-span-4 col-span-12">
          <Card className="gap-0 shadow-md h-[450px]">
            <CardHeader>
              <div className="mb-4 flex justify-between items-start">
                <h3 className="text-xl font-semibold"> Gender Analytics</h3>

                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#2563EB] mr-2" />
                    <h1 className="text-[13px]">
                      Females{" "}
                      <span className="font-semibold">(20% / 2000)</span>
                    </h1>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#202C88] leading-10 mr-2" />
                    <h1 className="text-[#7DAEF4] text-[13px]">
                      Males <span className="font-semibold">(20% / 2000)</span>
                    </h1>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#7DAEF4] leading-10 mr-2" />
                    <h1 className="text-[#7DAEF4] text-[13px]">
                      Others <span className="font-semibold">(10% / 1000)</span>
                    </h1>
                  </div>
                </div>
              </div>
            </CardHeader>
            <GenderDonutChart
              data={[
                { name: "Males", value: 400 },
                { name: "Females", value: 300 },
                { name: "Others", value: 100 },
              ]}
              COLORS={["#2563EB", "#202C88", "#7DAEF4"]}
            />
          </Card>
        </div>
      </div>

      {/* --------------- LOYALTY POINTS ---------------*/}
      <div className="grid grid-col-12 mt-5">
        <h1 className="text-xl my-5 font-semibold mx-2">Loyalty Points</h1>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {loyaltPointsDashboard?.map((item: LoyaltyPoints) => (
            <LoyaltyCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* --------------- LOYALTY SECOND LAYER --------------- */}
      <div className="grid grid-cols-12 gap-4 mt-5">
        {/* --------------- Points activity over time --------------- */}
        <div className="md:col-span-6 col-span-12">
          <Card className="col-span-12 md:col-span-6 shadow-md">
            <CardHeader>
              <h3 className="text-md font-medium mb-3">
                Points activity over time
              </h3>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">+10%</h3>
                <h3 className="text-md font-[400] text-gray-400 ">
                  Last 90 Days <span className="text-green-500 ml-1">+10%</span>
                </h3>
              </div>
            </CardHeader>
            <ViewsOverTime
              height={350}
              data={[
                { month: "Jan", views: 2400 },
                { month: "Feb", views: 1398 },
                { month: "Mar", views: 9800 },
                { month: "Apr", views: 3908 },
                { month: "May", views: 4800 },
                { month: "Jun", views: 3800 },
                { month: "Jul", views: 4300 },
                { month: "Aug", views: 5000 },
                { month: "Sep", views: 6000 },
                { month: "Oct", views: 7000 },
                { month: "Nov", views: 8000 },
                { month: "Dec", views: 9000 },
              ]}
            />
          </Card>
        </div>

        {/* --------------- Points activity over time --------------- */}
        <div className="md:col-span-6 col-span-12">
          <Card className="gap-0 col-span-12 md:col-span-6 shadow-md">
            <CardHeader>
              <h3 className="text-md font-medium">
                Points distribution by activity type
              </h3>
            </CardHeader>

            <VisitorAge
              noHeaderTotal={false}
              height={370}
              data={[
                { ageGroup: "Referral", visitors: 300 },
                { ageGroup: "Purchase", visitors: 250 },
                { ageGroup: "Socials", visitors: 150 },
                { ageGroup: "Birthday", visitors: 150 },
                { ageGroup: "Bonus", visitors: 280 },
                { ageGroup: "Product", visitors: 200 },
                { ageGroup: "Loyalty", visitors: 200 },
              ]}
            />
          </Card>
        </div>
      </div>

      {/* --------------- REWARDS --------------- */}
      <div className="my-5 mt-8 grid grid-cols-12 gap-4">
        <div className="col-span-12 flex flex-col ">
          <h1 className="text-3xl font-bold">Rewards</h1>
          <h1 className="text-md text-gray-400 mt-2">
            Redeem points for exclusive rewards
          </h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-5">
        <h1 className="font-bold text-lg">Most Popular</h1>
        <h1 className="font-bold text-lg">Expired</h1>
        <h1 className="font-bold text-lg">Limited Availability</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-3">
        <div className="space-y-5">
          {rewardData.map((item, index) => (
            <RewardCard key={index} item={item} />
          ))}
        </div>
        <div className="space-y-5">
          {rewardData.map((item, index) => (
            <RewardCard key={index} item={item} />
          ))}
        </div>
        <div className="space-y-5">
          {rewardDataWithLimitedAvail.map((item, index) => (
            <RewardCard key={index} item={item} />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <Button variant={"outline"} className="font-bold cursor-pointer">
          See All
        </Button>
      </div>

      {/* --------------- SPENDINGS --------------- */}
      <div className="my-5 grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <h1 className="text-2xl sm:text-3xl font-bold">Spendings</h1>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-2 grid-cols-1 gap-4">
        {/* --------------- Most Engaged Members --------------- */}
        <div>
          <Card className="gap-0 col-span-12 md:col-span-6 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Most Engaged Members
                </h3>
              </div>
            </CardHeader>
            <MostEngagedMembers />
          </Card>
        </div>

        {/* --------------- Members with the Highest Points --------------- */}
        <div>
          <Card className="gap-0 col-span-12 md:col-span-6 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Members with the Highest Points
                </h3>
              </div>
            </CardHeader>
            <MostEngagedMembers />
          </Card>
        </div>

        <div className="">
          <Card className="col-span-12 md:col-span-6 shadow-md">
            <CardHeader>
              <h3 className="text-xl font-semibold">
                Total Spending by Members
              </h3>
            </CardHeader>
            <ViewsOverTime
              data={[
                { month: "Jan", views: 2400 },
                { month: "Feb", views: 1398 },
                { month: "Mar", views: 9800 },
                { month: "Apr", views: 3908 },
                { month: "May", views: 4800 },
                { month: "Jun", views: 3800 },
                { month: "Jul", views: 4300 },
                { month: "Aug", views: 5000 },
                { month: "Sep", views: 6000 },
                { month: "Oct", views: 7000 },
                { month: "Nov", views: 8000 },
                { month: "Dec", views: 9000 },
              ]}
            />
          </Card>
        </div>

        <div>
          <Card className=" shadow-md">
            <CardHeader>
              <h3 className="text-xl font-semibold">
                Most popular products or services
              </h3>
            </CardHeader>
            <VisitorAge
              data={[
                { ageGroup: "Coffee", visitors: 120 },
                { ageGroup: "Vodka", visitors: 200 },
                { ageGroup: "Item", visitors: 150 },
                { ageGroup: "Item", visitors: 90 },
                { ageGroup: "Item", visitors: 70 },
                { ageGroup: "Item", visitors: 70 },
                { ageGroup: "Item", visitors: 70 },
              ]}
            />
          </Card>
        </div>

        <div>
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">
                  Spending patterns over time
                </h3>

                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#2563EB] mr-2" />
                    <h1 className="text-sm">Low Income</h1>
                  </div>
                  <div className="flex mt-2 items-center">
                    <div className="w-3 h-3 rounded-full bg-[#202C88] mr-2" />
                    <h1 className="text-[#7DAEF4] text-sm">High Income</h1>
                  </div>
                </div>
              </div>
            </CardHeader>
            <VisitorRegion
              chartData={[
                { month: "January", males: 186, females: 80 },
                { month: "February", males: 305, females: 200 },
                { month: "March", males: 237, females: 120 },
                { month: "April", males: 73, females: 190 },
                { month: "May", males: 209, females: 130 },
                { month: "June", males: 214, females: 140 },
              ]}
              chartConfig={{
                males: { label: "Males", color: "#2563eb" },
                females: { label: "Females", color: "#7DAEF4" },
              }}
            />
          </Card>
        </div>

        <div>
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">
                  Spending breakdown by product type
                </h3>
              </div>
            </CardHeader>
            <MostViewedEvent
              chartData={[
                { month: "Product", search: 189 },
                { month: "Product", search: 305 },
                { month: "Product", search: 237 },
                { month: "Product", search: 73 },
                { month: "Product", search: 209 },
                { month: "Product", search: 214 },
                { month: "Product", search: 314 },
                { month: "Product", search: 114 },
              ]}
              chartConfig={{
                search: { label: "Category", color: "#2563EB" },
              }}
            />
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:gap-4 mt-5">
        <Card className="shadow-md gap-0">
          <CardHeader>
            <div className="mb-3 flex md:flex-row flex-col md:justify-between items-center gap-4">
              <div className="w-full pl-4">
                {/* Show select on small screens */}
                <div className="block sm:hidden">
                  <Select
                    value={activeTransactionTab}
                    onValueChange={setActiveTransactionTab}
                  >
                    <SelectTrigger className="w-full bg-[#EBEBEB] dark:bg-black dark:text-white">
                      <SelectValue placeholder="Select tab" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-secondary">
                      <SelectItem className="py-3" value="all">
                        All
                      </SelectItem>
                      <SelectItem className="py-3" value="transactions">
                        Transactions
                      </SelectItem>
                      <SelectItem className="py-3" value="refunds">
                        Refunds
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Show tabs on medium and larger screens */}
                <div className="hidden sm:block">
                  <Tabs
                    value={activeTransactionTab}
                    onValueChange={setActiveTransactionTab}
                    defaultValue="all"
                    className="w-full"
                  >
                    <TabsList className="h-[2.8rem] flex items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border rounded-full p-1">
                      <TabsTrigger
                        value="all"
                        className={cn(
                          "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer",
                          "data-[state=active]:font-semibold data-[state=active]:dark:bg-white data-[state=active]:dark:text-black"
                        )}
                      >
                        All
                      </TabsTrigger>
                      <TabsTrigger
                        value="transactions"
                        className={cn(
                          "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer",
                          "data-[state=active]:font-semibold data-[state=active]:dark:bg-white data-[state=active]:dark:text-black"
                        )}
                      >
                        Transactions
                      </TabsTrigger>
                      <TabsTrigger
                        value="refunds"
                        className={cn(
                          "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer",
                          "data-[state=active]:font-semibold data-[state=active]:dark:bg-white data-[state=active]:dark:text-black"
                        )}
                      >
                        Refunds
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <Badge className="bg-white text-black shadow-md px-3 py-1 rounded-sm text-md flex items-center gap-2 cursor-pointer">
                <Settings2 className="w-5 h-5" />
                <span className="whitespace-nowrap">By Profile</span>
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <LoyaltyList />
          </CardContent>
        </Card>
      </div>

      <Dialog open={openModal.value} onOpenChange={openModal.onToggle}>
        <DialogOverlay className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center">
          <DialogContent>
            <DialogTitle>Create Program </DialogTitle>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Organizer Name"
                className="shadow-md z-10 p-2 rounded-md"
              />
              <input
                type="email"
                placeholder="Email"
                className="shadow-md z-10 p-2 rounded-md"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="shadow-md z-10 p-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Address"
                className="shadow-md z-10 p-2 rounded-md"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={openModal.onFalse}
                variant={"outline"}
                className="mr-2  cursor-pointer"
              >
                Cancel
              </Button>
              <Button onClick={openModal.onFalse} className="cursor-pointer">
                add Program
              </Button>
            </div>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </>
  );
};

export default LoyaltyView;
