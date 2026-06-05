import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowRightLeft, Clock, Loader2, Tag, Timer, Zap } from 'lucide-react';
import { useState } from 'react';

type TimeSlotRow = {
  date: string;
  startTime: string;
  endTime: string;
  quantity: number;
  sold: number;
  scanned: number;
  remaining: number;
};

type SalesByTicketTypeProps = {
  tickets: any[];
  updatingTicketId: string | null;
  onStatusToggle: (ticketId: string, currentStatus: string) => void;
  slotBasedSales?: { eventId: string; tickets: any[] };
};

const formatPrice = (amount: number) => `€${Number(amount || 0).toFixed(2)}`;

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildTimeSlotRows = (slotTicket: any): TimeSlotRow[] => {
  const rawSlots = slotTicket?.slots || [];
  if (!Array.isArray(rawSlots)) return [];

  return rawSlots.flatMap((daySlot: any) => {
    const timeSlots = Array.isArray(daySlot?.timeSlots) ? daySlot.timeSlots : [];

    return timeSlots.map((slot: any) => {
      const quantity = toNumber(slot?.quantity);
      const sold = toNumber(slot?.sold, 0);
      const scanned = toNumber(slot?.scanned, 0);
      const remaining = toNumber(slot?.remaining, Math.max(quantity - sold, 0));

      return {
        date: slot?.date || daySlot?.date || 'N/A',
        startTime: slot?.startTime || '--:--',
        endTime: slot?.endTime || '--:--',
        quantity,
        sold,
        scanned,
        remaining,
      };
    });
  });
};

