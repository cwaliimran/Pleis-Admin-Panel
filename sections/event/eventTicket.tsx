import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBoolean } from '@/hooks/useBoolean';
import { useGeteventTicketsAnalyticsByIdQuery } from '@/store/Reducer/events';
import { useUpdateTicketingMutation } from '@/store/Reducer/ticketing-api';
import { Clock, Loader2, Plus, Tag, Zap } from 'lucide-react';
import { useState } from 'react';
import TicketSalesChart from './components/ticket-sales-chart';
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

  // const scannedProgress = data?.scannedTicketProgress || {
  //   totalSold: 0,
  //   scanned: { count: 0, percentage: 0 },
  //   notScanned: { count: 0, percentage: 0 },
  // };

  // const ticketPerformanceWeekly = data?.ticketPerformanceWeekly || [];
  const ticketingStatsTickets = data?.ticketingStats?.tickets || [];

  // TODO: wire up when API provides real data
  // const publishDate = event?.publishedAt
  //   ? new Date(event.publishedAt)
  //   : event?.schedule?.startDateTime
  //     ? new Date(event.schedule.startDateTime)
  //     : null;
  // const eventEndDate = event?.schedule?.endDateTime ? new Date(event.schedule.endDateTime) : null;
  // const today = new Date();
  // const chartEndDate = eventEndDate && eventEndDate < today ? eventEndDate : today;
  // const filteredTicketPerformance = ticketPerformanceWeekly.filter((item: any) => {
  //   const itemDate = new Date(item.day);
  //   if (isNaN(itemDate.getTime())) return true;
  //   if (publishDate && itemDate < publishDate) return false;
  //   if (itemDate > chartEndDate) return false;
  //   return true;
  // });

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
                      const sold = ticket.sold || 0;
                      const soldPercentage = totalTickets > 0 ? (sold / totalTickets) * 100 : 0;

                      const matchedStats = ticketingStatsTickets.find((t: any) => t.ticketId === ticket.ticketId);
                      const scanned = matchedStats?.used?.count ?? 0;
                      const scannedPercentage = totalTickets > 0 ? (scanned / totalTickets) * 100 : 0;

                      return (
                        <div key={ticket.ticketId || index}>
                          <h2 className="mb-3 text-base font-bold">{ticket.title}</h2>

                          {/* Purchased bar */}
                          <div className="mb-3">
                            <div className="mb-1 flex items-center justify-between">
                              <h1 className="text-sm font-semibold">Purchased</h1>
                              <h1 className="text-sm">
                                {sold} / {totalTickets}
                              </h1>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                              <div className="bg-primary h-full transition-all duration-500" style={{ width: `${soldPercentage}%` }} />
                            </div>
                          </div>

                          {/* Scanned bar */}
                          <div>
                            <div className="mb-1 flex items-center justify-between">
                              <h1 className="text-sm font-semibold">Scanned</h1>
                              <h1 className="text-sm">
                                {scanned} / {totalTickets}
                              </h1>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full rounded-full bg-green-500 transition-all duration-500"
                                style={{ width: `${scannedPercentage}%` }}
                              />
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
              {/* <Card className="mt-4 dark:bg-[#171717]">
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
              </Card> */}

              <Button onClick={openModal.onTrue} className="bg-primary hover:bg-primary mt-4 h-10 w-full cursor-pointer rounded-3xl text-white">
                <Plus /> Add Tickets Type
              </Button>
            </div>

            <div className="col-span-12 lg:col-span-6">
              {/* revenue chart of paid and free tickets */}
              <Card className="dark:bg-[#171717]">
                <CardHeader>
                  <CardTitle>Ticket Sales Over Time</CardTitle>
                </CardHeader>
                <TicketSalesChart />
              </Card>

              {/* sale by ticket type */}
              <Card className="mt-4 shadow-lg dark:bg-[#171717]">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Sales by Ticket Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {ticketingStatsTickets.length === 0 && (
                    <p className="text-muted-foreground py-4 text-sm">No ticket types available</p>
                  )}

                  {ticketingStatsTickets.map((ticket: any, idx: number) => {
                    const isOnSale = ticket.saleStatus === 'onSale';
                    const isActive = ticket.status === 'active';
                    const sold = ticket.sold ?? ticket.used?.count ?? 0;
                    const totalCreated = ticket.totalCreated ?? 0;
                    const earlyBird = ticket.earlyBird?.count ?? 0;
                    const lastMinute = ticket.lastMinute?.count ?? 0;
                    const fastTrack = ticket.fastTrack?.count ?? 0;
                    const totalRevenue = ticket.totalRevenue ?? ticket.revenue ?? ticket.used?.amount ?? 0;

                    return (
                      <div key={ticket.ticketId}>
                        {/* Header row */}
                        <div className="flex items-start justify-between gap-2 py-2">
                          <div className="flex-1">
                            <p className="mb-1 font-medium">{ticket.title}</p>
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                  isOnSale ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                }`}
                              >
                                {isOnSale ? 'On Sale' : 'Sold Out'}
                              </span>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                                  isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                }`}
                              >
                                {ticket.status}
                              </span>
                            </div>
                          </div>

                          {/* Toggle */}
                          <div className="mt-1 shrink-0">
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
                                <div className="peer-focus:ring-primary peer peer-checked:bg-primary h-6 w-10 rounded-full bg-gray-200 transition-colors duration-200 peer-focus:ring-2 peer-focus:outline-none" />
                                <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-4" />
                              </label>
                            )}
                          </div>
                        </div>

                        {/* Sold count */}
                        <p className="text-muted-foreground mb-3 text-xs">
                          Tickets Sold: <span className="font-semibold text-foreground">{sold}</span> / {totalCreated}
                        </p>

                        {/* Modifier breakdown */}
                        <div className="mb-3 grid grid-cols-3 gap-2">
                          <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                            <div className="mb-1 flex items-center gap-1 text-amber-600 dark:text-amber-400">
                              <Tag className="h-3 w-3" />
                              <span className="text-xs font-medium">Early Bird</span>
                            </div>
                            <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{earlyBird}</p>
                            <p className="text-muted-foreground text-xs">tickets</p>
                          </div>

                          <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                            <div className="mb-1 flex items-center gap-1 text-purple-600 dark:text-purple-400">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs font-medium">Last Minute</span>
                            </div>
                            <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{lastMinute}</p>
                            <p className="text-muted-foreground text-xs">tickets</p>
                          </div>

                          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                            <div className="mb-1 flex items-center gap-1 text-blue-600 dark:text-blue-400">
                              <Zap className="h-3 w-3" />
                              <span className="text-xs font-medium">Fast Track</span>
                            </div>
                            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{fastTrack}</p>
                            <p className="text-muted-foreground text-xs">tickets</p>
                          </div>
                        </div>

                        {/* Total revenue */}
                        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5 dark:bg-white/5">
                          <span className="text-muted-foreground text-xs font-medium">Total Revenue</span>
                          <span className="text-sm font-bold">${Number(totalRevenue).toFixed(2)}</span>
                        </div>

                        {idx < ticketingStatsTickets.length - 1 && <hr className="mt-4" />}
                      </div>
                    );
                  })}
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
