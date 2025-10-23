import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { VisitorInterest } from '../invoices';
import { Button } from '@/components/ui/button';
import { Dot, Ellipsis, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { updates } from './data';
// import { useBoolean } from '@/hooks/useBoolean';

const EventTicket = () => {
  // const openModal = useBoolean();

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6">
          {/* paid tickets and free tickets */}
          <Card className="dark:bg-[#171717]">
            <CardHeader>
              <CardTitle>100 Tickets Sold / 200</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-2 flex items-start justify-between gap-4">
                <div className="flex flex-1 flex-col">
                  <h1 className="mb-1 font-semibold">Paid Tickets</h1>
                  <h1 className="text-end text-sm">70%</h1>
                  <div className="mb-2 h-4 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="bg-primary h-full w-5/6 transition-all duration-500" />
                  </div>
                  <h1 className="text-start text-sm">6000</h1>
                </div>
              </div>
              <hr className="my-5" />
              <div className="mt-2 flex items-start justify-between gap-4">
                <div className="flex flex-1 flex-col">
                  <h1 className="mb-1 font-semibold">Paid Tickets</h1>
                  <h1 className="text-end text-sm">25%</h1>
                  <div className="mb-2 h-4 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="bg-primary h-full w-1/4 transition-all duration-500" />
                  </div>
                  <h1 className="text-start text-sm">6000</h1>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Scanned Ticket Progress */}
          <Card className="mt-4 dark:bg-[#171717]">
            <CardHeader>
              <CardTitle>Scanned Ticket Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-2 flex items-start justify-between gap-4">
                <div className="flex flex-1 flex-col">
                  <h1 className="mb-1 font-semibold">Scenned Tickets</h1>
                  <h1 className="text-end text-sm">70%</h1>
                  <div className="mb-2 h-4 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="bg-primary h-full w-5/6 transition-all duration-500" />
                  </div>
                  <h1 className="text-start text-sm">6000</h1>
                </div>
              </div>
              <hr className="my-5" />
              <div className="mt-2 flex items-start justify-between gap-4">
                <div className="flex flex-1 flex-col">
                  <h1 className="mb-1 font-semibold">Not Scanned</h1>
                  <h1 className="text-end text-sm">25%</h1>
                  <div className="mb-2 h-4 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="bg-primary h-full w-1/4 transition-all duration-500" />
                  </div>
                  <h1 className="text-start text-sm">6000</h1>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="bg-primary hover:bg-primary mt-4 w-full cursor-pointer rounded-3xl text-white">
            <Plus /> Add Tickets
          </Button>
        </div>

        <div className="col-span-12 lg:col-span-6">
          {/* revenue chart of paid and free tickets */}
          <Card className="dark:bg-[#171717]">
            <CardHeader>
              <CardTitle>Revenue over time</CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-[#2563EB]" />
                  <h1 className="text-md leading-6">Paid Tickets</h1>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-[#7B7E91]" />
                  <h1 className="text-md leading-6 text-[#7B7E91]">
                    Free Tickets
                  </h1>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <VisitorInterest
                chartData={[
                  { month: 'Monday', males: 120, females: 100 },
                  { month: 'Tuesday', males: 200, females: 150 },
                  { month: 'Wednesaday', males: 280, females: 100 },
                  { month: 'Thursday', males: 73, females: 190 },
                  { month: 'Friday', males: 209, females: 130 },
                  { month: 'Saturday', males: 214, females: 140 },
                ]}
                chartConfig={{
                  males: { label: 'Males', color: '#2563EB' },
                  females: { label: 'Females', color: '#202C88' },
                }}
              />
            </CardContent>
          </Card>
          {/* sale by ticket type */}
          <Card className="mt-4 space-y-4 shadow-lg dark:bg-[#171717]">
            <CardContent>
              <h2 className="text-muted-foreground text-sm font-semibold">
                Sales by Ticket Type
              </h2>
              {updates.map((update, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between rounded-md p-4">
                    {/* Left side */}
                    <div className="flex-1">
                      <p className="mb-1 text-sm font-medium">{update.title}</p>
                      <div className="text-muted-foreground flex items-center gap-3 text-sm">
                        {/* Status Dot */}
                        <div className="flex items-center gap-1">
                          <Dot
                            className={`h-2 w-2 rounded-full ${
                              index === 0 || index === 1
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                          />
                          <span>
                            {index === 1 || index === 2
                              ? 'On sale'
                              : 'Sold Out'}
                          </span>
                        </div>

                        {/* Separator Dot */}
                        <div className="flex items-center gap-1">
                          <Dot className="h-1 w-1 rounded-full bg-slate-500" />
                        </div>

                        {/* Description */}
                        <span>{update.description.slice(0, 10)}</span>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      <span>0/250</span>
                      <span>$10.00</span>
                      <Ellipsis className="cursor-pointer" />
                    </div>
                  </div>
                  <hr />
                </div>
              ))}

              {/* Optional Summary Section */}
              <div className="flex flex-col px-1 pt-2">
                <p className="text-sm text-slate-500">
                  You can set a specific limit for your event capacity that is
                  different than the total of your ticket quantities
                </p>
                <div className="mt-5 flex items-center">
                  <div className="flex items-center">
                    <Input type="checkbox" className="h-4 w-4" />
                    <span className="ml-2 text-sm font-semibold">
                      Limit Event Capacity
                    </span>
                  </div>
                  <Input
                    type="number"
                    placeholder="0"
                    className="ml-2 h-8 flex-1 rounded-4xl bg-gray-100 px-2 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* <TicketingModal
        open={openModal.value}
        onClose={CloseModal}
        editMode={editModal.value}
        methods={methods}
        onSubmit={onSubmit}
        isLoading={addItemsCategoryLoading || updateItemsCategoryLoading}
      /> */}
    </div>
  );
};

export default EventTicket;
