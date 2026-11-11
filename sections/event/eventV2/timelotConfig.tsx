'use client';

import Time24hInput from '@/components/common/time-24h-input';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { showError, showSuccess } from '@/utils/toast';
import { Calendar, CalendarPlus, Plus, Trash2, X } from 'lucide-react';
import * as React from 'react';
import { EventData, getEventDateConstraints, isDateWithinEventSchedule } from './event-ticketing-helpers';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  quantity: number;
}

interface DateTimeSlot {
  date: string;
  timeSlots: TimeSlot[];
}

interface ApiTimeSlot {
  quantity: string;
  startTime: string;
  endTime: string;
}

interface ApiDateTimeSlot {
  date: string;
  timeSlots: ApiTimeSlot[];
}

interface TimeSlotConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: ApiDateTimeSlot[]) => void;
  totalQuantity?: number;
  eventData?: EventData | null;
  initialConfig?: DateTimeSlot[] | null;
}

// Convert 24-hour time to 12-hour format with padded hours
const convertTo12Hour = (time24: string): string => {
  if (!time24 || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time24)) {
    return '';
  }

  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  // Pad hours with leading zero
  return `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
};

const convertTo24Hour = (time12: string): string => {
  if (!time12) return '';

  const parts = time12.trim().split(/\s+/);
  if (parts.length < 2) return '';

  const [time, periodRaw] = [parts[0], parts[1]];
  const [hoursStr, minutesStr] = time.split(':');
  const period = periodRaw.toUpperCase();

  const hoursNum = Number(hoursStr);
  const minutesNum = Number(minutesStr);

  if (!Number.isFinite(hoursNum) || !Number.isFinite(minutesNum) || minutesNum < 0 || minutesNum > 59) {
    return '';
  }

  let hours = hoursNum;

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  if (hours < 0 || hours > 23) {
    return '';
  }

  return `${String(hours).padStart(2, '0')}:${String(minutesNum).padStart(2, '0')}`;
};

const isValidTime24 = (time: string): boolean => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

const TimeSlotConfigModal: React.FC<TimeSlotConfigModalProps> = ({ open, onClose, onSave, totalQuantity = 0, eventData, initialConfig }) => {
  const [dateTimeSlots, setDateTimeSlots] = React.useState<DateTimeSlot[]>([]);
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const pendingDateChipsRef = React.useRef<HTMLDivElement>(null);
  const discardPendingDatesRef = React.useRef(false);

  React.useEffect(() => {
    if (!open) return;

    if (initialConfig) {
      setDateTimeSlots(initialConfig);
    } else {
      setDateTimeSlots([]);
    }
    setSelectedDates([]);
    setIsDatePickerOpen(false);
  }, [open, initialConfig]);

  const eventConstraints = React.useMemo(() => {
    try {
      return getEventDateConstraints(eventData ?? null);
    } catch (error) {
      console.error('Error getting event constraints:', error);
      return { minDate: null, maxDate: null, startDateTime: null, endDateTime: null };
    }
  }, [eventData]);

  // Get event time boundaries in minutes for comparison
  const getEventTimeBoundaries = () => {
    if (!eventData?.schedule?.startDateTime || !eventData?.schedule?.endDateTime) {
      return { startMinutes: 0, endMinutes: 1440 }; // Full day if no event data
    }

    try {
      const startParts = eventData.schedule.startDateTime.split(' ');
      const endParts = eventData.schedule.endDateTime.split(' ');

      const parseTime = (timeParts: string[]) => {
        if (timeParts.length < 3) return null;
        const [time, period] = [timeParts[1], timeParts[2]];
        const [hoursStr, minutesStr] = time.split(':');
        let hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        return hours * 60 + minutes;
      };

      const startMinutes = parseTime(startParts);
      const endMinutes = parseTime(endParts);

      if (startMinutes === null || endMinutes === null) {
        console.warn('Failed to parse event times');
        return { startMinutes: 0, endMinutes: 1440 };
      }

      return { startMinutes, endMinutes };
    } catch (error) {
      console.error('Error parsing event times:', error);
      return { startMinutes: 0, endMinutes: 1440 };
    }
  };

  const { startMinutes: eventStartMinutes, endMinutes: eventEndMinutes } = getEventTimeBoundaries();

  // Convert time string to minutes
  const timeToMinutes = (time: string): number => {
    if (!isValidTime24(time)) return NaN;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Convert minutes to time string
  const minutesToTime = (mins: number): string => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Check if time is within event boundaries
  const isTimeWithinEvent = (time: string): boolean => {
    if (!isValidTime24(time)) return false;
    const minutes = timeToMinutes(time);
    return minutes >= eventStartMinutes && minutes <= eventEndMinutes;
  };

  // Format date with time for display
  const formatDateTimeDisplay = (dateStr: string | null, timeStr: string | null): string => {
    if (!dateStr) return '';

    try {
      const date = new Date(dateStr);
      const dateFormatted = date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });

      if (timeStr) {
        return `${dateFormatted} at ${timeStr}`;
      }

      return dateFormatted;
    } catch (error) {
      console.log('error', error);
      return dateStr;
    }
  };

  // Extract time from datetime string
  const extractTime = (dateTimeStr: string | null): string => {
    if (!dateTimeStr) return '';

    try {
      // Handle format like "2025-11-13 02:00 PM"
      const parts = dateTimeStr.split(' ');
      if (parts.length >= 3) {
        return convertTo24Hour(`${parts[1]} ${parts[2]}`);
      }

      // Handle ISO format
      const date = new Date(dateTimeStr);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    } catch (error) {
      console.log('error', error);
      return '';
    }
  };

  const formatDateToString = React.useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const getCalendarConstraints = React.useMemo(() => {
    if (!eventConstraints.minDate || !eventConstraints.maxDate) {
      return { fromDate: undefined, toDate: undefined };
    }
    return {
      fromDate: new Date(eventConstraints.minDate + 'T00:00:00'),
      toDate: new Date(eventConstraints.maxDate + 'T23:59:59'),
    };
  }, [eventConstraints]);

  const existingDates = React.useMemo(() => {
    return dateTimeSlots.map((dts) => dts.date);
  }, [dateTimeSlots]);

  const handleDateSelect = (dates: Date[] | undefined) => {
    if (!dates) {
      setSelectedDates([]);
      return;
    }

    const filteredDates = dates.filter((date) => !existingDates.includes(formatDateToString(date)));
    setSelectedDates(filteredDates);
  };

  const createDefaultTimeSlot = (index: number): TimeSlot => {
    const defaultStartMinutes = eventStartMinutes;
    const defaultEndMinutes = Math.min(defaultStartMinutes + 120, eventEndMinutes);

    return {
      id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 9)}`,
      startTime: minutesToTime(defaultStartMinutes),
      endTime: minutesToTime(defaultEndMinutes),
      quantity: 0,
    };
  };

  const addDates = () => {
    if (selectedDates.length === 0) {
      showError('Please select at least one date');
      return;
    }

    const newDateTimeSlots: DateTimeSlot[] = [];
    const invalidDates: string[] = [];

    selectedDates.forEach((date, index) => {
      const dateStr = formatDateToString(date);

      if (dateTimeSlots.some((dts) => dts.date === dateStr)) {
        return;
      }

      if (eventData && eventConstraints.minDate && eventConstraints.maxDate) {
        const validation = isDateWithinEventSchedule(dateStr, eventData ?? null);
        if (!validation.isValid) {
          invalidDates.push(dateStr);
          return;
        }
      }

      newDateTimeSlots.push({
        date: dateStr,
        timeSlots: [createDefaultTimeSlot(index)],
      });
    });

    if (invalidDates.length > 0) {
      showError(`${invalidDates.length} date(s) are outside the event schedule and were not added`);
    }

    if (newDateTimeSlots.length > 0) {
      const allSlots = [...dateTimeSlots, ...newDateTimeSlots].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setDateTimeSlots(allSlots);
      showSuccess(`${newDateTimeSlots.length} date(s) added successfully`);
    }

    setSelectedDates([]);
    setIsDatePickerOpen(false);
  };

  const handleDatePickerOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      discardPendingDatesRef.current = false;
      setIsDatePickerOpen(true);
      return;
    }

    if (discardPendingDatesRef.current) {
      discardPendingDatesRef.current = false;
      setSelectedDates([]);
      setIsDatePickerOpen(false);
      return;
    }

    if (selectedDates.length > 0) {
      addDates();
      return;
    }

    setIsDatePickerOpen(false);
  };

  const removeSelectedDate = (dateToRemove: Date) => {
    setSelectedDates(selectedDates.filter((date) => date.getTime() !== dateToRemove.getTime()));
  };

  const removeDate = (date: string) => {
    setDateTimeSlots(dateTimeSlots.filter((dts) => dts.date !== date));
  };

  const addTimeSlot = (date: string) => {
    setDateTimeSlots(
      dateTimeSlots.map((dts) => {
        if (dts.date === date) {
          const lastSlot = dts.timeSlots[dts.timeSlots.length - 1];
          let newStartMinutes = lastSlot ? timeToMinutes(lastSlot.endTime) : eventStartMinutes;

          // Ensure start time is within event boundaries
          if (newStartMinutes < eventStartMinutes) {
            newStartMinutes = eventStartMinutes;
          }
          if (newStartMinutes > eventEndMinutes) {
            newStartMinutes = eventStartMinutes;
          }

          const newEndMinutes = Math.min(newStartMinutes + 120, eventEndMinutes); // 2 hours or event end

          return {
            ...dts,
            timeSlots: [
              ...dts.timeSlots,
              {
                id: Date.now().toString(),
                startTime: minutesToTime(newStartMinutes),
                endTime: minutesToTime(newEndMinutes),
                quantity: 0,
              },
            ],
          };
        }
        return dts;
      })
    );
  };

  const removeTimeSlot = (date: string, slotId: string) => {
    setDateTimeSlots(
      dateTimeSlots
        .map((dts) => {
          if (dts.date === date) {
            const newSlots = dts.timeSlots.filter((slot) => slot.id !== slotId);
            return { ...dts, timeSlots: newSlots };
          }
          return dts;
        })
        .filter((dts) => dts.timeSlots.length > 0)
    );
  };

  const updateTimeSlot = (date: string, slotId: string, field: 'startTime' | 'endTime' | 'quantity', value: string | number) => {
    setDateTimeSlots(
      dateTimeSlots.map((dts) => {
        if (dts.date === date) {
          return {
            ...dts,
            timeSlots: dts.timeSlots.map((slot) => {
              if (slot.id === slotId) {
                // Validate time changes
                if (field === 'startTime' && typeof value === 'string') {
                  if (!isValidTime24(value)) {
                    return { ...slot, [field]: value };
                  }

                  if (!isTimeWithinEvent(value)) {
                    showError(
                      `Start time must be between ${extractTime(eventData?.schedule?.startDateTime || '')} and ${extractTime(eventData?.schedule?.endDateTime || '')}`
                    );
                    return slot;
                  }
                  // If start time is changed, validate or clear end time if it's now invalid
                  if (slot.endTime && timeToMinutes(slot.endTime) <= timeToMinutes(value)) {
                    return { ...slot, [field]: value, endTime: '' };
                  }
                }

                if (field === 'endTime' && typeof value === 'string') {
                  if (!isValidTime24(value)) {
                    return { ...slot, [field]: value };
                  }

                  if (!isTimeWithinEvent(value)) {
                    showError(
                      `End time must be between ${extractTime(eventData?.schedule?.startDateTime || '')} and ${extractTime(eventData?.schedule?.endDateTime || '')}`
                    );
                    return slot;
                  }
                  if (timeToMinutes(value) <= timeToMinutes(slot.startTime)) {
                    showError('End time must be after start time');
                    return slot;
                  }
                }

                return { ...slot, [field]: value };
              }
              return slot;
            }),
          };
        }
        return dts;
      })
    );
  };

  const getTotalAllocated = () => {
    return dateTimeSlots.reduce((total, dts) => {
      return total + dts.timeSlots.reduce((sum, slot) => sum + (slot.quantity || 0), 0);
    }, 0);
  };

  const handleSave = () => {
    if (dateTimeSlots.length === 0) {
      showError('Please add at least one date with time slots');
      return;
    }

    // Validate all dates have at least one time slot
    const invalidDates = dateTimeSlots.filter((dts) => dts.timeSlots.length === 0);
    if (invalidDates.length > 0) {
      showError('Each date must have at least one time slot');
      return;
    }

    // Validate all slots have both start and end times
    for (const dts of dateTimeSlots) {
      for (const slot of dts.timeSlots) {
        if (!slot.startTime || !slot.endTime) {
          showError('All time slots must have both start and end times');
          return;
        }

        if (!isValidTime24(slot.startTime) || !isValidTime24(slot.endTime)) {
          showError('All time slots must be in HH:mm format');
          return;
        }

        // Validate times are within event boundaries
        if (!isTimeWithinEvent(slot.startTime)) {
          showError(
            `All start times must be between ${extractTime(eventData?.schedule?.startDateTime || '')} and ${extractTime(eventData?.schedule?.endDateTime || '')}`
          );
          return;
        }

        if (!isTimeWithinEvent(slot.endTime)) {
          showError(
            `All end times must be between ${extractTime(eventData?.schedule?.startDateTime || '')} and ${extractTime(eventData?.schedule?.endDateTime || '')}`
          );
          return;
        }

        if (timeToMinutes(slot.endTime) <= timeToMinutes(slot.startTime)) {
          showError('End time must be after start time for all slots');
          return;
        }
      }
    }

    if (totalQuantity > 0) {
      const totalAllocated = getTotalAllocated();
      if (totalAllocated > totalQuantity) {
        showError(`Total allocated quantity (${totalAllocated}) exceeds available quantity (${totalQuantity})`);
        return;
      }
    }

    // Transform to API format with padded hours
    const apiFormat: ApiDateTimeSlot[] = dateTimeSlots.map((dts) => ({
      date: dts.date,
      timeSlots: dts.timeSlots.map((slot) => ({
        quantity: String(slot.quantity),
        startTime: convertTo12Hour(slot.startTime),
        endTime: convertTo12Hour(slot.endTime),
      })),
    }));

    for (const dts of apiFormat) {
      for (const slot of dts.timeSlots) {
        if (!slot.startTime || !slot.endTime) {
          showError('Invalid time slots found. Please review all slot times.');
          return;
        }
      }
    }

    onSave(apiFormat);
    onClose();
  };

  const totalAllocated = getTotalAllocated();
  const remainingQuantity = totalQuantity - totalAllocated;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 z-50 flex w-full items-center justify-center bg-black/50">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col overflow-y-auto md:max-w-[800px]!"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Configure Time Slots</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium">Add Dates</label>
              <div className="flex flex-wrap items-start gap-3">
                <Popover open={isDatePickerOpen} onOpenChange={handleDatePickerOpenChange}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <CalendarPlus size={16} />
                      Select Dates
                      {selectedDates.length > 0 && (
                        <span className="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">{selectedDates.length}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    onEscapeKeyDown={() => {
                      discardPendingDatesRef.current = true;
                    }}
                    onInteractOutside={(event) => {
                      const target = event.target as Node | null;
                      if (target && pendingDateChipsRef.current?.contains(target)) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <div className="p-3">
                      <CalendarComponent
                        mode="multiple"
                        selected={selectedDates}
                        onSelect={handleDateSelect}
                        disabled={(date) => {
                          const dateStr = formatDateToString(date);
                          if (getCalendarConstraints.fromDate && date < getCalendarConstraints.fromDate) return true;
                          if (getCalendarConstraints.toDate && date > getCalendarConstraints.toDate) return true;
                          if (existingDates.includes(dateStr)) return true;
                          return false;
                        }}
                        fromDate={getCalendarConstraints.fromDate}
                        toDate={getCalendarConstraints.toDate}
                        className="rounded-md border-0"
                      />
                      <div className="mt-3 flex justify-end gap-2 border-t pt-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            discardPendingDatesRef.current = true;
                            setSelectedDates([]);
                            setIsDatePickerOpen(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={addDates}
                          disabled={selectedDates.length === 0}
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Plus size={14} className="mr-1" />
                          Add {selectedDates.length > 0 ? `${selectedDates.length} Date${selectedDates.length > 1 ? 's' : ''}` : 'Dates'}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {selectedDates.length > 0 && (
                  <div ref={pendingDateChipsRef} className="flex flex-1 flex-wrap gap-2">
                    {selectedDates
                      .sort((a, b) => a.getTime() - b.getTime())
                      .map((date) => (
                        <span
                          key={date.toISOString()}
                          className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          <button
                            type="button"
                            onClick={() => removeSelectedDate(date)}
                            className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
                            title="Remove"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>
              {eventConstraints.minDate && eventConstraints.maxDate && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Available dates: {formatDateTimeDisplay(eventConstraints.minDate, extractTime(eventConstraints.startDateTime))} -{' '}
                  {formatDateTimeDisplay(eventConstraints.maxDate, extractTime(eventConstraints.endDateTime))}
                </p>
              )}
              {eventData && eventConstraints.startDateTime && eventConstraints.endDateTime && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Event time: {extractTime(eventConstraints.startDateTime)} - {extractTime(eventConstraints.endDateTime)}
                </p>
              )}
              {eventData && (!eventConstraints.minDate || !eventConstraints.maxDate) && (
                <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                  ⚠️ Event date constraints could not be parsed. Please check the event schedule format.
                </p>
              )}
            </div>

            {/* Quantity Summary */}
            {totalQuantity > 0 && (
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Total Available: <strong>{totalQuantity}</strong> | Allocated: <strong>{totalAllocated}</strong> | Remaining:{' '}
                  <strong className={remainingQuantity < 0 ? 'text-red-600' : ''}>{remainingQuantity}</strong>
                </p>
              </div>
            )}

            {/* Date Time Slots */}
            <div className="space-y-4">
              {dateTimeSlots.map((dateTimeSlot) => (
                <div key={dateTimeSlot.date} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-blue-600" />
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {new Date(dateTimeSlot.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDate(dateTimeSlot.date)}
                      className="cursor-pointer text-red-500 hover:text-red-600"
                      title="Remove date"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Slots & Quantity</label>
                      <button
                        type="button"
                        onClick={() => addTimeSlot(dateTimeSlot.date)}
                        className="flex cursor-pointer items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Plus size={16} />
                        Add Slot
                      </button>
                    </div>

                    {dateTimeSlot.timeSlots.map((slot, index) => (
                      <div
                        key={slot.id}
                        className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-900"
                      >
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>

                        <div className="relative flex-1">
                          <Time24hInput
                            value={slot.startTime}
                            onChange={(value) => updateTimeSlot(dateTimeSlot.date, slot.id, 'startTime', value)}
                            placeholder="HH:mm"
                            className="w-full"
                          />
                        </div>

                        <span className="text-sm text-gray-500">to</span>

                        <div className="relative flex-1">
                          <Time24hInput
                            value={slot.endTime}
                            onChange={(value) => updateTimeSlot(dateTimeSlot.date, slot.id, 'endTime', value)}
                            placeholder="HH:mm"
                            className="w-full"
                          />
                        </div>

                        <div className="relative w-24">
                          <input
                            title="quantity"
                            type="number"
                            min="0"
                            max={totalQuantity || 999}
                            value={slot.quantity === 0 ? '' : slot.quantity}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '') {
                                updateTimeSlot(dateTimeSlot.date, slot.id, 'quantity', 0);
                              } else {
                                const numVal = parseInt(val, 10);
                                if (!isNaN(numVal) && numVal >= 0) {
                                  updateTimeSlot(dateTimeSlot.date, slot.id, 'quantity', numVal);
                                }
                              }
                            }}
                            placeholder="Qty"
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                          />
                        </div>

                        <button
                          title="remove slot"
                          type="button"
                          onClick={() => removeTimeSlot(dateTimeSlot.date, slot.id)}
                          className="cursor-pointer text-red-500 hover:text-red-600"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {dateTimeSlots.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
                  <Calendar className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No dates added yet. Add a date to configure time slots.</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleSave}
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={dateTimeSlots.length === 0 || (totalQuantity > 0 && remainingQuantity < 0)}
              >
                Save Configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default TimeSlotConfigModal;
