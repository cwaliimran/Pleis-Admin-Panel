import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VisitorInterest } from '../invoices';
import { Button } from '@/components/ui/button';
import { Dot, Plus } from 'lucide-react';
// import { updates } from './data';
import TicketingModal from '../ticketing-view/ticketing-modal';
import { useBoolean } from '@/hooks/useBoolean';
import { useGeteventTicketsAnalyticsByIdQuery } from '@/store/Reducer/events';

const EventTicket = ({ id }: { id: any }) => {
  const openModal = useBoolean();
  const { data = {}, isLoading } = useGeteventTicketsAnalyticsByIdQuery(id);

  // Defensive fallback for missing fields
  const paidVsUnpaid = data?.paidVsUnpaidTicketStats || {
    soldTickets: 0,
    totalTickets: 0,
    paid: { count: 0, percentage: 0, amount: 0 },
    unpaid: { count: 0, percentage: 0, amount: 0 },
  };
  const scannedProgress = data?.scannedTicketProgress || {
    totalSold: 0,
    scanned: { count: 0, percentage: 0 },
    notScanned: { count: 0, percentage: 0 },
  };
  const ticketPerformanceWeekly = data?.ticketPerformanceWeekly || [];
  const ticketingStats = data?.ticketingStats || { earlyBird: {}, lastMinute: {}, regular: {}, grandTotal: { count: 0, amount: 0 } };

  return (
    <>
      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <svg className="text-primary h-10 w-10 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-6">
              {/* paid tickets and free tickets */}
              <Card className="dark:bg-[#171717]">
                <CardHeader>
                  <CardTitle>
                    {paidVsUnpaid.soldTickets} Tickets Sold / {paidVsUnpaid.totalTickets}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 flex items-start justify-between gap-4">
                    <div className="flex flex-1 flex-col">
                      <h1 className="mb-1 font-semibold">Paid Tickets</h1>
                      <h1 className="text-end text-sm">{paidVsUnpaid.paid.percentage ?? 0}%</h1>
                      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="bg-primary h-full transition-all duration-500" style={{ width: `${paidVsUnpaid.paid.percentage ?? 0}%` }} />
                      </div>
                      <h1 className="text-start text-sm">
                        {paidVsUnpaid.paid.count ?? 0} ({paidVsUnpaid.paid.amount ?? 0})
                      </h1>
                    </div>
                  </div>
                  <hr className="my-5" />
                  <div className="mt-2 flex items-start justify-between gap-4">
                    <div className="flex flex-1 flex-col">
                      <h1 className="mb-1 font-semibold">Free Tickets</h1>
                      <h1 className="text-end text-sm">{paidVsUnpaid.unpaid.percentage ?? 0}%</h1>
                      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="bg-primary h-full transition-all duration-500" style={{ width: `${paidVsUnpaid.unpaid.percentage ?? 0}%` }} />
                      </div>
                      <h1 className="text-start text-sm">
                        {paidVsUnpaid.unpaid.count ?? 0} ({paidVsUnpaid.unpaid.amount ?? 0})
                      </h1>
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
                      <h1 className="mb-1 font-semibold">Scanned Tickets</h1>
                      <h1 className="text-end text-sm">{scannedProgress.scanned.percentage ?? 0}%</h1>
                      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="bg-primary h-full transition-all duration-500"
                          style={{ width: `${scannedProgress.scanned.percentage ?? 0}%` }}
                        />
                      </div>
                      <h1 className="text-start text-sm">{scannedProgress.scanned.count ?? 0}</h1>
                    </div>
                  </div>
                  <hr className="my-5" />
                  <div className="mt-2 flex items-start justify-between gap-4">
                    <div className="flex flex-1 flex-col">
                      <h1 className="mb-1 font-semibold">Not Scanned</h1>
                      <h1 className="text-end text-sm">{scannedProgress.notScanned.percentage ?? 0}%</h1>
                      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="bg-primary h-full transition-all duration-500"
                          style={{ width: `${scannedProgress.notScanned.percentage ?? 0}%` }}
                        />
                      </div>
                      <h1 className="text-start text-sm">{scannedProgress.notScanned.count ?? 0}</h1>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={openModal.onTrue} className="bg-primary hover:bg-primary mt-4 h-10 w-full cursor-pointer rounded-3xl text-white">
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
                      <h1 className="text-md leading-6 text-[#7B7E91]">Free Tickets</h1>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <VisitorInterest
                    chartData={ticketPerformanceWeekly.map((item: any) => ({
                      month: item.day,
                      males: item.paid ?? 0,
                      females: item.free ?? 0,
                    }))}
                    chartConfig={{
                      males: { label: 'Paid Tickets', color: '#2563EB' },
                      females: { label: 'Free Tickets', color: '#7B7E91' },
                    }}
                  />
                </CardContent>
              </Card>
              {/* sale by ticket type */}
              <Card className="mt-4 space-y-4 shadow-lg dark:bg-[#171717]">
                <CardContent>
                  <h2 className="text-muted-foreground text-sm font-semibold">Sales by Ticket Type</h2>
                  {['earlyBird', 'lastMinute', 'regular'].map((type) => {
                    const stats = ticketingStats[type] || {};
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between rounded-md p-4">
                          {/* Left side */}
                          <div className="flex-1">
                            <p className="mb-1 text-sm font-medium">{type.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</p>
                            <div className="text-muted-foreground flex items-center gap-3 text-sm">
                              {/* Status Dot */}
                              <div className="flex items-center gap-1">
                                <Dot className={`h-2 w-2 rounded-full ${stats.total?.count > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span>{stats.total?.count > 0 ? 'On sale' : 'Sold Out'}</span>
                              </div>
                              {/* Separator Dot */}
                              <div className="flex items-center gap-1">
                                <Dot className="h-1 w-1 rounded-full bg-slate-500" />
                              </div>
                              {/* Description */}
                              <span>
                                Valid: {stats.valid?.count ?? 0}, Used: {stats.used?.count ?? 0}, Cancelled: {stats.cancelled?.count ?? 0}
                              </span>
                            </div>
                          </div>
                          {/* Right side */}
                          <div className="text-muted-foreground flex items-center gap-4 text-sm">
                            <span>
                              {stats.used?.count ?? 0}/{stats.totalCreated ?? 0}
                            </span>
                            <span>${stats.used?.amount?.toFixed(2) ?? '0.00'}</span>
                            <div>
                              <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                  title="status"
                                  type="checkbox"
                                  // checked={stats.total?.count > 0}
                                  onChange={() => {
                                    console.log(`Toggled active for ${type}`);
                                  }}
                                  className="peer sr-only"
                                />
                                <div className="peer-focus:ring-primary peer peer-checked:bg-primary h-6 w-10 rounded-full bg-gray-200 transition-colors duration-200 peer-focus:ring-2 peer-focus:outline-none"></div>
                                <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-4"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                        <hr />
                      </div>
                    );
                  })}
                  {/* Optional Summary Section */}
                  {/* <div className="flex flex-col px-1 pt-2">
                <p className="text-sm text-slate-500">
                  You can set a specific limit for your event capacity that is different than the total of your ticket quantities
                </p>
                <div className="mt-5 flex items-center">
                  <div className="flex items-center">
                    <Input type="checkbox" className="h-4 w-4" />
                    <span className="ml-2 text-sm font-semibold">Limit Event Capacity</span>
                  </div>
                  <Input type="number" placeholder="0" className="ml-2 h-8 flex-1 rounded-4xl bg-gray-100 px-2 text-sm" />
                </div>
              </div> */}
                </CardContent>
              </Card>
            </div>
          </div>

          <TicketingModal open={openModal.value} onClose={openModal.onFalse} />
        </div>
      )}
    </>
  );
};

export default EventTicket;
