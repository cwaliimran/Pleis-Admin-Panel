
"use client";

import Header from '@/app/common/header'
import { Card, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userData } from '@/sections/create-organization/create-org-data';
import { eventCardData } from '@/sections/event/data';
import { ActivePromontion, BusinessInfo, TotalFollowers, Useranalytics, UserCalender, UserEvents, UserInfo, UserLoyalty, UserNotifications } from '@/sections/users';
import { tabsData } from '@/sections/event/data';
import UserCard from '@/sections/users/userCard';
import { useRouter } from 'next/navigation';
import React from 'react'
import { TransactionHistory } from '@/sections/invoices';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import EventAnalytics from '@/sections/event/eventAnalytics';
import EventInfo from '@/sections/event/eventOverview';
import EventNotification from '@/sections/event/eventNotification';
import EventReservation from '@/sections/event/eventReservation';
import EventTicket from '@/sections/event/eventTicket';
import EventOverView from '@/sections/event/eventOverview';

const Page = () => {
    const [active, setActive] = React.useState("overview");
    const [tabActive, setTabActive] = React.useState("all");
    const router = useRouter();

    return (
        <div>
            <div className="space-y-6">
                <Header
                    links={[
                        { name: 'Dashboard', href: '/super-admin' },
                        { name: 'Events', href: '/super-admin/events' },
                        { name: 'Event Detail', href: '' },
                    ]}
                />
                <div className="mt-10 h-full">
                    <div className="grid grid-cols-12 gap-7">
                        <div className="md:col-span-9 col-span-12">
                            <Card className="overflow-hidden  p-4  shadow-md dark:bg-[#171717]">
                                <div className='relative w-full'>
                                    <div
                                        className="h-72   bg-[url('/images/bannerImage.png')] bg-cover bg-center rounded-lg"
                                    />
                                    <div className='absolute left-5 bottom-[-30]'>
                                        <img
                                            src="/images/image.png"
                                            alt="User Avatar"
                                            className="md:w-30 w-20  md:h-30 h-20 rounded-full  shadow-lg z-10"
                                        />
                                    </div>
                                </div>

                                <div className='flex md:items-center md:justify-between mt-4 md:flex-row flex-col gap-4'>
                                    <Tabs value={active} onValueChange={setActive} className="w-full">
                                        <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
                                            <TabsList className="inline-flex items-center gap-2 bg-transparent rounded-full p-1 ">
                                                {tabsData.map((tab: any) => (
                                                    <TabsTrigger
                                                        key={tab.value}
                                                        value={tab.value}
                                                        className={`relative px-4 py-2 font-semibold text-sm rounded-full transition-all
                                                    shadow-none cursor-pointer border-none
                                                      ${active === tab.value
                                                                ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-[4px] after:bg-[#71717A] after:rounded-full'
                                                                : 'text-muted-foreground'
                                                            }`}
                                                    >
                                                        {tab.label}
                                                    </TabsTrigger>
                                                ))}
                                            </TabsList>
                                        </div>
                                    </Tabs>
                                </div>

                            </Card>
                            <div className=' mt-4 rounded-lg'>

                                {active === "overview" && (<EventOverView />)}

                                {active === "analytics" && (<EventAnalytics />)}

                                {active === "tickets" && (<EventTicket />)}

                                {active === "reservations" && (<EventReservation />)}

                                {active === "notifications" && (<EventNotification />)}
                            </div>
                        </div>

                        {/* Sidebar or Additional Panel */}
                        <div className="md:col-span-3 col-span-12 md:space-y-2 space-y-3">
                            {eventCardData.map((user: any) => (
                                <UserCard item={user} key={user._id} />
                            ))}
                            {/* <TotalFollowers /> */}

                            {/* <ActivePromontion /> */}

                            {/* <BusinessInfo /> */}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 mt-5'>
                        <Card className='col-span-12 shadow-lg  dark:bg-[#171717]'>
                            <CardHeader>
                                <div className='flex md:justify-between md:items-center flex-col md:flex-row gap-4'>
                                    <h3 className='text-xl font-semibold'>Transaction History</h3>
                                    <div>
                                        <Tabs value={tabActive} onValueChange={setTabActive} defaultValue="all" className='w-full '>
                                            <TabsList className='flex items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border  rounded-full p-1'>
                                                <TabsTrigger value="all" className={cn(
                                                    "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer ",
                                                )}>All</TabsTrigger>
                                                <TabsTrigger value="transactions" className={cn(
                                                    "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer",
                                                )}>Transactions</TabsTrigger>
                                                <TabsTrigger value="refunds" className={cn(
                                                    "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer",
                                                )}>Refunds</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                    <div className='flex flex-col md:items-center items-end'>
                                        <Select defaultValue='all'>
                                            <SelectTrigger >
                                                <SelectValue placeholder="" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup className='w-auto'>
                                                    <SelectLabel>Transaction</SelectLabel>
                                                    <SelectItem value="all">All</SelectItem>
                                                    <SelectItem value="today">Today</SelectItem>
                                                    <SelectItem value="thisWeek">This Week</SelectItem>
                                                    <SelectItem value="thisMonth">This Month</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardHeader>
                            <TransactionHistory />
                        </Card>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Page