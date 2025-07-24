import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { VisitorInterest } from '../invoices'
import { Button } from '@/components/ui/button'
import { Dot, Ellipsis, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { updates } from './data'

const EventTicket = () => {


  return (
    <div>
      <div className='grid grid-cols-12 gap-4'>
        <div className='lg:col-span-6 col-span-12'>
          {/* paid tickets and free tickets */}
          <Card className='dark:bg-[#171717]'>
            <CardHeader>
              <CardTitle>100 Tickets Sold / 200</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-2  flex justify-between items-start gap-4">
                <div className="flex-1 flex flex-col">
                  <h1 className='mb-1 font-semibold'>Paid Tickets</h1>
                  <h1 className=' text-end text-sm'>70%</h1>
                  <div className="w-full h-4 bg-gray-200 rounded-full mb-2 overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500 w-5/6" />
                  </div>
                  <h1 className=' text-start text-sm'>6000</h1>
                </div>
              </div>
              <hr className='my-5' />
              <div className="mt-2 flex justify-between items-start gap-4">
                <div className="flex-1 flex flex-col">
                  <h1 className='mb-1 font-semibold'>Paid Tickets</h1>
                  <h1 className=' text-end text-sm'>25%</h1>
                  <div className="w-full h-4 bg-gray-200 rounded-full mb-2 overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500 w-1/4" />
                  </div>
                  <h1 className=' text-start text-sm'>6000</h1>

                </div>
              </div>
            </CardContent>
          </Card>
          {/* Scanned Ticket Progress */}
          <Card className='dark:bg-[#171717] mt-4'>
            <CardHeader>
              <CardTitle>Scanned Ticket Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-2  flex justify-between items-start gap-4">
                <div className="flex-1 flex flex-col">
                  <h1 className='mb-1 font-semibold'>Scenned Tickets</h1>
                  <h1 className=' text-end text-sm'>70%</h1>
                  <div className="w-full h-4 bg-gray-200 rounded-full mb-2 overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500 w-5/6" />
                  </div>
                  <h1 className=' text-start text-sm'>6000</h1>
                </div>
              </div>
              <hr className='my-5' />
              <div className="mt-2 flex justify-between items-start gap-4">
                <div className="flex-1 flex flex-col">
                  <h1 className='mb-1 font-semibold'>Not Scanned</h1>
                  <h1 className=' text-end text-sm'>25%</h1>
                  <div className="w-full h-4 bg-gray-200 rounded-full mb-2 overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500 w-1/4" />
                  </div>
                  <h1 className=' text-start text-sm'>6000</h1>

                </div>
              </div>
            </CardContent>
          </Card>
          <Button className='rounded-3xl bg-primary hover:bg-primary text-white cursor-pointer mt-4 w-full'>
            <Plus /> Add Tickets
          </Button>
        </div>
        <div className='lg:col-span-6 col-span-12'>
          {/* revenue chart of paid and free tickets */}
          <Card className='dark:bg-[#171717] '>
            <CardHeader>
              <CardTitle>Revenue over time</CardTitle>
              <div className='flex items-center gap-2'>
                <div className='flex items-center'>
                  <div className='w-2 h-2 rounded-full bg-[#2563EB] mr-2' />
                  <h1 className='text-md leading-6 '>
                    Paid Tickets
                  </h1>
                </div>
                <div className='flex items-center'>
                  <div className='w-2 h-2 rounded-full bg-[#7B7E91] mr-2' />
                  <h1 className='text-md leading-6 text-[#7B7E91]'>
                    Free Tickets
                  </h1>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <VisitorInterest
                chartData={[
                  { month: "Monday", males: 120, females: 100 },
                  { month: "Tuesday", males: 200, females: 150 },
                  { month: "Wednesaday", males: 280, females: 100 },
                  { month: "Thursday", males: 73, females: 190 },
                  { month: "Friday", males: 209, females: 130 },
                  { month: "Saturday", males: 214, females: 140 }
                ]}
                chartConfig={{
                  males: { label: "Males", color: "#2563EB" },
                  females: { label: "Females", color: "#202C88" },
                }}
              />
            </CardContent>
          </Card>
          {/* sale by ticket type */}
          <Card className="space-y-4 mt-4 shadow-lg dark:bg-[#171717]">
            <CardContent>
              <h2 className="text-sm font-semibold text-muted-foreground">Sales by Ticket Type</h2>
              {updates.map((update, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center p-4 rounded-md">
                    {/* Left side */}
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">{update.title}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {/* Status Dot */}
                        <div className="flex items-center gap-1">
                          <Dot
                            className={`w-2 h-2 rounded-full ${index === 0 || index === 1 ? "bg-green-500" : "bg-red-500"
                              }`}
                          />
                          <span>{index === 1 || index === 2 ? "On sale" : "Sold Out"}</span>
                        </div>

                        {/* Separator Dot */}
                        <div className="flex items-center gap-1">
                          <Dot className="w-1 h-1 rounded-full bg-slate-500" />
                        </div>

                        {/* Description */}
                        <span>{update.description.slice(0, 10)}</span>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>0/250</span>
                      <span>$10.00</span>
                      <Ellipsis className="cursor-pointer" />
                    </div>
                  </div>
                  <hr />
                </div>
              ))}


              {/* Optional Summary Section */}
              <div className="flex  flex-col px-1 pt-2">
                <p className="text-sm  text-slate-500">
                  You can set a specific limit for your event capacity that is different than the total of your ticket quantities</p>
                <div className='flex items-center mt-5'>
                  <div className='flex items-center'>
                    <Input type='checkbox' className='h-4 w-4' />
                    <span className='text-sm ml-2 font-semibold'>Limit Event Capacity</span>
                  </div>
                  <Input type='number' placeholder='0' className='ml-2 flex-1 h-8 rounded-4xl px-2 text-sm bg-gray-100' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div >
  )
}

export default EventTicket