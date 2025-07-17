import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Ellipsis, MapPin, PartyPopper, Shirt, UserPlus, UsersRound } from 'lucide-react'
import React from 'react'
import { userTags } from './data'

const UserInfo = () => {


    const totalDays = 30;
    const remainingDays = 5;
    const progressPercent = ((totalDays - remainingDays) / totalDays) * 100;
    return (
        <div className='grid grid-cols-12 gap-4 mt-7'>
            <div className=' md:col-span-5 col-span-12'>
                <Card className='shadow-lg dark:bg-[#171717]'>
                    <CardHeader>
                        <h1 className='text-slate-500 font-semibold'>DESCRIPTION</h1>
                        <p className=' mt-2'>
                            Peti Kupe je destinacija u kojoj se isprepliću glazba, umjetnosti, edukativni sadržaji i gastronomija.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <Badge className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors">
                                +18
                            </Badge>

                            <Badge className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors">
                                <Shirt className="mr-2 !h-5 !w-5" />
                                Casual Formal
                            </Badge>

                            <Badge className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors">
                                <UserPlus className="mr-2 !h-5 !w-5" />
                                500
                            </Badge>
                        </div>

                    </CardHeader>
                </Card>
                <Card className='mt-4 shadow-lg dark:bg-[#171717]'>
                    <CardHeader>
                        <h1 className='text-slate-500 font-semibold '>VENU</h1>
                        <div className='flex items-center gap-2 mt-2'>
                            <PartyPopper />
                            <p className=' mt-2 text-lg '>
                                Nightclub
                            </p>
                        </div>
                    </CardHeader>

                </Card>
                <Card className='mt-4 shadow-lg dark:bg-[#171717]'>
                    <CardHeader>
                        <h1 className='text-slate-500 font-semibold'>CATEGORIES</h1>
                        <div className='flex items-center gap-2 mt-2 flex-wrap'>
                            {userTags.map((item, index) => (
                                <Badge key={index} className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors">
                                    {item}
                                </Badge>
                            ))
                            }
                        </div>
                    </CardHeader>

                </Card>
                <Card className='mt-4 shadow-lg dark:bg-[#171717]'>
                    <CardHeader>
                        <h1 className='text-slate-500 font-semibold'>TAGS</h1>
                        <div className='flex items-center gap-2 mt-2 flex-wrap'>
                            {userTags.map((item, index) => (

                                <Badge key={index} className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors">
                                    {item}
                                </Badge>
                            ))
                            }
                        </div>
                    </CardHeader>
                </Card>
                <Card className='mt-4 shadow-lg dark:bg-[#171717]'>
                    <CardHeader>
                        <div className='flex justify-between item-center '>
                            <Badge className="bg-gray-100 dark:bg-white text-black  rounded-full px-4 py-1 text-md font-medium">
                                Active
                            </Badge>
                            <Ellipsis className='cursor-pointer w-4 h-4' />
                        </div>
                        <div className="mt-2 flex justify-between items-start gap-4">
                            {/* Left Image */}
                            <img
                                src="/images/bannerImage.png"
                                alt="Promotion"
                                className="w-20 h-20 rounded-[10px] object-cover"
                            />

                            {/* Right Content */}
                            <div className="flex-1 flex flex-col">
                                {/* Top Row: Label + Days Left */}
                                <div className="flex justify-between items-center w-full mb-1">
                                    <h1 className="text-slate-500 font-semibold">PROMOTION</h1>
                                    <h1 className="text-green-500 font-semibold whitespace-nowrap">24 Days left</h1>
                                </div>

                                {/* Title */}
                                <h1 className="text-xl font-medium">Promotion Name</h1>
                                <p className='text-slate-500 mt-1'>
                                    lorem ipsum dolor sit amet, consectetur ...
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <hr />
                    <CardContent>
                        <div className='flex'>
                            <div className='flex'>
                                <UsersRound className='w-5 h-5 text-slate-500' />
                                <p className='text-slate-500 ml-2 font-[400]'>Max Points <span className='font-[700]'>632</span></p>
                            </div>
                            <div className='flex md:ml-7 ml-3'>
                                <UsersRound className='w-5 h-5 text-slate-500' />
                                <p className='text-slate-500 ml-2 font-[400]'>Max Points <span className='font-[700]'>632</span></p>
                            </div>
                        </div>
                        <div className='flex justify-between items-center mt-4'>
                            <h1 className="text-slate-500 font-semibold">REWARD AVAILABILITY</h1>
                            <h1 className="text-slate-500 ">488/2300</h1>
                        </div>
                        <div className="mt-2 flex justify-between items-start gap-4">

                            <div className="flex-1 flex flex-col">

                                <div className="w-full h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-500"
                                        style={{ width: `${progressPercent}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className='mt-5 grid grid-cols-12 gap-4'>
                    <div className='md:col-span-6 col-span-12 shadow-lg bg-white dark:bg-black  w-full border-2 border-gray-300  rounded-full text-center
                   hover:bg-gray-100 '>
                        <Badge className=" bg-transparent text-black dark:text-slate-500 px-4 py-1 text-md font-semibold">
                            New Promonation
                        </Badge>
                    </div>
                    <div className='md:col-span-6 col-span-12 shadow-lg bg-white dark:bg-black w-full border-2 border-gray-300  rounded-full text-center hover:bg-gray-100 '>
                        <Badge className="bg-transparent text-black dark:text-slate-500  px-4 py-1 text-md font-semibold">
                            New Notificaion
                        </Badge>
                    </div>
                </div>
                <div className='col-span-12 shadow-lg bg-white dark:bg-black w-full border-2 border-gray-300  rounded-full text-center mt-4 hover:bg-gray-100'>
                    <Badge className="bg-transparent text-black dark:text-gray-500  px-4 py-1 text-md font-semibold">
                        Join Loyalty
                    </Badge>
                </div>
            </div>
            <div className='md:col-span-7 col-span-12'>
                <Card className='shadow-lg dark:bg-[#171717]'>
                    <CardHeader className='w-full flex flex-col gap-2'>
                        <h1 className='text-slate-500 font-semibold'>LOCATION PIN</h1>
                        <div className='flex items-center gap-2 mt-2'>
                            <MapPin />
                            <span >Trnjanska cesta 5, 10 000 Zagreb, Cro...</span>
                        </div>
                        <img src="/images/mapImage.png" alt="" className='w-full h-full mt-2' />
                    </CardHeader>
                </Card>
                <Card className='shadow-lg mt-5 dark:bg-[#171717]'>
                    <CardHeader className='gap-4'>
                        <h1 className='text-slate-500 font-semibold'>GALLERY</h1>
                        <img src="/images/bannerImage.png" className='w-full md:h-[300px] h-[200px] rounded-2xl' />
                        <div className='w-full grid grid-cols-12 gap-2'>

                            {[1, 2, 3, 4].map((item, index) => (
                                <img
                                    key={index}
                                    src="/images/bannerImage.png"
                                    className='col-span-6 md:col-span-3 w-full md:h-[140px] h-[100px] rounded-lg object-cover cursor-pointer'
                                    alt={`Gallery Image ${index + 1}`}
                                />
                            )
                            )}
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}

export default UserInfo