const SalesByTicketType = ({ tickets, updatingTicketId, onStatusToggle, slotBasedSales }: SalesByTicketTypeProps) => {
  const [selectedTimeSlotTicket, setSelectedTimeSlotTicket] = useState<{ title: string; rows: TimeSlotRow[] } | null>(null);

  return (
    <>
      <Card className="mt-4 gap-1 shadow-lg dark:bg-[#171717]">
        <CardHeader>
          <CardTitle className="text-md font-semibold">Sales by Ticket Type</CardTitle>
        </CardHeader>
        <CardContent className="max-h-100 space-y-4 overflow-y-auto pt-0">
          {tickets.length === 0 && <p className="text-muted-foreground py-4 text-sm">No ticket types available</p>}

          {tickets.map((ticket: any, idx: number) => {
            const isOnSale = ticket.saleStatus === 'onSale';
            const isActive = ticket.status === 'active';
            const sold = toNumber(ticket.sold ?? ticket.total?.count, 0);
            const totalCreated = toNumber(ticket.totalCreated, 0);
            const earlyBird = toNumber(ticket.earlyBird?.count, 0);
            const lastMinute = toNumber(ticket.lastMinute?.count, 0);
            const fastTrack = toNumber(ticket.fastTrack?.count, 0);
            const transfer = toNumber(ticket.transfer?.count, 0);
            const totalRevenue = toNumber(ticket.revenue ?? ticket.total?.amount, 0);
            const regularPrice = sold > 0 ? totalRevenue / sold : 0;

            const slotTicket = slotBasedSales?.tickets?.find((t: any) => t.ticketId === ticket.ticketId);
            const modalRows = buildTimeSlotRows(slotTicket);

            return (
              <div key={ticket.ticketId || idx}>
                <div className="flex items-start justify-between gap-2 pb-2">
                  <div className="flex-1">
                    <p className="mb-1 font-medium">{ticket.title}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          isOnSale
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {isOnSale ? 'On Sale' : 'Sold Out'}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                          isActive
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {ticket.status}
                      </span>

                      {/* {hasTimeSlots && ( */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 rounded-full px-2 text-xs"
                        onClick={() => setSelectedTimeSlotTicket({ title: ticket.title || 'Ticket', rows: modalRows })}
                      >
                        <Timer className="mr-1 h-3.5 w-3.5" />
                        See by timeslot
                      </Button>
                      {/* )} */}

                    </div>
                  </div>

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
                          onChange={() => onStatusToggle(ticket.ticketId, ticket.status)}
                          className="peer sr-only"
                        />
                        <div className="peer-focus:ring-primary peer peer-checked:bg-primary h-6 w-10 rounded-full bg-gray-200 transition-colors duration-200 peer-focus:ring-2 peer-focus:outline-none" />
                        <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-4" />
                      </label>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground mb-1 text-xs">
                  Tickets Sold: <span className="text-foreground font-semibold">{sold}</span> / {totalCreated}
                </p>
                <p className="text-muted-foreground mb-3 text-xs">
                  Regular ticket: <span className="text-foreground font-semibold">{formatPrice(regularPrice)}</span>
                </p>

                <div className="mb-3 grid grid-cols-2 gap-2 xl:grid-cols-4">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/30 dark:bg-amber-900/20">
                    <div className="mb-1 flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <Tag className="h-3 w-3" />
                      <span className="text-xs font-medium">Early Bird</span>
                    </div>
                    <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{earlyBird}</p>
                    <p className="text-muted-foreground text-xs">tickets</p>
                    {ticket.earlyBird?.amount > 0 && (
                      <p className="text-sm font-bold text-amber-700 dark:text-amber-300">{formatPrice(ticket.earlyBird.amount)}</p>
                    )}
                  </div>

                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800/30 dark:bg-purple-900/20">
                    <div className="mb-1 flex items-center gap-1 text-purple-600 dark:text-purple-400">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs font-medium">Last Minute</span>
                    </div>
                    <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{lastMinute}</p>
                    <p className="text-muted-foreground text-xs">tickets</p>
                    {ticket.lastMinute?.amount > 0 && (
                      <p className="text-sm font-bold text-purple-700 dark:text-purple-300">{formatPrice(ticket.lastMinute.amount)}</p>
                    )}
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800/30 dark:bg-blue-900/20">
                    <div className="mb-1 flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <Zap className="h-3 w-3" />
                      <span className="text-xs font-medium">Fast Track</span>
                    </div>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{fastTrack}</p>
                    <p className="text-muted-foreground text-xs">tickets</p>
                    {ticket.fastTrack?.amount > 0 && (
                      <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{formatPrice(ticket.fastTrack.amount)}</p>
                    )}
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800/60 dark:bg-gray-900/20">
                    <div className="mb-1 flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <ArrowRightLeft className="h-3 w-3" />
                      <span className="text-xs font-medium">Transfer</span>
                    </div>
                    <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{transfer}</p>
                    <p className="text-muted-foreground text-xs">tickets</p>
                    {ticket.transfer?.amount > 0 && (
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{formatPrice(ticket.transfer.amount)}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5 dark:bg-white/5">
                  <span className="text-muted-foreground text-xs font-medium">Total Revenue</span>
                  <span className="text-sm font-bold">{formatPrice(totalRevenue)}</span>
                </div>

                {idx < tickets.length - 1 && <hr className="mt-4" />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Dialog open={!!selectedTimeSlotTicket} onOpenChange={(open) => !open && setSelectedTimeSlotTicket(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">{selectedTimeSlotTicket?.title} - Timeslot Sales</DialogTitle>
          </DialogHeader>

          {selectedTimeSlotTicket?.rows?.length ? (
            <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
              <div className="grid grid-cols-6 gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold dark:border-white/10 dark:bg-white/5">
                <p>Date</p>
                <p>Slot</p>
                <p className="text-right">Qty</p>
                <p className="text-right">Sold</p>
                <p className="text-right">Scanned</p>
                <p className="text-right">Remaining</p>
              </div>

              <div className="divide-y divide-gray-200 text-sm dark:divide-white/10">
                {selectedTimeSlotTicket.rows.map((slot, index) => (
                  <div key={`${slot.date}-${slot.startTime}-${index}`} className="grid grid-cols-6 gap-2 px-3 py-2">
                    <p className="truncate">{slot.date}</p>
                    <p className="truncate">
                      {slot.startTime} - {slot.endTime}
                    </p>
                    <p className="text-right">{slot.quantity}</p>
                    <p className="text-right font-medium">{slot.sold}</p>
                    <p className="text-right">{slot.scanned}</p>
                    <p className="text-right">{slot.remaining}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No time slot data available for this ticket.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SalesByTicketType;
