import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBoolean } from '@/hooks/useBoolean';
import { useGeteventTicketsAnalyticsByIdQuery } from '@/store/Reducer/events';
import { useUpdateTicketingMutation } from '@/store/Reducer/ticketing-api';
import { Dot, Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { MostViewedEvent } from '../invoices';
import TicketingModal from '../ticketing-view/ticketing-modal';
import EventLoading from './components/event-loading';

const EventTicket = ({ event }: { event: any }) => {
  const openModal = useBoolean();
  const { data = {}, isLoading, refetch } = useGeteventTicketsAnalyticsByIdQuery(event?._id);
  const [updateTicketing] = useUpdateTicketingMutation();
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);

  // New ticketTypeStats array
  const ticketTypeStats = data?.ticketTypeStats || [];

  // Calculate totals from ticketTypeStats
  const totalSold = ticketTypeStats.reduce((acc: number, ticket: any) => acc + (ticket.sold || 0), 0);
  const totalCreated = ticketTypeStats.reduce((acc: number, ticket: any) => acc + (ticket.totalCreated || 0), 0);

  const scannedProgress = data?.scannedTicketProgress || {
    totalSold: 0,
    scanned: { count: 0, percentage: 0 },
    notScanned: { count: 0, percentage: 0 },
  };

  const ticketPerformanceWeekly = data?.ticketPerformanceWeekly || [];
  const ticketingStatsTickets = data?.ticketingStats?.tickets || [];

  const handleStatusToggle = async (ticketId: string, currentStatus: string) => {
    try {
      setUpdatingTicketId(ticketId);
      await updateTicketing({
        id: ticketId,
        status: currentStatus === 'active' ? 'inactive' : 'active',
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    } finally {
      setUpdatingTicketId(null);
    }
  };

  return (
    <>
      {isLoading ? (
        <EventLoading />
      ) : (
        <div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-6">
              {/* Ticket Types Stats - Dynamic from ticketTypeStats array */}
              <Card className="dark:bg-[#171717]">
                <CardHeader>
                  <CardTitle>
                    {totalSold} Tickets Sold / {totalCreated}
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-100 overflow-y-auto">
                  {ticketTypeStats.length > 0 ? (
                    ticketTypeStats.map((ticket: any, index: number) => {
                      const totalTickets = ticket.totalCreated || 0;
                      const soldPercentage = totalTickets > 0 ? ((ticket.sold || 0) / totalTickets) * 100 : 0;

                      return (
                        <div key={ticket.ticketId || index}>
                          <h2 className="mb-3 text-base font-bold">{ticket.title}</h2>
                          <p className="text-muted-foreground mb-2 text-xs">
                            Sold: {ticket.sold || 0} | Remaining: {ticket.remaining || 0} | Total: {totalTickets}
                          </p>
                          <div className="mt-2 flex items-start justify-between gap-4">
                            <div className="flex flex-1 flex-col">
                              <div className="mb-1 flex items-center justify-between">
                                <h1 className="font-semibold">Tickets Sold</h1>
                                <h1 className="text-sm">{soldPercentage.toFixed(0)}%</h1>
                              </div>
                              <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                <div className="bg-primary h-full transition-all duration-500" style={{ width: `${soldPercentage}%` }} />
                              </div>
                              <h1 className="text-start text-sm">
                                {ticket.sold || 0} / {totalTickets}
                              </h1>
                            </div>
                          </div>
                          {index < ticketTypeStats.length - 1 && <hr className="my-5" />}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-muted-foreground text-sm">No ticket types available</p>
                  )}
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
                  <CardTitle>Ticket Sales Over Time</CardTitle>
                </CardHeader>
                <MostViewedEvent
                  chartData={ticketPerformanceWeekly.map((item: any) => ({
                    month: item.day,
                    search: item.value ?? 0,
                  }))}
                  chartConfig={{
                    search: { label: 'Tickets Sold', color: '#2563EB' },
                  }}
                />
              </Card>

              {/* sale by ticket type */}
              <Card className="mt-4 space-y-4 shadow-lg dark:bg-[#171717]">
                <CardContent>
                  <h2 className="text-muted-foreground text-sm font-semibold">Sales by Ticket Type</h2>
                  {ticketingStatsTickets.map((ticket: any) => {
                    const isOnSale = ticket.saleStatus === 'onSale';
                    const isActive = ticket.status === 'active';
                    return (
                      <div key={ticket.ticketId}>
                        <div className="flex items-center justify-between rounded-md p-4">
                          {/* Left side */}
                          <div className="flex-1">
                            <p className="mb-1 text-sm font-medium">{ticket.title}</p>
                            <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                              {/* Sale Status Dot */}
                              <div className="flex items-center gap-1">
                                <Dot className={`h-2 w-2 rounded-full ${isOnSale ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span>{isOnSale ? 'On Sale' : 'Sold Out'}</span>
                              </div>
                              {/* Separator Dot */}
                              <div className="flex items-center gap-1">
                                <Dot className="h-1 w-1 rounded-full bg-slate-500" />
                              </div>
                              {/* Status */}
                              <div className="flex items-center gap-1">
                                <span className={`capitalize ${isActive ? 'text-green-600' : 'text-red-500'}`}>{ticket.status}</span>
                              </div>
                              {/* Separator Dot */}
                              <div className="flex items-center gap-1">
                                <Dot className="h-1 w-1 rounded-full bg-slate-500" />
                              </div>
                              {/* Description */}
                              <span>
                                Valid: {ticket.valid?.count ?? 0}, Used: {ticket.used?.count ?? 0}, Cancelled: {ticket.cancelled?.count ?? 0}
                              </span>
                            </div>
                          </div>
                          {/* Right side */}
                          <div className="text-muted-foreground flex items-center gap-4 text-sm">
                            <span>
                              {ticket.used?.count ?? 0}/{ticket.totalCreated ?? 0}
                            </span>
                            <span>${ticket.used?.amount?.toFixed(2) ?? '0.00'}</span>
                            <div>
                              {updatingTicketId === ticket.ticketId ? (
                                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                              ) : (
                                <label className="relative inline-flex cursor-pointer items-center">
                                  <input
                                    title="status"
                                    type="checkbox"
                                    checked={isActive}
                                    disabled={updatingTicketId !== null}
                                    onChange={() => handleStatusToggle(ticket.ticketId, ticket.status)}
                                    className="peer sr-only"
                                  />
                                  <div className="peer-focus:ring-primary peer peer-checked:bg-primary h-6 w-10 rounded-full bg-gray-200 transition-colors duration-200 peer-focus:ring-2 peer-focus:outline-none"></div>
                                  <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-4"></div>
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                        <hr />
                      </div>
                    );
                  })}

                  {ticketingStatsTickets.length === 0 && <p className="text-muted-foreground py-4 text-sm">No ticket types available</p>}

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

          <TicketingModal open={openModal.value} onClose={openModal.onFalse} event={event} />
        </div>
      )}
    </>
  );
};

export default EventTicket;
