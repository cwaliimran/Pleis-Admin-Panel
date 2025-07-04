import { Badge } from '@/components/ui/badge';
import { Card, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Delete, Edit, Facebook, Instagram, Pencil, TicketCheckIcon, Trash2 } from 'lucide-react';
import React, { FC } from 'react'
import { tabsData, userData } from './data';
import UserCard from './userCard';
import UserInfo from './userInfo';
import UserEvents from './userEvents';
import UserLoyalty from './userLoyalty';
import Useranalytics from './useranalytics';
import UserNotifications from './userNotifications';
import { ActivePromontion, BusinessInfo, TotalFollowers, UserCalender } from '.';

interface UserDetailPageProps {
    id: string;
}
const UserDetailPage: FC<UserDetailPageProps> = ({ id }) => {
    const [active, setActive] = React.useState("info");

    return (
        <div className="mt-10 h-full">
            <div className="grid grid-cols-12 gap-7">
                <div className="md:col-span-9 col-span-12">
                    <Card className="overflow-hidden  p-4  shadow-md">
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
                        <div className='flex justify-end  '>
                            <Pencil className='text-gray-500 cursor-pointer hover:text-gray-700 transition-colors' />
                            <Trash2 className='text-gray-500 cursor-pointer hover:text-gray-700 transition-colors ml-4' />
                        </div>
                        <div className='flex items-center gap-2 '>
                            <h1 className='md:text-3xl  text-2xl font-bold ml-2 pt-0 mt-0'>Peti Kupe</h1>
                            <Badge className={`bg-blue-100 text-black  rounded-full px-3 py-1 text-xs font-medium`}>
                                Premium
                            </Badge>
                        </div>
                        <Badge className={`bg-blue-100 text-black  rounded-full px-3 py-1 text-xs font-medium`}>
                            12,342 Subscriptions
                        </Badge>
                        <div className='flex items-center gap-2 '>
                            <Badge className={`bg-blue-100 text-black  rounded-full px-3 py-1 text-xs font-medium`}>
                                5% Commission
                            </Badge>
                            <Badge className={`bg-blue-100 text-black  rounded-full px-3 py-1 text-xs font-medium`}>
                                12 Boost
                            </Badge>
                        </div>
                        <div className='flex md:items-center md:justify-between mt-4 md:flex-row flex-col gap-4'>
                            <Tabs value={active} onValueChange={setActive} className="w-full">
                                <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
                                    <TabsList className="inline-flex items-center gap-2 bg-transparent rounded-full p-1">
                                        {tabsData.map((tab: any) => (
                                            <TabsTrigger
                                                key={tab.value}
                                                value={tab.value}
                                                className={`relative px-4 py-2 font-semibold text-sm rounded-full transition-all
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
                            <div className="flex gap-4">
                                <Badge className="bg-blue-200 text-blue-800 w-10 h-10 cursor-pointer rounded-full flex items-center justify-center p-0">
                                    <Facebook className="w-5 h-5 " />
                                </Badge>

                                <Badge className="bg-blue-200 text-blue-800 cursor-pointer w-10 h-10 rounded-full flex items-center justify-center p-0">
                                    <Instagram className="w-5 h-5 " />
                                </Badge>

                                <Badge className="bg-blue-200 text-blue-800  cursor-pointer w-10 h-10 rounded-full flex items-center justify-center p-0">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 256 256"
                                        fill="currentColor"
                                        className="w-5 h-5 "
                                    >
                                        <path d="M232 72v40a88 88 0 1 1-88-88h40v40a48 48 0 0 0 48 48V72a72 72 0 0 1-72-72h-40a128 128 0 1 0 128 128V72Z" />
                                    </svg>
                                </Badge>
                            </div>
                        </div>
                    </Card>
                    <div className=' mt-4 rounded-lg'>

                        {active === "info" && (<UserInfo />)}

                        {active === "events" && (<UserEvents />)}

                        {active === "loyalty" && (<UserLoyalty />)}

                        {active === "analytics" && (<Useranalytics />)}

                        {active === "notifications" && (<UserNotifications />)}

                        {active === "calendar" && (<UserCalender />)}
                    </div>
                </div>

                {/* Sidebar or Additional Panel */}
                <div className="md:col-span-3 col-span-12 md:space-y-2 space-y-3">
                    {userData.map((user: any) => (
                        <UserCard item={user} key={user._id} />
                    ))}
                    <TotalFollowers />
                    <ActivePromontion />
                    <BusinessInfo />
                </div>
            </div>
        </div>
    )
}

export default UserDetailPage