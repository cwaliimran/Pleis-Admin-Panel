import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  useCopyBookingOnMultipleDatesMutation,
  useCopyReservationSlotsMutation,
  useUpdateReservationsTimingMutation,
} from '@/store/Reducer/reservation-calendar-api';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';
import { Calendar, Copy, Timer, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CalendarGridSkeleton from './components/CalendarGridSkeleton';
import MultiDatePickerModal from './components/MultiDatePickerModal';
import ReservationStats from './components/ReservationStats';
import TimeUpdateModal from './components/TimeUpdateModal';
import {
  calculateAvgPartySize,
  calculateTotalCovers,
  convert24To12,
  extractReservationTypes,
  formatTimeWithLeadingZero,
  generateTimeSlots,
  getRequestAtSlot,
  getRequestSpan,
  isRequestStart,
  processReservationsToBookings,
} from './helpers';
import { ProcessedBooking, ReservationGridProps } from './types';

export default function ReservationGrid({ setClick, reservations, isLoading, selectedDate, onDateChange, onSlotClick }: ReservationGridProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  // Time update modal state
  const [timeModalOpen, setTimeModalOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<ProcessedBooking | null>(null);
  const [startTime, setStartTime] = useState<string>('10:00');
  const [endTime, setEndTime] = useState<string>('12:00');

  // Multi-date picker state
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  // Copy-paste state
  const [copiedSlot, setCopiedSlot] = useState<ProcessedBooking | null>(null);
  const [pasteMode, setPasteMode] = useState<boolean>(false);

  // Selection mode state
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());

  // Copy booking mutation
  const [copyBookings, { isLoading: isCopying }] = useCopyBookingOnMultipleDatesMutation();

  // Copy reservation slots (update timing) mutation
  const [updateReservationsTiming, { isLoading: isUpdatingTime }] = useUpdateReservationsTimingMutation();

  // Copy reservation slots to another cell mutation
  const [copyReservationSlots, { isLoading: isPasting }] = useCopyReservationSlotsMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate time slots for 24 hours with 15-minute intervals
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Extract unique reservation types from API data
  const reservationTypes = useMemo(() => extractReservationTypes(reservations), [reservations]);

  // Process reservations into grouped bookings for the grid
  const processedBookings = useMemo(() => processReservationsToBookings(reservations), [reservations]);

  // Calculate stats from real data
  const totalCovers = useMemo(() => calculateTotalCovers(reservations), [reservations]);
  const avgPartySize = useMemo(() => calculateAvgPartySize(reservations), [reservations]);

  // Check if all bookings are selected
  const allSelected = processedBookings.length > 0 && selectedBookings.size === processedBookings.length;

  // Handle copy slot
  const handleCopySlot = (e: React.MouseEvent, request: ProcessedBooking): void => {
    e.stopPropagation();
    setCopiedSlot(request);
    setPasteMode(true);
    showSuccess('Slot copied! Click on any cell to paste.');
  };

  // Handle paste slot with API call
  const handlePasteSlot = async (type: string, timeIdx: number): Promise<void> => {
    if (!copiedSlot || !pasteMode) return;

    // Get reservation IDs from the copied slot
    const reservationIds = copiedSlot.bookings.map((reservation) => reservation._id).filter(Boolean);
    if (reservationIds.length === 0) {
      showError('No valid reservations to paste.');
      return;
    }

    // Get the target time slot from the timeIdx
    const targetStartTime = timeSlots[timeIdx];
    if (!targetStartTime) {
      showError('Invalid time slot selected.');
      return;
    }

    // Keep UI in 24h, but convert to backend 12h format for API
    const formattedStartTime = formatTimeWithLeadingZero(targetStartTime);
    const apiStartTime = convert24To12(formattedStartTime);

    // Format the target date
    const targetDate = format(selectedDate, 'yyyy-MM-dd');

    try {
      await copyReservationSlots({
        data: {
          reservationIds,
          targetDate,
          startTime: apiStartTime,
          reservationType: type,
        },
      }).unwrap();

      showSuccess(`Reservation(s) copied to ${type} at ${formattedStartTime}!`);
      setPasteMode(false);
      setCopiedSlot(null);
    } catch (error: any) {
      showError(error?.data?.message || 'Failed to paste reservation.');
    }
  };

  // Handle cell click for pasting
  const handleCellClick = async (type: string, timeIdx: number): Promise<void> => {
    if (pasteMode && copiedSlot) {
      await handlePasteSlot(type, timeIdx);
    }
  };

  // Handle timer icon click
  const handleTimerClick = (e: React.MouseEvent, request: ProcessedBooking): void => {
    e.stopPropagation();
    setSelectedBooking(request);
    setStartTime(request.startTime);
    setEndTime(request.endTime);
    setTimeModalOpen(true);
  };

  // Handle calendar icon click - Now enables selection mode
  const handleCalendarClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setSelectionMode(true);
    setSelectedBookings(new Set());
  };

  // Handle checkbox selection
  const handleCheckboxChange = (slotKey: string, checked: boolean): void => {
    const newSelectedBookings = new Set(selectedBookings);
    if (checked) {
      newSelectedBookings.add(slotKey);
    } else {
      newSelectedBookings.delete(slotKey);
    }
    setSelectedBookings(newSelectedBookings);
  };

  // Handle select all
  const handleSelectAll = (): void => {
    const allSlotKeys = new Set(processedBookings.map((req) => req.slotKey));
    setSelectedBookings(allSlotKeys);
  };

  // Handle deselect all
  const handleDeselectAll = (): void => {
    setSelectedBookings(new Set());
  };

  // Handle copy to dates
  const handleCopyToDates = (): void => {
    if (selectedBookings.size === 0) {
      showSuccess('Please select at least one booking to copy.');
      return;
    }
    setDatePickerOpen(true);
  };

  // Cancel selection mode
  const handleCancelSelection = (): void => {
    setSelectionMode(false);
    setSelectedBookings(new Set());
  };

  // Collect reservation IDs from a specific booking slot
  const getReservationIdsFromBooking = (booking: ProcessedBooking): string[] => {
    return booking.bookings.map((reservation) => reservation._id).filter(Boolean);
  };

  // Handle time update with API call
  const handleTimeUpdate = async (): Promise<void> => {
    if (!selectedBooking) return;

    const reservationIds = getReservationIdsFromBooking(selectedBooking);
    if (reservationIds.length === 0) {
      showError('No valid reservations found.');
      return;
    }

    try {
      await updateReservationsTiming({
        updatedData: {
          reservationIds,
          startTime: convert24To12(startTime),
          endTime: convert24To12(endTime),
        },
      }).unwrap();

      showSuccess('Reservation timing updated successfully!');
      setTimeModalOpen(false);
      setSelectedBooking(null);
    } catch (error: any) {
      showError(error?.data?.message || 'Failed to update reservation timing.');
    }
  };

  // Handle date selection for multi-date picker
  const handleDateSelect = (dates: Date[] | undefined): void => {
    if (dates) {
      setSelectedDates(dates);
    }
  };

  // Collect all reservation IDs from selected bookings
  const getSelectedReservationIds = (): string[] => {
    const reservationIds: string[] = [];
    selectedBookings.forEach((slotKey) => {
      const booking = processedBookings.find((b) => b.slotKey === slotKey);
      if (booking) {
        booking.bookings.forEach((reservation) => {
          if (reservation._id && !reservationIds.includes(reservation._id)) {
            reservationIds.push(reservation._id);
          }
        });
      }
    });
    return reservationIds;
  };

  // Handle multi-date confirmation with API call
  const handleMultiDateConfirm = async (): Promise<void> => {
    if (selectedDates.length === 0) {
      showError('Please select at least one date.');
      return;
    }

    if (selectedBookings.size === 0) {
      showError('No bookings selected.');
      return;
    }

    const reservationIds = getSelectedReservationIds();
    if (reservationIds.length === 0) {
      showError('No valid reservations found.');
      return;
    }

    // Format dates as YYYY-MM-DD strings
    const formattedDates = selectedDates.map((date) => format(date, 'yyyy-MM-dd'));

    try {
      await copyBookings({
        reservations: reservationIds,
        dates: formattedDates,
      }).unwrap();

      showSuccess(`${reservationIds.length} reservation(s) copied to ${selectedDates.length} date(s)!`);
      setDatePickerOpen(false);
      setSelectedDates([]);
      setSelectionMode(false);
      setSelectedBookings(new Set());
    } catch (error: any) {
      showError(error?.data?.message || 'Failed to copy reservations.');
    }
  };

  const handleCancelPaste = (): void => {
    setPasteMode(false);
    setCopiedSlot(null);
    showSuccess('Paste mode cancelled.');
  };

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return <CalendarGridSkeleton />;
  }

  return (
    <div>
      <Card className="mb-4 border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-gray-300 bg-gray-200 text-black hover:bg-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                  >
                    {format(selectedDate, 'dd MMMM yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto border-gray-300 bg-white p-0 dark:border-zinc-700 dark:bg-zinc-800">
                  <CalendarPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && onDateChange(date)}
                    initialFocus
                    className="text-black dark:text-white"
                  />
                </PopoverContent>
              </Popover>
            </CardTitle>

            <div className="flex items-center gap-2">
              {pasteMode && (
                <>
                  <Badge className="bg-blue-600 text-white">{isPasting ? 'Pasting...' : 'Paste Mode Active - Click any cell to paste'}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelPaste}
                    className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    Cancel
                  </Button>
                </>
              )}

              {selectionMode && (
                <>
                  <Badge className="bg-purple-600 py-1.25 text-white">{selectedBookings.size} booking(s) selected</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={allSelected ? handleDeselectAll : handleSelectAll}
                    className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    {allSelected ? 'Deselect All' : 'Select All'}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleCopyToDates}
                    disabled={selectedBookings.size === 0}
                    className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Copy to Dates
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelSelection}
                    className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="max-w-full">
        <div className="max-h-150 overflow-auto rounded-lg border border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-20 bg-gray-200 dark:bg-zinc-800">
              <tr>
                <th className="sticky left-0 z-20 min-w-20 border border-gray-300 bg-gray-200 p-2 text-left dark:border-zinc-700 dark:bg-zinc-800">
                  Type
                </th>
                {timeSlots?.map((time, i) => (
                  <th key={i} className="min-w-22.5 border border-gray-300 p-2 font-medium dark:border-zinc-700">
                    {time}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {reservationTypes?.length === 0 ? (
                <tr>
                  <td colSpan={timeSlots?.length + 1} className="p-8 text-center text-gray-500 dark:text-zinc-400">
                    No reservations found for this date
                  </td>
                </tr>
              ) : (
                reservationTypes?.map((type) => (
                  <tr key={type}>
                    <td className="sticky left-0 z-10 h-14 border border-gray-300 bg-gray-200 p-2 font-medium dark:border-zinc-700 dark:bg-zinc-800">
                      {type}
                    </td>
                    {timeSlots?.map((_, timeIdx) => {
                      const request = getRequestAtSlot(processedBookings, type, timeIdx);
                      const isStart = isRequestStart(processedBookings, type, timeIdx);
                      const span = getRequestSpan(processedBookings, type, timeIdx);

                      // Skip rendering cells that are covered by colSpan from the start cell
                      if (request && !isStart) {
                        return null;
                      }

                      return (
                        <td
                          key={timeIdx}
                          colSpan={isStart ? span : 1}
                          onClick={() => handleCellClick(type, timeIdx)}
                          className={`border border-gray-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950 ${
                            pasteMode && !request ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20' : ''
                          }`}
                        >
                          {request && isStart && (
                            <div
                              onClick={() => {
                                if (!selectionMode) {
                                  setClick(true);
                                  onSlotClick?.({
                                    reservationType: request.type,
                                    startTime: request.startTime,
                                    endTime: request.endTime,
                                    slotKey: request.slotKey,
                                  });
                                }
                              }}
                              className={`relative h-full overflow-hidden rounded border border-green-500 bg-green-100/50 p-2 dark:border-green-700 dark:bg-green-900/50 ${
                                !selectionMode ? 'cursor-pointer' : ''
                              } ${selectionMode && selectedBookings.has(request.slotKey) ? '' : ''} `}
                            >
                              {/* Checkbox in selection mode */}
                              {selectionMode && (
                                <div className="absolute top-1 left-1 z-10">
                                  <Checkbox
                                    checked={selectedBookings.has(request.slotKey)}
                                    onCheckedChange={(checked) => handleCheckboxChange(request.slotKey, checked as boolean)}
                                    className="h-5 w-5 cursor-pointer rounded-full border-2 border-gray-400 bg-white data-[state=checked]:bg-purple-600 data-[state=checked]:text-white dark:border-white dark:bg-zinc-900"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              )}

                              <Badge className="absolute top-0 right-0 rounded-none rounded-tr-xs rounded-bl-md bg-black text-[12px] text-white dark:bg-white dark:text-black">
                                {request.bookingCount} {request.bookingCount > 1 ? 'Bookings' : 'Booking'}
                              </Badge>

                              <div className={`${selectionMode ? 'mt-6' : 'mt-1'} flex items-center justify-between text-[11px]`}>
                                <div className="text-xs font-semibold">
                                  {request.totalPartySize} {request.totalPartySize > 1 ? 'Guests' : 'Guest'}
                                </div>
                              </div>

                              <div className="mt-1 flex items-center justify-between text-[11px]">
                                <div className="text-[10px] text-gray-600 dark:text-zinc-300">
                                  {request.startTime} - {request.endTime}
                                </div>

                                {!selectionMode && (
                                  <div className="flex items-center justify-between gap-2">
                                    <button
                                      title="Calendar"
                                      type="button"
                                      className="cursor-pointer transition-colors hover:text-green-600"
                                      onClick={(e) => handleCalendarClick(e)}
                                    >
                                      <Calendar className="size-4" />
                                    </button>

                                    <button
                                      title="Timer"
                                      type="button"
                                      className="cursor-pointer transition-colors hover:text-green-600"
                                      onClick={(e) => handleTimerClick(e, request)}
                                    >
                                      <Timer className="size-4" />
                                    </button>

                                    <button
                                      title="Copy"
                                      type="button"
                                      className="cursor-pointer transition-colors hover:text-green-600"
                                      onClick={(e) => handleCopySlot(e, request)}
                                    >
                                      <Copy className="size-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReservationStats
        totalCovers={totalCovers}
        avgPartySize={avgPartySize}
        totalBookings={reservations.length}
        reservationTypesCount={reservationTypes.length}
      />

      {/* Time Update Modal */}
      <TimeUpdateModal
        open={timeModalOpen}
        onOpenChange={setTimeModalOpen}
        selectedBooking={selectedBooking}
        startTime={startTime}
        endTime={endTime}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
        onUpdate={handleTimeUpdate}
        isUpdating={isUpdatingTime}
      />

      {/* Multi-Date Picker Modal */}
      <MultiDatePickerModal
        open={datePickerOpen}
        onOpenChange={setDatePickerOpen}
        selectedDates={selectedDates}
        onDateSelect={handleDateSelect}
        selectedCalendarDate={selectedDate}
        onConfirm={handleMultiDateConfirm}
        onCancel={() => {
          setDatePickerOpen(false);
          setSelectedDates([]);
        }}
        isCopying={isCopying}
      />
    </div>
  );
}
