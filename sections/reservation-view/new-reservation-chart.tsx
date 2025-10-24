import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar, Clock, Copy, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ReservationGrid({ setClick }: any) {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 0, 15));

  // Time update modal state
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('12:00 PM');

  // Multi-date picker state
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate time slots for dropdowns
  const generateTimeSlots = () => {
    const slots = [];
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

  const reservationTypes = [
    'Regular',
    'VIP',
    'Outdoor',
    'Private',
    'Bar',
    'Window',
  ];

  const getTimeIndex = (timeStr: string) => {
    const [time, period] = timeStr.split(' ');
    const [hour, minute] = time.split(':').map(Number);
    let hour24 = hour;
    if (period === 'PM' && hour !== 12) hour24 += 12;
    if (period === 'AM' && hour === 12) hour24 = 0;
    const totalMinutes = hour24 * 60 + minute;
    const startMinutes = 9 * 60;
    return Math.floor((totalMinutes - startMinutes) / 15);
  };

  const addMinutesToTime = (timeStr: string, minutes: number) => {
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

  const generateDummyRequests = () => {
    const requests: any = [];

    const typeRequests = {
      Regular: [
        {
          startTime: '09:15 AM',
          durationSlots: 3,
          bookingId: 'BK001',
          pendingCount: 2,
          bookedCount: 5,
          table: 'T101',
          size: 1,
        },
        {
          startTime: '10:30 AM',
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

  const allRequests = generateDummyRequests();

  const getRequestAtSlot = (type: string, timeIdx: number) => {
    return allRequests.find((request: any) => {
      if (request.type !== type) return false;
      const startIdx = getTimeIndex(request.startTime);
      const endIdx = getTimeIndex(request.endTime);
      return timeIdx >= startIdx && timeIdx < endIdx;
    });
  };

  const isRequestStart = (type: string, timeIdx: number) => {
    const request = getRequestAtSlot(type, timeIdx);
    if (!request) return false;
    return getTimeIndex(request.startTime) === timeIdx;
  };

  const getRequestSpan = (type: string, timeIdx: number) => {
    const request = getRequestAtSlot(type, timeIdx);
    if (!request) return 0;
    const startIdx = getTimeIndex(request.startTime);
    const endIdx = getTimeIndex(request.endTime);
    return endIdx - startIdx;
  };

  // Handle timer icon click
  // const handleTimerClick = (e: React.MouseEvent, request: any) => {
  //   e.stopPropagation();
  //   setSelectedBooking(request);
  //   setStartTime(request.startTime);
  //   setEndTime(request.endTime);
  //   setTimeModalOpen(true);
  // };

  // Handle timer icon click (fixed for showing correct times)
  const handleTimerClick = (e: React.MouseEvent, request: any) => {
    e.stopPropagation();
    setSelectedBooking(request);

    // Ensure modal opens after times are set
    setStartTime(request.startTime || '10:00 AM');
    setEndTime(request.endTime || '12:00 PM');

    // Small delay ensures state is updated before opening modal
    setTimeout(() => {
      setTimeModalOpen(true);
    }, 0);
  };

  // Handle calendar icon click
  const handleCalendarClick = (e: React.MouseEvent, request: any) => {
    e.stopPropagation();
    setSelectedBooking(request);
    setDatePickerOpen(true);
  };

  // Handle time update
  const handleTimeUpdate = () => {
    console.log('Updated time:', {
      bookingId: selectedBooking?.bookingId,
      startTime,
      endTime,
    });
    setTimeModalOpen(false);
  };

  // Handle multi-date selection
  const handleDateSelect = (dates: Date[] | undefined) => {
    if (!dates) {
      setSelectedDates([]);
      return;
    }
    setSelectedDates(dates);
  };

  const handleMultiDateConfirm = () => {
    console.log('Selected dates for booking:', {
      bookingId: selectedBooking?.bookingId,
      dates: selectedDates.map((d) => format(d, 'dd MMM yyyy')),
    });
    setDatePickerOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full text-black dark:bg-black dark:text-white">
      {/* Time Update Modal */}
      <Dialog open={timeModalOpen} onOpenChange={setTimeModalOpen}>
        <DialogContent className="border-gray-300 bg-white sm:max-w-md dark:border-zinc-700 dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Update Time
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[20rem]">
                  {timeSlotOptions.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[20rem]">
                  {timeSlotOptions.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTimeModalOpen(false)}
              className="border-gray-300 dark:border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTimeUpdate}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Update Time
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Multi-Date Picker Modal */}
      <Dialog open={datePickerOpen} onOpenChange={setDatePickerOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="gap-1 border-gray-300 bg-white sm:max-w-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select Multiple Dates
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <CalendarPicker
              mode="multiple"
              selected={selectedDates}
              onSelect={handleDateSelect}
              className="w-full rounded-md border border-gray-300 dark:border-zinc-700"
            />

            {selectedDates && selectedDates.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">
                  Selected Dates ({selectedDates.length}):
                </p>
                <div className="flex flex-wrap justify-start gap-1.5">
                  {selectedDates.map((date, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs text-white"
                    >
                      {date instanceof Date
                        ? format(date, 'dd-MM-yy')
                        : String(date)}
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
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Confirm ({selectedDates.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
          </div>
        </CardHeader>
      </Card>

      <div className="max-w-full">
        <div className="max-h-[600px] overflow-auto rounded-lg border border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-gray-200 dark:bg-zinc-800">
              <tr>
                <th className="sticky left-0 z-20 min-w-[80px] border border-gray-300 bg-gray-200 p-2 text-left dark:border-zinc-700 dark:bg-zinc-800">
                  Type
                </th>
                {timeSlots?.map((time, i) => (
                  <th
                    key={i}
                    className="min-w-[90px] border border-gray-300 p-2 font-medium dark:border-zinc-700"
                  >
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
                        className="border border-gray-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950"
                      >
                        {request && isStart && (
                          <div
                            onClick={() => setClick(true)}
                            className="relative h-full cursor-pointer overflow-hidden rounded border border-green-500 bg-green-100/50 p-2 dark:border-green-700 dark:bg-green-900/50"
                          >
                            <Badge className="absolute top-0 right-0 rounded-none rounded-tr-xs rounded-bl-md bg-black text-[12px] text-white dark:bg-white dark:text-black">
                              {request.size}{' '}
                              {request.size > 1 ? 'Bookings' : 'Booking'}
                            </Badge>

                            <div className="mt-1 flex items-center justify-between text-[11px]">
                              <div className="text-xs font-semibold">
                                {request.bookingId}
                              </div>
                            </div>

                            <div className="text-xs font-semibold">
                              <span>
                                {request.pendingCount}/{request.bookedCount}{' '}
                                Booked
                              </span>
                            </div>

                            <div className="mt-1 flex items-center justify-between text-[11px]">
                              <div className="mt-1 text-[10px] text-gray-600 dark:text-zinc-300">
                                {request.startTime} - {request.endTime}
                              </div>

                              <div className="flex items-center justify-between gap-2">
                                <button
                                  title="Calendar"
                                  type="button"
                                  className="cursor-pointer transition-colors hover:text-green-600"
                                  onClick={(e) =>
                                    handleCalendarClick(e, request)
                                  }
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
                                >
                                  <Copy className="size-4" />
                                </button>
                              </div>
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
              <div className="text-xs text-gray-500 dark:text-zinc-500">
                Total Covers
              </div>
              <div className="text-2xl font-bold">127</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-zinc-500">
                Avg Party Size
              </div>
              <div className="text-2xl font-bold">3.8</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-zinc-500">
                Walk-ins
              </div>
              <div className="text-2xl font-bold">8</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-zinc-500">
                DNR Rate
              </div>
              <div className="text-2xl font-bold">2.4%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
