import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBoolean } from '@/hooks/useBoolean';
import { useGeteventTicketsAnalyticsByIdQuery } from '@/store/Reducer/events';
import { useUpdateTicketingMutation } from '@/store/Reducer/ticketing-api';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import TicketingModal from '../ticketing-view/ticketing-modal';
import EventLoading from './components/event-loading';
import SalesByTicketType from './components/sales-by-ticket-type';
import TicketSalesChart from './components/ticket-sales-chart';

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
              <SalesByTicketType
                tickets={ticketingStatsTickets}
                event={event}
                updatingTicketId={updatingTicketId}
                onStatusToggle={handleStatusToggle}
              />
            </div>
          </div>

          <TicketingModal open={openModal.value} onClose={openModal.onFalse} event={event} />
        </div>
      )}
    </>
  );
};

export default EventTicket;
