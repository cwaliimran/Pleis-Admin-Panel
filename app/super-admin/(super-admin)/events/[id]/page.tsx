
"use client";

import Header from '@/app/common/header'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userData } from '@/sections/create-organization/create-org-data';
import { eventCardData } from '@/sections/event/data';
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
import { Pencil, Trash2 } from 'lucide-react';
import { useBoolean } from '@/hooks/useBoolean';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';

const Page = () => {
    const [active, setActive] = React.useState("overview");
    const [tabActive, setTabActive] = React.useState("all");
    const router = useRouter();
    const deleteModal = useBoolean();
    const onDelete = () => {
        deleteModal.onFalse();
        // Handle delete logic here
    }

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


                            <Card className=" dark:bg-[#171717] shadow-md">
                                <CardContent>
                                    <div className='flex flex-col sm:flex-row gap-3 '>
                                        <div className="w-full sm:w-1/3">
                                            <img
                                                src="/images/eventImage.png"
                                                alt="Event"
                                                className="rounded-md w-full h-auto object-cover"
                                            />
                                        </div>

                                        {/* Right Content */}
                                        <div className="w-full sm:w-2/3 flex flex-col gap-3">
                                            {/* Status and Date */}
                                            <div className="flex items-center justify-between gap-3 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                                        Upcoming
                                                    </span>
                                                    <span>Sat, 26 Feb</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Pencil
                                                        className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                                                        onClick={() => router.push("/super-admin/events/create-event")}
                                                    />
                                                    <Trash2
                                                        className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors ml-4"
                                                        onClick={deleteModal.onTrue}
                                                    />
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                Summer Music Festival 2025
                                            </h2>

                                            {/* Description */}
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                Svirati ploče bez pritiska, jednostavno iz ljubavi prema zvukovima te
                                                njegovati umjetnost slušanja muzike. Misija je to jedinstvenog kluba
                                                Kasheme u Zürichu. S ovim audiofilskim barom posebne koncepcije i
                                                uređenja upoznali smo se proljetos pri gostovanju njihove sjajne ekipe
                                                u Kupeu.
                                            </p>

                                            {/* Organizer */}
                                            <div className="mt-2">
                                                <h4 className="text-xs font-bold text-gray-500">ORGANIZER</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <img
                                                        src="/images/eventImage.png"
                                                        alt="Peti Kupe"
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                    <span className="text-sm font-medium text-gray-800">Peti Kupe</span>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    {/* Tabs and Boost Button */}
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mt-4">
                                        <Tabs  value={active} onValueChange={setActive}  className="w-full sm:w-auto">
                                            <TabsList>
                                                {tabsData.map((tab) => (
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
                                        </Tabs>

                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-3xl hover:bg-blue-700 transition w-full sm:w-auto">
                                            Boost
                                        </button>
                                    </div>


                                </CardContent>
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
                    {active === "analytics" && <div className='grid grid-cols-12 mt-5'>
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
                    </div>}
                </div>
            </div>
            <ConfirmDialog
                open={deleteModal.value}
                title="Delete Event"
                content="Are you sure you want to delete this?"
                onClose={deleteModal.onFalse}
                onConfirm={onDelete}
            />
        </div>

    )
}

export default Page