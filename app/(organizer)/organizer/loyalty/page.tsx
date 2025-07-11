"use client";
import React from "react";
import Header from "../../../common/header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loyaltPoints, loyaltTabsData, loyaltyCardData, rewardData, rewardsTabs, tabsData } from "@/sections/loyalty/data";
import { Button } from "@/components/ui/button";
import { useBoolean } from "@/hooks/useBoolean";
import { Plus, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GenderDonutChart, InvoiceCard, MostViewedEvent, Trend, ViewsOverTime, VisitorAge, VisitorRegion } from "@/sections/invoices";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { LoyaltyCard, MostEngagedMembers, PointsDistribution } from "@/sections/loyalty";
import RewardCard from "@/sections/loyalty/rewardCard";
import LoyaltyList from "@/sections/loyalty/loyaltyList";

const Page = () => {
    const openModal = useBoolean();

    const [active, setActive] = React.useState("month");
    const [mainActive, setMainActive] = React.useState("overview");


    const totalDays = 30;
    const remainingDays = 5;
    const progressPercent = ((totalDays - remainingDays) / totalDays) * 100;

    return (
        <>
            <Header
                links={[
                    { name: "Dashboard", href: "/organizer/dashboard" },
                    { name: "Loyalty Center" },
                ]}
            />
            <div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-10">
                {/* Scrollable Tabs */}
                <Tabs value={mainActive} onValueChange={setMainActive} className="w-[90vw] md:w-full ">
                    <div className="overflow-x-auto whitespace-nowrap ">
                        <TabsList className="flex w-max gap-2 bg-transparent rounded-full p-1">
                            {tabsData.map((tab: any) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className={`relative px-4 py-2 font-semibold text-sm rounded-full transition-all shadow-none cursor-pointer border-none
                    ${mainActive === tab.value
                                            ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-[4px] after:bg-[#71717A] after:rounded-full'
                                            : "text-muted-foreground"
                                        }`}
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                </Tabs>

                {/* Action Buttons */}
                <div className="w-full flex gap-2 md:justify-end items-center">
                    <Badge className="bg-white text-black shadow-md px-3 py-1 rounded-2xl text-md flex items-center gap-2 cursor-pointer">
                        <Settings2 className="w-5 h-5" />
                        <span className="whitespace-nowrap">Filter</span>
                    </Badge>

                    <Button
                        className="bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition-colors flex items-center gap-2 px-4 py-2 cursor-pointer"
                        onClick={openModal.onTrue}
                    >
                        <Plus />
                        Create Program
                    </Button>
                </div>
            </div>
            <Tabs value={active} onValueChange={setActive} className="w-[90vw] md:w-full mt-5">
                <div className="overflow-x-auto whitespace-nowrap ">
                    <TabsList className="flex w-max items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border rounded-full p-1">
                        {loyaltTabsData.map((tab: any) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={`text-md font-semibold relative rounded-full px-4 py-2 transition-colors ${active === tab.value
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                    }`}
                            >
                                <span className="flex items-center gap-1">
                                    {tab.label}
                                    {tab.icon && <tab.icon className="h-4 w-4" />}
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
            </Tabs>
            <div className="grid md:grid-cols-3 lg:grid-cols-4  grid-cols-1 md:gap-x-7 md:gap-y-4 gap-2 mt-5">
                {loyaltyCardData.map((card: any, index) => (
                    <InvoiceCard
                        key={index}
                        item={card}
                    />
                ))}
            </div>
            <div className="grid grid-cols-12 gap-4 mt-5">
                <div className="md:col-span-6 col-span-12  ">
                    <Card className='col-span-12 md:col-span-6 shadow-lg '>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h3 className='text-xl font-semibold'>New Members</h3>

                            </div>
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
                                { month: "Dec", views: 9000 }
                            ]}

                        />
                    </Card>
                </div>

                <div className="md:col-span-6 col-span-12">
                    <div className="flex flex-col gap-3">
                        {/* Member Activity Card */}
                        <Card className="shadow-lg w-full">
                            <CardHeader>
                                <div className="flex justify-start items-center">
                                    <h3 className="text-xl font-semibold">Member Activity</h3>
                                </div>
                            </CardHeader>

                            <div className="flex-1">
                                {/* Active Members */}
                                <div className="mt-2 flex justify-between items-start gap-4 mx-4">
                                    <h4 className="text-lg font-semibold mb-2">Active Members</h4>
                                    <h4 className="text-lg font-semibold mb-2">75%</h4>
                                </div>
                                <div className="flex-1 flex flex-col mx-4">
                                    <div className="w-full h-5 bg-gray-200 rounded-full mb-2 overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 transition-all duration-500"
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                    <h4 className="text-lg font-semibold mb-2">6000</h4>
                                </div>

                                {/* Inactive Members */}
                                <div className="mt-2 flex justify-between items-start mx-4">
                                    <h4 className="text-lg font-semibold mb-2">Inactive Members</h4>
                                    <h4 className="text-lg font-semibold mb-2">75%</h4>
                                </div>
                                <div className="flex-1 flex flex-col mx-4">
                                    <div className="w-full h-5 bg-gray-200 rounded-full mb-2 overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 transition-all duration-500"
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                    <h4 className="text-lg font-semibold mb-2">6000</h4>
                                </div>
                            </div>
                        </Card>

                        {/* Loyalty Cards */}
                        <div className="grid md:grid-cols-2 gap-5">
                            {loyaltyCardData.slice(0, 2).map((card: any, index) => (
                                <InvoiceCard key={index} item={card} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-4 col-span-12  ">
                    <Card className='shadow-lg  w-full h-[550px]'>
                        <CardHeader>
                            <div className='flex justify-start items-center'>
                                <h3 className='text-xl font-semibold'>Age Demographics</h3>
                            </div>
                        </CardHeader>
                        <div className='flex-1 '>
                            <VisitorAge
                                data={[
                                    { ageGroup: "18-24", visitors: 120 },
                                    { ageGroup: "25-34", visitors: 200 },
                                    { ageGroup: "35-44", visitors: 150 },
                                    { ageGroup: "45-54", visitors: 90 },
                                    { ageGroup: "55+", visitors: 70 }
                                ]}
                            />
                            <div className="mx-4 mt-4">
                                <p className="text-sm text-muted-foreground font-medium">
                                    <span className="text-xl font-bold text-black">66%</span> visitors are 45-55 years old
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="md:col-span-4 col-span-12  ">
                    <Card className='shadow-lg  h-[550px]'>
                        <CardHeader>
                            <div className='flex justify-between items-center '>
                                <h3 className='text-xl font-semibold'>Location</h3>
                                <div className='flex flex-col items-center'>
                                    <div className='flex items-center'>
                                        <div className='w-3 h-3 rounded-full bg-[#2563EB] mr-2' />
                                        <h1 className='text-md leading-6 '>
                                            Males
                                        </h1>
                                    </div>
                                    <div className='flex mt-2 items-center'>
                                        <div className='w-3 h-3 rounded-full bg-[#202C88] leading-10 mr-2' />
                                        <h1 className='text-[#7DAEF4] text-md'>
                                            Females
                                        </h1>
                                    </div>
                                    <div className='flex mt-2 items-center'>
                                        <div className='w-3 h-3 rounded-full bg-[#7DAEF4] leading-10 mr-2' />
                                        <h1 className='text-[#7DAEF4] text-md'>
                                            Females
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <VisitorRegion
                            chartData={[
                                { month: "January", males: 186, females: 80, others: 50 },
                                { month: "February", males: 305, females: 200, others: 100 },
                                { month: "March", males: 237, females: 120, others: 70 },
                                { month: "April", males: 73, females: 190, others: 60 },
                                { month: "May", males: 209, females: 130, others: 90 },
                                { month: "June", males: 214, females: 140, others: 80 }
                            ]}
                            chartConfig={{
                                males: { label: "Males", color: "#2563eb" },
                                females: { label: "Females", color: "#202C88" },
                                others: { label: "Others", color: "#7DAEF4" }
                            }}
                        />
                    </Card>
                </div>
                <div className="md:col-span-4 col-span-12  ">
                    <Card className='shadow-lg  h-[550px]'>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h3 className='text-xl font-semibold'> Gender Analytics</h3>
                                <div className='flex flex-col items-center'>
                                    <div className='flex items-center'>
                                        <div className='w-3 h-3 rounded-full bg-[#2563EB] mr-2' />
                                        <h1 className='text-md leading-6 '>
                                            Males
                                        </h1>
                                    </div>
                                    <div className='flex mt-2 items-center'>
                                        <div className='w-3 h-3 rounded-full bg-[#202C88] leading-10 mr-2' />
                                        <h1 className='text-[#7DAEF4] text-md'>
                                            Females
                                        </h1>
                                    </div>
                                    <div className='flex mt-2 items-center'>
                                        <div className='w-3 h-3 rounded-full bg-[#7DAEF4] leading-10 mr-2' />
                                        <h1 className='text-[#7DAEF4] text-md'>
                                            Females
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <GenderDonutChart
                            data={[
                                { name: "Males", value: 400 },
                                { name: "Females", value: 300 },
                                { name: "Others", value: 100 }
                            ]}
                            COLORS={["#2563EB", "#202C88", "#7DAEF4"]}
                        />
                    </Card>
                </div>
            </div>
            <div className="grid grid-col-12">
                <h1 className="text-xl my-5 font-bold mx-2">Loyalty Points</h1>
                <div className="grid md:grid-cols-6 grid-cols-1 gap-6">

                    {loyaltPoints.map((item: any) => (
                        <LoyaltyCard
                            key={item.id}
                            item={item}
                        />
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-12 gap-4 mt-5">
                <div className="md:col-span-6 col-span-12  ">
                    <Card className='col-span-12 md:col-span-6 shadow-lg '>
                        <CardHeader>
                            <h3 className='text-xl font-[400]'>Points activity over time</h3>
                            <div className='flex justify-between items-center'>
                                <h3 className='text-2xl font-bold'>+10%</h3>
                                <h3 className='text-xl font-[400] text-gray-400 '>Last 90 Days <span className="text-green-500 ml-1">+10%</span></h3>
                            </div>
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
                                { month: "Dec", views: 9000 }
                            ]}

                        />
                    </Card>
                </div>

                <div className="md:col-span-6 col-span-12">
                    <Card className='col-span-12 md:col-span-6 shadow-lg '>
                        <CardHeader>
                            <h3 className='text-xl font-[400]'>Points distribution by activity type</h3>
                        </CardHeader>
                        <PointsDistribution
                            data={[
                                { ageGroup: "18-24", visitors: 120 },
                                { ageGroup: "25-34", visitors: 200 },
                                { ageGroup: "35-44", visitors: 150 },
                                { ageGroup: "45-54", visitors: 90 },
                                { ageGroup: "55+", visitors: 70 }
                            ]}
                        />
                    </Card>
                </div>
            </div>
            <div className="my-5 grid grid-cols-12 gap-4">
                <div className="col-span-12 flex flex-col ">
                    <h1 className="text-3xl font-bold">Rewards</h1>
                    <h1 className="text-lg text-gray-400 mt-2">Redeem points for exclusive rewards</h1>
                </div>
            </div>
            <div className="grid md:grid-cols-3  gap-4 mt-5">
                <h1 className="font-bold text-xl">Most Popular</h1>
                <h1 className="font-bold text-xl">Expired</h1>
                <h1 className="font-bold text-xl">Limited Availability</h1>
            </div>
            <div className="grid md:grid-cols-3  gap-4 mt-5">
                {rewardData.map((item, index) => (
                    <RewardCard
                        key={index}
                        item={item}
                    />
                ))}

            </div>
            <div className="mt-5">
                <Button variant={"outline"} className="font-bold cursor-pointer">See All</Button>
            </div>
            <div className="my-5 grid grid-cols-12 gap-4">
                <div className="col-span-12  ">
                    <h1 className="text-3xl font-bold">Spendings</h1>
                </div>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div className="">
                    <Card className='col-span-12 md:col-span-6 shadow-lg '>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h3 className='text-xl font-semibold'>Most Engaged Members</h3>
                            </div>
                        </CardHeader>
                        <MostEngagedMembers />
                    </Card>
                </div>
                <div className="">
                    <Card className='col-span-12 md:col-span-6 shadow-lg   '>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h3 className='text-xl font-semibold'>Most Engaged Members</h3>
                            </div>
                        </CardHeader>
                        <MostEngagedMembers />
                    </Card>
                </div>
                {/* <div className="border border-red-500"></div> */}
                <div className="">
                    <Card className='col-span-12 md:col-span-6 shadow-lg h-[500px]'>
                        <CardHeader>
                            <h3 className='text-xl font-bold'>Total Spending by Members</h3>
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
                                { month: "Dec", views: 9000 }
                            ]}

                        />
                    </Card>
                </div>
                <div className="">
                    <Card className=' shadow-lg '>
                        <CardHeader>
                            <h3 className='text-xl font-bold'>Most popular products or services</h3>
                        </CardHeader>
                        <VisitorAge
                            data={[
                                { ageGroup: "18-24", visitors: 120 },
                                { ageGroup: "25-34", visitors: 200 },
                                { ageGroup: "35-44", visitors: 150 },
                                { ageGroup: "45-54", visitors: 90 },
                                { ageGroup: "55+", visitors: 70 }
                            ]}
                        />
                    </Card>
                </div>
                <div className="">
                    <Card className='shadow-lg  h-[550px]'>
                        <CardHeader>
                            <div className='flex justify-between items-center '>
                                <h3 className='text-xl font-semibold'>Spending patterns over time</h3>
                                <div className='flex flex-col items-center'>
                                    <div className='flex items-center'>
                                        <div className='w-3 h-3 rounded-full bg-[#2563EB] mr-2' />
                                        <h1 className='text-md leading-6 '>
                                            Low Income
                                        </h1>
                                    </div>
                                    <div className='flex mt-2 items-center'>
                                        <div className='w-3 h-3 rounded-full bg-[#202C88] leading-10 mr-2' />
                                        <h1 className='text-[#7DAEF4] text-md'>
                                            Hight Income
                                        </h1>
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
                                { month: "June", males: 214, females: 140 }
                            ]}
                            chartConfig={{
                                males: { label: "Males", color: "#2563eb" },
                                females: { label: "Females", color: "#7DAEF4" },
                            }}
                        />
                    </Card>
                </div>
                <div className="">
                    <Card className='shadow-lg  h-[550px]'>
                        <CardHeader>
                            <div className='flex justify-between items-center '>
                                <h3 className='text-xl font-semibold'>Spending breakdown by product type</h3>
                            </div>
                        </CardHeader>
                        <MostViewedEvent
                            chartData={[
                                { month: "January", search: 189 },
                                { month: "February", search: 305 },
                                { month: "March", search: 237 },
                                { month: "April", search: 73 },
                                { month: "May", search: 209 },
                                { month: "June", search: 214 }
                            ]}
                            chartConfig={{
                                search: { label: "Category", color: "#2563EB" },
                            }}
                        />
                    </Card>
                </div>
            </div>
            <div className="grid grid-cols-1 md:gap-4  mt-5 ">
                <Card className='shadow-lg  '>
                    <CardHeader>
                        <div className='flex md:flex-row flex-col md:justify-between items-center gap-4'>
                            <Tabs value={active} onValueChange={setActive} className="w-[80vw] md:w-full mt-5">
                                <div className="overflow-x-auto whitespace-nowrap ">
                                    <TabsList className="flex w-max items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border rounded-full p-1">
                                        {rewardsTabs.map((tab: any) => (
                                            <TabsTrigger
                                                key={tab.value}
                                                value={tab.value}
                                                className={`text-md font-semibold relative rounded-full px-4 py-2 transition-colors ${active === tab.value
                                                    ? "text-primary"
                                                    : "text-muted-foreground"
                                                    }`}
                                            >
                                                <span className="flex items-center gap-1">
                                                    {tab.label}
                                                    {tab.icon && <tab.icon className="h-4 w-4" />}
                                                </span>
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>
                            </Tabs>
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
                <DialogOverlay
                    className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center">
                    <DialogContent>
                        <DialogTitle>Create Program </DialogTitle>
                        <div className='flex flex-col gap-4'>
                            <input type="text" placeholder="Organizer Name" className='shadow-md z-10 p-2 rounded-md' />
                            <input type="email" placeholder="Email" className='shadow-md z-10 p-2 rounded-md' />
                            <input type="tel" placeholder="Phone Number" className='shadow-md z-10 p-2 rounded-md' />
                            <input type="text" placeholder="Address" className='shadow-md z-10 p-2 rounded-md' />
                        </div>
                        <div className='flex justify-end mt-4'>
                            <Button onClick={openModal.onFalse} variant={"outline"} className='mr-2  cursor-pointer'>Cancel</Button>
                            <Button onClick={openModal.onFalse} className='cursor-pointer'>add Program</Button>
                        </div>
                    </DialogContent>
                </DialogOverlay>
            </Dialog>
        </>
    );
};

export default Page;
