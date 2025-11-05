import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess } from '@/utils/toast';
import { format } from 'date-fns';
import { Calendar, Copy, Timer, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BookingRequest {
  type: string;
  startTime: string;
  endTime: string;
  bookingId: string;
  pendingCount: number;
  bookedCount: number;
  table: string;
  size: number;
}

interface ReservationGridProps {
  setClick: (value: boolean) => void;
}

export default function ReservationGrid({ setClick }: ReservationGridProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 0, 15));

  // Time update modal state
  const [timeModalOpen, setTimeModalOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [startTime, setStartTime] = useState<string>('10:00 AM');
  const [endTime, setEndTime] = useState<string>('12:00 PM');

  // Multi-date picker state
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  // Copy-paste state
  const [copiedSlot, setCopiedSlot] = useState<BookingRequest | null>(null);
  const [pasteMode, setPasteMode] = useState<boolean>(false);

  // Selection mode state
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());

  // All requests state
  const [allRequests, setAllRequests] = useState<BookingRequest[]>([]);

  useEffect(() => {
    setMounted(true);
    setAllRequests(generateDummyRequests());
  }, []);

  // Generate time slots for dropdowns
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let i = 0; i < (21 - 9) * 4 + 1; i++) {
      const totalMinutes = 9 * 60 + i * 15;
      const hour = Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;
      const ampm = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const displayMinute = minute.toString().padStart(2, '0');
      slots.push(`${displayHour}:${displayMinute} ${ampm}`);
    }
    return slots;
  };

  const timeSlotOptions = generateTimeSlots();

  const timeSlots = Array.from({ length: (21 - 9) * 4 + 1 }, (_, i) => {
    const totalMinutes = 9 * 60 + i * 15;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${ampm}`;
  });

  const reservationTypes: string[] = ['Regular', 'VIP', 'Outdoor', 'Private', 'Bar', 'Window'];

  const getTimeIndex = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    const [hour, minute] = time.split(':').map(Number);
    let hour24 = hour;
    if (period === 'PM' && hour !== 12) hour24 += 12;
    if (period === 'AM' && hour === 12) hour24 = 0;
    const totalMinutes = hour24 * 60 + minute;
    const startMinutes = 9 * 60;
    return Math.floor((totalMinutes - startMinutes) / 15);
  };

  const addMinutesToTime = (timeStr: string, minutes: number): string => {
    const [time, period] = timeStr.split(' ');
    const [hour, minute] = time.split(':').map(Number);
    let hour24 = hour;
    if (period === 'PM' && hour !== 12) hour24 += 12;
    if (period === 'AM' && hour === 12) hour24 = 0;
    const totalMinutes = hour24 * 60 + minute + minutes;
    const newHour24 = Math.floor(totalMinutes / 60) % 24;
    const newMinute = totalMinutes % 60;
    const newAmpm = newHour24 < 12 ? 'AM' : 'PM';
    const newDisplayHour = newHour24 % 12 === 0 ? 12 : newHour24 % 12;
    const newDisplayMinute = newMinute.toString().padStart(2, '0');
    return `${newDisplayHour}:${newDisplayMinute} ${newAmpm}`;
  };

  const generateDummyRequests = (): BookingRequest[] => {
    const requests: BookingRequest[] = [];

    const typeRequests: Record<
      string,
      Array<{
        startTime: string;
        durationSlots: number;
        bookingId: string;
        pendingCount: number;
        bookedCount: number;
        table: string;
        size: number;
      }>
    > = {
      Regular: [
        {
          startTime: '10:00 AM',
          durationSlots: 4,
          bookingId: 'BK002',
          pendingCount: 0,
          bookedCount: 3,
          table: 'T102',
          size: 4,
        },
      ],
      VIP: [
        {
          startTime: '11:00 AM',
          durationSlots: 5,
          bookingId: 'BK003',
          pendingCount: 1,
          bookedCount: 4,
          table: 'V1',
          size: 6,
        },
      ],
      Outdoor: [
        {
          startTime: '12:00 PM',
          durationSlots: 4,
          bookingId: 'BK004',
          pendingCount: 3,
          bookedCount: 2,
          table: 'O1',
          size: 5,
        },
      ],
      Private: [
        {
          startTime: '02:00 PM',
          durationSlots: 6,
          bookingId: 'BK005',
          pendingCount: 0,
          bookedCount: 8,
          table: 'P1',
          size: 10,
        },
      ],
      Bar: [
        {
          startTime: '05:00 PM',
          durationSlots: 2,
          bookingId: 'BK006',
          pendingCount: 1,
          bookedCount: 1,
          table: 'B1',
          size: 3,
        },
      ],
      Window: [
        {
          startTime: '06:30 PM',
          durationSlots: 3,
          bookingId: 'BK007',
          pendingCount: 4,
          bookedCount: 2,
          table: 'W1',
          size: 2,
        },
      ],
    };

    Object.entries(typeRequests).forEach(([type, reqs]) => {
      reqs.forEach((req) => {
        requests.push({
          type,
          startTime: req.startTime,
          endTime: addMinutesToTime(req.startTime, req.durationSlots * 15),
          bookingId: req.bookingId,
          pendingCount: req.pendingCount,
          bookedCount: req.bookedCount,
          table: req.table,
          size: req.size,
        });
      });
    });

    return requests;
  };

  const getRequestAtSlot = (type: string, timeIdx: number): BookingRequest | undefined => {
    return allRequests.find((request: BookingRequest) => {
      if (request.type !== type) return false;
      const startIdx = getTimeIndex(request.startTime);
      const endIdx = getTimeIndex(request.endTime);
      return timeIdx >= startIdx && timeIdx < endIdx;
    });
  };

  const isRequestStart = (type: string, timeIdx: number): boolean => {
    const request = getRequestAtSlot(type, timeIdx);
    if (!request) return false;
    return getTimeIndex(request.startTime) === timeIdx;
  };

  const getRequestSpan = (type: string, timeIdx: number): number => {
    const request = getRequestAtSlot(type, timeIdx);
    if (!request) return 0;
    const startIdx = getTimeIndex(request.startTime);
    const endIdx = getTimeIndex(request.endTime);
    return endIdx - startIdx;
  };

  // Handle copy slot
  const handleCopySlot = (e: React.MouseEvent, request: BookingRequest): void => {
    e.stopPropagation();
    setCopiedSlot(request);
    setPasteMode(true);
    showSuccess('Slot copied! Click on any cell to paste.');
  };

  // Handle paste slot
  const handlePasteSlot = (type: string, timeIdx: number): void => {
    if (!copiedSlot || !pasteMode) return;

    const clickedTime = timeSlots[timeIdx];
    const startIdx = getTimeIndex(copiedSlot.startTime);
    const endIdx = getTimeIndex(copiedSlot.endTime);
    const duration = endIdx - startIdx;

    // Calculate new start and end time
    const newStartTime = clickedTime;
    const newEndTime = addMinutesToTime(newStartTime, duration * 15);

    // Check if there's any existing slot in the target range
    const conflictingSlots = allRequests.filter((req: BookingRequest) => {
      if (req.type !== type) return false;
      const reqStartIdx = getTimeIndex(req.startTime);
      const reqEndIdx = getTimeIndex(req.endTime);

      // Check if there's any overlap
      return (
        (timeIdx >= reqStartIdx && timeIdx < reqEndIdx) ||
        (timeIdx + duration > reqStartIdx && timeIdx + duration <= reqEndIdx) ||
        (timeIdx <= reqStartIdx && timeIdx + duration >= reqEndIdx)
      );
    });

    // Shift conflicting slots forward
    const updatedRequests = allRequests.map((req: BookingRequest) => {
      const isConflicting = conflictingSlots.find((cs: BookingRequest) => cs.bookingId === req.bookingId);

      if (isConflicting && req.type === type) {
        const reqStartIdx = getTimeIndex(req.startTime);
        const reqEndIdx = getTimeIndex(req.endTime);
        const reqDuration = reqEndIdx - reqStartIdx;

        // Calculate how much to shift
        const shiftAmount = timeIdx + duration - reqStartIdx;

        if (shiftAmount > 0) {
          // Shift the slot forward
          const newReqStartTime = addMinutesToTime(req.startTime, shiftAmount * 15);
          const newReqEndTime = addMinutesToTime(newReqStartTime, reqDuration * 15);

          return {
            ...req,
            startTime: newReqStartTime,
            endTime: newReqEndTime,
          };
        }
      }

      return req;
    });

    // Add the new pasted slot
    const newSlot: BookingRequest = {
      ...copiedSlot,
      type: type,
      startTime: newStartTime,
      endTime: newEndTime,
      bookingId: `BK${String(Date.now()).slice(-3)}`,
    };

    setAllRequests([...updatedRequests, newSlot]);
    setPasteMode(false);
    setCopiedSlot(null);
    showSuccess('Slot pasted successfully!');
  };

  // Handle cell click for pasting
  const handleCellClick = (type: string, timeIdx: number): void => {
    if (pasteMode && copiedSlot) {
      handlePasteSlot(type, timeIdx);
    }
  };

  // Handle timer icon click
  const handleTimerClick = (e: React.MouseEvent, request: BookingRequest): void => {
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
  const handleCheckboxChange = (bookingId: string, checked: boolean): void => {
    const newSelectedBookings = new Set(selectedBookings);
    if (checked) {
      newSelectedBookings.add(bookingId);
    } else {
      newSelectedBookings.delete(bookingId);
    }
    setSelectedBookings(newSelectedBookings);
  };

  // Handle select all
  const handleSelectAll = (): void => {
    const allBookingIds = new Set(allRequests.map((req) => req.bookingId));
    setSelectedBookings(allBookingIds);
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

  // Handle time update
  const handleTimeUpdate = (): void => {
    if (!selectedBooking) return;

    const updatedRequests = allRequests.map((req: BookingRequest) => {
      if (req.bookingId === selectedBooking.bookingId) {
        return {
          ...req,
          startTime: startTime,
          endTime: endTime,
        };
      }
      return req;
    });

    setAllRequests(updatedRequests);
    setTimeModalOpen(false);
    setSelectedBooking(null);
    showSuccess('Time updated successfully!');
  };

  // Handle date selection for multi-date picker
  const handleDateSelect = (dates: Date[] | undefined): void => {
    if (dates) {
      setSelectedDates(dates);
    }
  };

  // Handle multi-date confirmation
  const handleMultiDateConfirm = (): void => {
    if (selectedDates.length === 0) {
      showSuccess('Please select at least one date.');
      return;
    }

    if (selectedBookings.size === 0) {
      showSuccess('No bookings selected.');
      return;
    }

    showSuccess(`${selectedBookings.size} booking(s) copied to ${selectedDates.length} date(s)!`);
    setDatePickerOpen(false);
    setSelectedDates([]);
    setSelectionMode(false);
    setSelectedBookings(new Set());
  };

  // Cancel paste mode
  const handleCancelPaste = (): void => {
    setPasteMode(false);
    setCopiedSlot(null);
    showSuccess('Paste mode cancelled.');
  };

  // Check if all bookings are selected
  const allSelected = allRequests.length > 0 && selectedBookings.size === allRequests.length;
  // const someSelected = selectedBookings.size > 0 && !allSelected;

  if (!mounted) {
    return null;
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
                    onSelect={(date) => date && setSelectedDate(date)}
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
                  <Badge className="bg-purple-600 py-[5px] text-white">{selectedBookings.size} booking(s) selected</Badge>
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
        <div className="max-h-[600px] overflow-auto rounded-lg border border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-20 bg-gray-200 dark:bg-zinc-800">
              <tr>
                <th className="sticky left-0 z-20 min-w-[80px] border border-gray-300 bg-gray-200 p-2 text-left dark:border-zinc-700 dark:bg-zinc-800">
                  Type
                </th>
                {timeSlots?.map((time, i) => (
                  <th key={i} className="min-w-[90px] border border-gray-300 p-2 font-medium dark:border-zinc-700">
                    {time}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {reservationTypes.map((type) => (
                <tr key={type}>
                  <td className="sticky left-0 z-10 h-14 border border-gray-300 bg-gray-200 p-2 font-medium dark:border-zinc-700 dark:bg-zinc-800">
                    {type}
                  </td>
                  {timeSlots?.map((_, timeIdx) => {
                    const request = getRequestAtSlot(type, timeIdx);
                    const isStart = isRequestStart(type, timeIdx);
                    const span = getRequestSpan(type, timeIdx);

                    if (request && !isStart) {
                      return <td key={timeIdx} className="hidden"></td>;
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
                            onClick={() => !selectionMode && setClick(true)}
                            className={`relative h-full overflow-hidden rounded border border-green-500 bg-green-100/50 p-2 dark:border-green-700 dark:bg-green-900/50 ${
                              !selectionMode ? 'cursor-pointer' : ''
                            } ${selectionMode && selectedBookings.has(request.bookingId) ? '' : ''} `}
                          >
                            {/* Checkbox in selection mode */}
                            {selectionMode && (
                              <div className="absolute top-1 left-1 z-10">
                                <Checkbox
                                  checked={selectedBookings.has(request.bookingId)}
                                  onCheckedChange={(checked) => handleCheckboxChange(request.bookingId, checked as boolean)}
                                  className="h-5 w-5 cursor-pointer rounded-full border-2 border-gray-400 bg-white data-[state=checked]:bg-purple-600 data-[state=checked]:text-white dark:border-white dark:bg-zinc-900"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            )}

                            <Badge className="absolute top-0 right-0 rounded-none rounded-tr-xs rounded-bl-md bg-black text-[12px] text-white dark:bg-white dark:text-black">
                              {request.size} {request.size > 1 ? 'Bookings' : 'Booking'}
                            </Badge>

                            <div className={`${selectionMode ? 'mt-6' : 'mt-1'} flex items-center justify-between text-[11px]`}>
                              <div className="text-xs font-semibold">{request.bookingId}</div>
                            </div>

                            <div className="text-xs font-semibold">
                              <span>
                                {request.pendingCount}/{request.bookedCount} Booked
                              </span>
                            </div>

                            <div className="mt-1 flex items-center justify-between text-[11px]">
                              <div className="mt-1 text-[10px] text-gray-600 dark:text-zinc-300">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Card className="mt-4 border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900">
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-500 dark:text-zinc-500">Total Covers</div>
              <div className="text-2xl font-bold">127</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-zinc-500">Avg Party Size</div>
              <div className="text-2xl font-bold">3.8</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-zinc-500">Walk-ins</div>
              <div className="text-2xl font-bold">8</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-zinc-500">DNR Rate</div>
              <div className="text-2xl font-bold">2.4%</div>
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
              <label className="text-md font-medium">Booking ID:</label>
              <div className="text-md font-medium">{selectedBooking?.bookingId}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="w-full space-y-2">
                <label className="text-sm font-medium">Start Time</label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger className="w-full border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[20rem] border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-800">
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
                  <SelectContent className="max-h-[20rem] border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-800">
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
              className="w-full rounded-md border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />

            {selectedDates && selectedDates.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Selected Dates ({selectedDates.length}):</p>
                <div className="flex flex-wrap justify-start gap-1.5">
                  {selectedDates.map((date, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-black text-xs text-white dark:bg-white dark:text-black">
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
              disabled={selectedDates.length === 0}
              className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              Confirm ({selectedDates.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Calendar as CalendarPicker } from '@/components/ui/calendar';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { showSuccess } from '@/utils/toast';
// import { format } from 'date-fns';
// import { Calendar, Copy, Timer } from 'lucide-react';
// import { useEffect, useState } from 'react';

// export default function ReservationGrid({ setClick }: any) {
//   const [mounted, setMounted] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 0, 15));

//   // Time update modal state
//   const [timeModalOpen, setTimeModalOpen] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState<any>(null);
//   const [startTime, setStartTime] = useState('10:00 AM');
//   const [endTime, setEndTime] = useState('12:00 PM');

//   // Multi-date picker state
//   const [datePickerOpen, setDatePickerOpen] = useState(false);
//   const [selectedDates, setSelectedDates] = useState<Date[]>([]);

//   // Copy-paste state
//   const [copiedSlot, setCopiedSlot] = useState<any>(null);
//   const [pasteMode, setPasteMode] = useState(false);

//   // All requests state
//   const [allRequests, setAllRequests] = useState<any[]>([]);

//   useEffect(() => {
//     setMounted(true);
//     setAllRequests(generateDummyRequests());
//   }, []);

//   // Generate time slots for dropdowns
//   const generateTimeSlots = () => {
//     const slots = [];
//     for (let i = 0; i < (21 - 9) * 4 + 1; i++) {
//       const totalMinutes = 9 * 60 + i * 15;
//       const hour = Math.floor(totalMinutes / 60);
//       const minute = totalMinutes % 60;
//       const ampm = hour < 12 ? 'AM' : 'PM';
//       const displayHour = hour % 12 === 0 ? 12 : hour % 12;
//       const displayMinute = minute.toString().padStart(2, '0');
//       slots.push(`${displayHour}:${displayMinute} ${ampm}`);
//     }
//     return slots;
//   };

//   const timeSlotOptions = generateTimeSlots();

//   const timeSlots = Array.from({ length: (21 - 9) * 4 + 1 }, (_, i) => {
//     const totalMinutes = 9 * 60 + i * 15;
//     const hour = Math.floor(totalMinutes / 60);
//     const minute = totalMinutes % 60;
//     const ampm = hour < 12 ? 'AM' : 'PM';
//     const displayHour = hour % 12 === 0 ? 12 : hour % 12;
//     const displayMinute = minute.toString().padStart(2, '0');
//     return `${displayHour}:${displayMinute} ${ampm}`;
//   });

//   const reservationTypes = ['Regular', 'VIP', 'Outdoor', 'Private', 'Bar', 'Window'];

//   const getTimeIndex = (timeStr: string) => {
//     const [time, period] = timeStr.split(' ');
//     const [hour, minute] = time.split(':').map(Number);
//     let hour24 = hour;
//     if (period === 'PM' && hour !== 12) hour24 += 12;
//     if (period === 'AM' && hour === 12) hour24 = 0;
//     const totalMinutes = hour24 * 60 + minute;
//     const startMinutes = 9 * 60;
//     return Math.floor((totalMinutes - startMinutes) / 15);
//   };

//   const addMinutesToTime = (timeStr: string, minutes: number) => {
//     const [time, period] = timeStr.split(' ');
//     const [hour, minute] = time.split(':').map(Number);
//     let hour24 = hour;
//     if (period === 'PM' && hour !== 12) hour24 += 12;
//     if (period === 'AM' && hour === 12) hour24 = 0;
//     const totalMinutes = hour24 * 60 + minute + minutes;
//     const newHour24 = Math.floor(totalMinutes / 60) % 24;
//     const newMinute = totalMinutes % 60;
//     const newAmpm = newHour24 < 12 ? 'AM' : 'PM';
//     const newDisplayHour = newHour24 % 12 === 0 ? 12 : newHour24 % 12;
//     const newDisplayMinute = newMinute.toString().padStart(2, '0');
//     return `${newDisplayHour}:${newDisplayMinute} ${newAmpm}`;
//   };

//   const generateDummyRequests = () => {
//     const requests: any = [];

//     const typeRequests = {
//       Regular: [
//         {
//           startTime: '10:00 AM',
//           durationSlots: 4,
//           bookingId: 'BK002',
//           pendingCount: 0,
//           bookedCount: 3,
//           table: 'T102',
//           size: 4,
//         },
//       ],
//       VIP: [
//         {
//           startTime: '11:00 AM',
//           durationSlots: 5,
//           bookingId: 'BK003',
//           pendingCount: 1,
//           bookedCount: 4,
//           table: 'V1',
//           size: 6,
//         },
//       ],
//       Outdoor: [
//         {
//           startTime: '12:00 PM',
//           durationSlots: 4,
//           bookingId: 'BK004',
//           pendingCount: 3,
//           bookedCount: 2,
//           table: 'O1',
//           size: 5,
//         },
//       ],
//       Private: [
//         {
//           startTime: '02:00 PM',
//           durationSlots: 6,
//           bookingId: 'BK005',
//           pendingCount: 0,
//           bookedCount: 8,
//           table: 'P1',
//           size: 10,
//         },
//       ],
//       Bar: [
//         {
//           startTime: '05:00 PM',
//           durationSlots: 2,
//           bookingId: 'BK006',
//           pendingCount: 1,
//           bookedCount: 1,
//           table: 'B1',
//           size: 3,
//         },
//       ],
//       Window: [
//         {
//           startTime: '06:30 PM',
//           durationSlots: 3,
//           bookingId: 'BK007',
//           pendingCount: 4,
//           bookedCount: 2,
//           table: 'W1',
//           size: 2,
//         },
//       ],
//     };

//     Object.entries(typeRequests).forEach(([type, reqs]) => {
//       reqs.forEach((req) => {
//         requests.push({
//           type,
//           startTime: req.startTime,
//           endTime: addMinutesToTime(req.startTime, req.durationSlots * 15),
//           bookingId: req.bookingId,
//           pendingCount: req.pendingCount,
//           bookedCount: req.bookedCount,
//           table: req.table,
//           size: req.size,
//         });
//       });
//     });

//     return requests;
//   };

//   const getRequestAtSlot = (type: string, timeIdx: number) => {
//     return allRequests.find((request: any) => {
//       if (request.type !== type) return false;
//       const startIdx = getTimeIndex(request.startTime);
//       const endIdx = getTimeIndex(request.endTime);
//       return timeIdx >= startIdx && timeIdx < endIdx;
//     });
//   };

//   const isRequestStart = (type: string, timeIdx: number) => {
//     const request = getRequestAtSlot(type, timeIdx);
//     if (!request) return false;
//     return getTimeIndex(request.startTime) === timeIdx;
//   };

//   const getRequestSpan = (type: string, timeIdx: number) => {
//     const request = getRequestAtSlot(type, timeIdx);
//     if (!request) return 0;
//     const startIdx = getTimeIndex(request.startTime);
//     const endIdx = getTimeIndex(request.endTime);
//     return endIdx - startIdx;
//   };

//   // Handle copy slot
//   const handleCopySlot = (e: React.MouseEvent, request: any) => {
//     e.stopPropagation();
//     setCopiedSlot(request);
//     setPasteMode(true);
//     showSuccess('Slot copied! Click on any cell to paste.');
//   };

//   // Handle paste slot
//   const handlePasteSlot = (type: string, timeIdx: number) => {
//     if (!copiedSlot || !pasteMode) return;

//     const clickedTime = timeSlots[timeIdx];
//     const startIdx = getTimeIndex(copiedSlot.startTime);
//     const endIdx = getTimeIndex(copiedSlot.endTime);
//     const duration = endIdx - startIdx;

//     // Calculate new start and end time
//     const newStartTime = clickedTime;
//     const newEndTime = addMinutesToTime(newStartTime, duration * 15);

//     // Check if there's any existing slot in the target range
//     const conflictingSlots = allRequests.filter((req: any) => {
//       if (req.type !== type) return false;
//       const reqStartIdx = getTimeIndex(req.startTime);
//       const reqEndIdx = getTimeIndex(req.endTime);

//       // Check if there's any overlap
//       return (
//         (timeIdx >= reqStartIdx && timeIdx < reqEndIdx) ||
//         (timeIdx + duration > reqStartIdx && timeIdx + duration <= reqEndIdx) ||
//         (timeIdx <= reqStartIdx && timeIdx + duration >= reqEndIdx)
//       );
//     });

//     // Shift conflicting slots forward
//     const updatedRequests = allRequests.map((req: any) => {
//       const isConflicting = conflictingSlots.find((cs: any) => cs.bookingId === req.bookingId);

//       if (isConflicting && req.type === type) {
//         const reqStartIdx = getTimeIndex(req.startTime);
//         const reqEndIdx = getTimeIndex(req.endTime);
//         const reqDuration = reqEndIdx - reqStartIdx;

//         // Calculate how much to shift
//         const shiftAmount = timeIdx + duration - reqStartIdx;

//         if (shiftAmount > 0) {
//           // Shift the slot forward
//           const newReqStartTime = addMinutesToTime(req.startTime, shiftAmount * 15);
//           const newReqEndTime = addMinutesToTime(newReqStartTime, reqDuration * 15);

//           return {
//             ...req,
//             startTime: newReqStartTime,
//             endTime: newReqEndTime,
//           };
//         }
//       }

//       return req;
//     });

//     // Add the new pasted slot
//     const newSlot = {
//       ...copiedSlot,
//       type: type,
//       startTime: newStartTime,
//       endTime: newEndTime,
//       bookingId: `BK${String(Date.now()).slice(-3)}`,
//     };

//     setAllRequests([...updatedRequests, newSlot]);
//     setPasteMode(false);
//     setCopiedSlot(null);
//     showSuccess('Slot pasted successfully!');
//   };

//   // Handle cell click for pasting
//   const handleCellClick = (type: string, timeIdx: number) => {
//     if (pasteMode && copiedSlot) {
//       handlePasteSlot(type, timeIdx);
//     }
//   };

//   // Handle timer icon click
//   const handleTimerClick = (e: React.MouseEvent, request: any) => {
//     e.stopPropagation();
//     setSelectedBooking(request);
//     setStartTime(request.startTime);
//     setEndTime(request.endTime);
//     setTimeModalOpen(true);
//   };

//   // Handle calendar icon click
//   const handleCalendarClick = (e: React.MouseEvent, request: any) => {
//     e.stopPropagation();
//     setSelectedBooking(request);
//     setDatePickerOpen(true);
//   };

//   // Handle time update
//   const handleTimeUpdate = () => {
//     if (!selectedBooking) return;

//     const updatedRequests = allRequests.map((req: any) => {
//       if (req.bookingId === selectedBooking.bookingId) {
//         return {
//           ...req,
//           startTime: startTime,
//           endTime: endTime,
//         };
//       }
//       return req;
//     });

//     setAllRequests(updatedRequests);
//     setTimeModalOpen(false);
//     setSelectedBooking(null);
//     showSuccess('Time updated successfully!');
//   };

//   // Handle date selection for multi-date picker
//   const handleDateSelect = (dates: Date[] | undefined) => {
//     if (dates) {
//       setSelectedDates(dates);
//     }
//   };

//   // Handle multi-date confirmation
//   const handleMultiDateConfirm = () => {
//     if (selectedDates.length === 0 || !selectedBooking) return;

//     showSuccess(`Slot copied to ${selectedDates.length} date(s)!`);
//     setDatePickerOpen(false);
//     setSelectedDates([]);
//     setSelectedBooking(null);
//   };

//   // Cancel paste mode
//   const handleCancelPaste = () => {
//     setPasteMode(false);
//     setCopiedSlot(null);
//     showSuccess('Paste mode cancelled.');
//   };

//   if (!mounted) {
//     return null;
//   }

//   return (
//     <div>
//       <Card className="mb-4 border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle className="flex items-center gap-2">
//               <Calendar className="h-5 w-5" />
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="border-gray-300 bg-gray-200 text-black hover:bg-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
//                   >
//                     {format(selectedDate, 'dd MMMM yyyy')}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto border-gray-300 bg-white p-0 dark:border-zinc-700 dark:bg-zinc-800">
//                   <CalendarPicker
//                     mode="single"
//                     selected={selectedDate}
//                     onSelect={(date) => date && setSelectedDate(date)}
//                     initialFocus
//                     className="text-black dark:text-white"
//                   />
//                 </PopoverContent>
//               </Popover>
//             </CardTitle>

//             {pasteMode && (
//               <div className="flex items-center gap-2">
//                 <Badge className="bg-blue-600 text-white">Paste Mode Active - Click any cell to paste</Badge>
//                 <Button variant="outline" size="sm" onClick={handleCancelPaste} className="border-red-500 text-red-500 hover:bg-red-50">
//                   Cancel
//                 </Button>
//               </div>
//             )}
//           </div>
//         </CardHeader>
//       </Card>

//       <div className="max-w-full">
//         <div className="max-h-[600px] overflow-auto rounded-lg border border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900">
//           <table className="w-full border-collapse text-sm">
//             <thead className="sticky top-0 z-10 bg-gray-200 dark:bg-zinc-800">
//               <tr>
//                 <th className="sticky left-0 z-20 min-w-[80px] border border-gray-300 bg-gray-200 p-2 text-left dark:border-zinc-700 dark:bg-zinc-800">
//                   Type
//                 </th>
//                 {timeSlots?.map((time, i) => (
//                   <th key={i} className="min-w-[90px] border border-gray-300 p-2 font-medium dark:border-zinc-700">
//                     {time}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {reservationTypes.map((type) => (
//                 <tr key={type}>
//                   <td className="sticky left-0 z-10 h-14 border border-gray-300 bg-gray-200 p-2 font-medium dark:border-zinc-700 dark:bg-zinc-800">
//                     {type}
//                   </td>
//                   {timeSlots?.map((_, timeIdx) => {
//                     const request = getRequestAtSlot(type, timeIdx);
//                     const isStart = isRequestStart(type, timeIdx);
//                     const span = getRequestSpan(type, timeIdx);

//                     if (request && !isStart) {
//                       return <td key={timeIdx} className="hidden"></td>;
//                     }

//                     return (
//                       <td
//                         key={timeIdx}
//                         colSpan={isStart ? span : 1}
//                         onClick={() => handleCellClick(type, timeIdx)}
//                         className={`border border-gray-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950 ${
//                           pasteMode && !request ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20' : ''
//                         }`}
//                       >
//                         {request && isStart && (
//                           <div
//                             onClick={() => setClick(true)}
//                             className="relative h-full cursor-pointer overflow-hidden rounded border border-green-500 bg-green-100/50 p-2 dark:border-green-700 dark:bg-green-900/50"
//                           >
//                             <Badge className="absolute top-0 right-0 rounded-none rounded-tr-xs rounded-bl-md bg-black text-[12px] text-white dark:bg-white dark:text-black">
//                               {request.size} {request.size > 1 ? 'Bookings' : 'Booking'}
//                             </Badge>

//                             <div className="mt-1 flex items-center justify-between text-[11px]">
//                               <div className="text-xs font-semibold">{request.bookingId}</div>
//                             </div>

//                             <div className="text-xs font-semibold">
//                               <span>
//                                 {request.pendingCount}/{request.bookedCount} Booked
//                               </span>
//                             </div>

//                             <div className="mt-1 flex items-center justify-between text-[11px]">
//                               <div className="mt-1 text-[10px] text-gray-600 dark:text-zinc-300">
//                                 {request.startTime} - {request.endTime}
//                               </div>

//                               <div className="flex items-center justify-between gap-2">
//                                 <button
//                                   title="Calendar"
//                                   type="button"
//                                   className="cursor-pointer transition-colors hover:text-green-600"
//                                   onClick={(e) => handleCalendarClick(e, request)}
//                                 >
//                                   <Calendar className="size-4" />
//                                 </button>

//                                 <button
//                                   title="Timer"
//                                   type="button"
//                                   className="cursor-pointer transition-colors hover:text-green-600"
//                                   onClick={(e) => handleTimerClick(e, request)}
//                                 >
//                                   <Timer className="size-4" />
//                                 </button>

//                                 <button
//                                   title="Copy"
//                                   type="button"
//                                   className="cursor-pointer transition-colors hover:text-green-600"
//                                   onClick={(e) => handleCopySlot(e, request)}
//                                 >
//                                   <Copy className="size-4" />
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <Card className="mt-4 border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900">
//         <CardContent className="p-4">
//           <div className="grid grid-cols-4 gap-4">
//             <div>
//               <div className="text-xs text-gray-500 dark:text-zinc-500">Total Covers</div>
//               <div className="text-2xl font-bold">127</div>
//             </div>
//             <div>
//               <div className="text-xs text-gray-500 dark:text-zinc-500">Avg Party Size</div>
//               <div className="text-2xl font-bold">3.8</div>
//             </div>
//             <div>
//               <div className="text-xs text-gray-500 dark:text-zinc-500">Walk-ins</div>
//               <div className="text-2xl font-bold">8</div>
//             </div>
//             <div>
//               <div className="text-xs text-gray-500 dark:text-zinc-500">DNR Rate</div>
//               <div className="text-2xl font-bold">2.4%</div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Time Update Modal */}
//       <Dialog open={timeModalOpen} onOpenChange={setTimeModalOpen}>
//         <DialogContent className="border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-900">
//           <DialogHeader>
//             <DialogTitle>Update Booking Time</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4 pt-2 pb-4">
//             <div className="flex items-center justify-start gap-x-2">
//               <label className="text-md font-medium">Booking ID:</label>
//               <div className="text-md font-medium">{selectedBooking?.bookingId}</div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="w-full space-y-2">
//                 <label className="text-sm font-medium">Start Time</label>
//                 <Select value={startTime} onValueChange={setStartTime}>
//                   <SelectTrigger className="w-full border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-800">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="max-h-[20rem] border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-800">
//                     {timeSlotOptions.map((time) => (
//                       <SelectItem key={time} value={time}>
//                         {time}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium">End Time</label>
//                 <Select value={endTime} onValueChange={setEndTime}>
//                   <SelectTrigger className="w-full border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-800">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="max-h-[20rem] border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-800">
//                     {timeSlotOptions.map((time) => (
//                       <SelectItem key={time} value={time}>
//                         {time}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setTimeModalOpen(false)} className="border-gray-300 dark:border-zinc-700">
//               Cancel
//             </Button>
//             <Button onClick={handleTimeUpdate} className="bg-green-600 text-white hover:bg-green-700">
//               Update
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Multi-Date Picker Modal */}
//       <Dialog open={datePickerOpen} onOpenChange={setDatePickerOpen}>
//         <DialogContent aria-describedby={undefined} className="gap-1 border-gray-300 bg-white sm:max-w-sm dark:border-zinc-700 dark:bg-zinc-900">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Calendar className="h-5 w-5" />
//               Select Multiple Dates
//             </DialogTitle>
//           </DialogHeader>

//           <div className="py-4">
//             <CalendarPicker
//               mode="multiple"
//               selected={selectedDates}
//               onSelect={handleDateSelect}
//               className="w-full rounded-md border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
//             />

//             {selectedDates && selectedDates.length > 0 && (
//               <div className="mt-4 space-y-2">
//                 <p className="text-sm font-medium">Selected Dates ({selectedDates.length}):</p>
//                 <div className="flex flex-wrap justify-start gap-1.5">
//                   {selectedDates.map((date, idx) => (
//                     <Badge key={idx} variant="secondary" className="bg-black text-xs text-white dark:bg-white dark:text-black">
//                       {date instanceof Date ? format(date, 'dd-MM-yy') : String(date)}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setDatePickerOpen(false);
//                 setSelectedDates([]);
//               }}
//               className="border-gray-300 dark:border-zinc-700"
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleMultiDateConfirm} disabled={selectedDates.length === 0} className="bg-green-600 text-white hover:bg-green-700">
//               Confirm ({selectedDates.length})
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
