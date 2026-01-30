import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useCopyBookingOnMultipleDatesMutation } from '@/store/Reducer/reservation-calendar-api';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';
import { Calendar, Copy, Timer, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  calculateAvgPartySize,
  calculateTotalCovers,
  extractReservationTypes,
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
  const [startTime, setStartTime] = useState<string>('10:00 AM');
  const [endTime, setEndTime] = useState<string>('12:00 PM');

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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate time slots for 24 hours with 15-minute intervals
  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const timeSlotOptions = timeSlots;

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

  // Handle paste slot (Note: This is for UI demo - actual API call would be needed for real paste)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePasteSlot = (_type: string, _timeIdx: number): void => {
    if (!copiedSlot || !pasteMode) return;
    // For now, just show success message - implement API call later
    showSuccess('Slot paste feature - API integration pending');
    setPasteMode(false);
    setCopiedSlot(null);
  };

  // Handle cell click for pasting
  const handleCellClick = (type: string, timeIdx: number): void => {
    if (pasteMode && copiedSlot) {
      handlePasteSlot(type, timeIdx);
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

  // Handle time update (Note: This would need API call for real update)
  const handleTimeUpdate = (): void => {
    if (!selectedBooking) return;
    // For now, just show success message - implement API call later
    showSuccess('Time update feature - API integration pending');
    setTimeModalOpen(false);
    setSelectedBooking(null);
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

  // Cancel paste mode
  const handleCancelPaste = (): void => {
    setPasteMode(false);
    setCopiedSlot(null);
    showSuccess('Paste mode cancelled.');
  };

  if (!mounted) {
    return null;
  }

  // Show loading state with skeleton
  if (isLoading) {
    return (
      <div>
        {/* Header Card Skeleton */}
        <Card className="mb-4 border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded bg-gray-300 dark:bg-zinc-700" />
                <Skeleton className="h-9 w-40 rounded bg-gray-300 dark:bg-zinc-700" />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Calendar Grid Skeleton */}
        <div className="max-w-full">
          <div className="max-h-150 overflow-auto rounded-lg border border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 z-20 bg-gray-200 dark:bg-zinc-800">
                <tr>
                  <th className="sticky left-0 z-20 min-w-20 border border-gray-300 bg-gray-200 p-2 text-left dark:border-zinc-700 dark:bg-zinc-800">
                    <Skeleton className="h-4 w-12 bg-gray-300 dark:bg-zinc-600" />
                  </th>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <th key={i} className="min-w-22.5 border border-gray-300 p-2 dark:border-zinc-700">
                      <Skeleton className="h-4 w-16 bg-gray-300 dark:bg-zinc-600" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, rowIdx) => (
                  <tr key={rowIdx}>
                    <td className="sticky left-0 z-10 h-14 border border-gray-300 bg-gray-200 p-2 dark:border-zinc-700 dark:bg-zinc-800">
                      <Skeleton className="h-4 w-16 bg-gray-300 dark:bg-zinc-600" />
                    </td>
                    {Array.from({ length: 12 }).map((_, colIdx) => (
                      <td key={colIdx} className="border border-gray-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950">
                        {/* Randomly show some skeleton booking cards */}
                        {(rowIdx + colIdx) % 4 === 0 && (
                          <div className="relative h-full overflow-hidden rounded border border-gray-200 bg-gray-50 p-2 dark:border-zinc-600 dark:bg-zinc-800/80">
                            <Skeleton className="absolute top-0 right-0 h-5 w-16 rounded-none rounded-tr-xs rounded-bl-md bg-gray-300 dark:bg-zinc-600" />
                            <div className="mt-4 space-y-2">
                              <Skeleton className="h-3 w-14 bg-gray-300 dark:bg-zinc-600" />
                              <Skeleton className="h-3 w-20 bg-gray-300 dark:bg-zinc-600" />
                            </div>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Card Skeleton */}
        <Card className="mt-4 border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="mb-2 h-3 w-20 bg-gray-300 dark:bg-zinc-700" />
                  <Skeleton className="h-8 w-12 bg-gray-300 dark:bg-zinc-600" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
                  <Badge className="bg-blue-600 text-white">Paste Mode Active - Click any cell to paste</Badge>
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

      <Card className="mt-4 border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900">
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-500 dark:text-zinc-500">Total Covers</div>
              <div className="text-2xl font-bold">{totalCovers}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-zinc-500">Avg Party Size</div>
              <div className="text-2xl font-bold">{avgPartySize}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-zinc-500">Total Bookings</div>
              <div className="text-2xl font-bold">{reservations.length}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-zinc-500">Reservation Types</div>
              <div className="text-2xl font-bold">{reservationTypes.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Update Modal */}
      <Dialog open={timeModalOpen} onOpenChange={setTimeModalOpen}>
        <DialogContent className="border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle>Update Booking Time</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2 pb-4">
            <div className="flex items-center justify-start gap-x-2">
              <label className="text-md font-medium">Time Slot:</label>
              <div className="text-md font-medium">
                {selectedBooking?.startTime} - {selectedBooking?.endTime}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="w-full space-y-2">
                <label className="text-sm font-medium">Start Time</label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger className="w-full border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                    {timeSlotOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Time</label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger className="w-full border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                    {timeSlotOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTimeModalOpen(false)} className="border-gray-300 dark:border-zinc-700">
              Cancel
            </Button>
            <Button onClick={handleTimeUpdate} className="bg-green-600 text-white hover:bg-green-700">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Multi-Date Picker Modal */}
      <Dialog open={datePickerOpen} onOpenChange={setDatePickerOpen}>
        <DialogContent aria-describedby={undefined} className="gap-1 border-gray-300 bg-white sm:max-w-sm dark:border-zinc-700 dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Copy to Multiple Dates
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <CalendarPicker
              mode="multiple"
              selected={selectedDates}
              onSelect={handleDateSelect}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const checkDate = new Date(date);
                checkDate.setHours(0, 0, 0, 0);
                const selected = new Date(selectedDate);
                selected.setHours(0, 0, 0, 0);
                // Disable past dates, today, and the currently selected calendar date
                return checkDate <= today || checkDate.getTime() === selected.getTime();
              }}
              className="w-full rounded-md border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />

            {selectedDates && selectedDates.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Selected Dates ({selectedDates.length}):</p>
                <div className="flex flex-wrap justify-start gap-1.5">
                  {selectedDates.map((date, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-blac~k text-xs text-white dark:bg-white dark:text-black">
                      {date instanceof Date ? format(date, 'dd-MM-yy') : String(date)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDatePickerOpen(false);
                setSelectedDates([]);
              }}
              className="border-gray-300 dark:border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleMultiDateConfirm}
              disabled={selectedDates.length === 0 || isCopying}
              className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isCopying ? 'Copying...' : `Confirm (${selectedDates.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
