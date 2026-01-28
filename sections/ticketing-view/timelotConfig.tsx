'use client';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { fDate, formatStr } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { Calendar, CalendarPlus, Check, Copy, Plus, Trash2, X } from 'lucide-react';
import * as React from 'react';
import { EventData, getEventDateConstraints, isDateWithinEventSchedule } from './ticket-helpers';

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

// Copy Slots Modal Component
interface CopySlotsModalProps {
  open: boolean;
  onClose: () => void;
  sourceDate: string | null;
  sourceSlotsCount: number;
  availableTargets: string[];
  dateTimeSlots: DateTimeSlot[];
  onCopy: (targetDates: string[]) => void;
}

const CopySlotsModal: React.FC<CopySlotsModalProps> = ({ open, onClose, sourceDate, sourceSlotsCount, availableTargets, dateTimeSlots, onCopy }) => {
  const [selectedDates, setSelectedDates] = React.useState<string[]>([]);

  // Reset selection when modal opens
  React.useEffect(() => {
    if (open) {
      setSelectedDates([]);
    }
  }, [open]);

  const toggleDate = (date: string) => {
    setSelectedDates((prev) => (prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]));
  };

  const selectAll = () => {
    setSelectedDates(availableTargets);
  };

  const deselectAll = () => {
    setSelectedDates([]);
  };

  const handleCopy = () => {
    onCopy(selectedDates);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary z-61 mx-auto flex max-h-[80vh] w-full max-w-md flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-lg font-bold">Copy Slots To Other Dates</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Source info */}
            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Copying{' '}
                <strong>
                  {sourceSlotsCount} time slot{sourceSlotsCount > 1 ? 's' : ''}
                </strong>{' '}
                from{' '}
                <strong>
                  {sourceDate
                    ? new Date(sourceDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })
                    : ''}
                </strong>
              </p>
            </div>

            {/* Select all / Deselect all */}
            {availableTargets.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Select target dates ({selectedDates.length} selected)</span>
                <div className="flex gap-2">
                  <button type="button" onClick={selectAll} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    Select All
                  </button>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <button type="button" onClick={deselectAll} className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400">
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Date list - scrollable */}
            <div className="max-h-[300px] min-h-[150px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
              {availableTargets.length === 0 ? (
                <div className="flex h-[150px] items-center justify-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No available dates to copy to</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {availableTargets.map((targetDate) => {
                    const isExisting = dateTimeSlots.some((dts) => dts.date === targetDate);
                    const isSelected = selectedDates.includes(targetDate);
                    return (
                      <label
                        key={targetDate}
                        className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <Checkbox checked={isSelected} onCheckedChange={() => toggleDate(targetDate)} />
                        <div className="flex flex-1 flex-col">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {new Date(targetDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          {isExisting ? (
                            <span className="text-xs text-orange-600 dark:text-orange-400">
                              Will append to existing {dateTimeSlots.find((dts) => dts.date === targetDate)?.timeSlots.length || 0} slot(s)
                            </span>
                          ) : (
                            <span className="text-xs text-green-600 dark:text-green-400">New date will be created</span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="button" onClick={handleCopy} disabled={selectedDates.length === 0} className="bg-blue-600 text-white hover:bg-blue-700">
                <Check size={16} className="mr-1" />
                Copy to {selectedDates.length > 0 ? `${selectedDates.length} Date${selectedDates.length > 1 ? 's' : ''}` : 'Selected'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

const convertTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
};

const TimeSlotConfigModal: React.FC<TimeSlotConfigModalProps> = ({ open, onClose, onSave, totalQuantity = 0, eventData, initialConfig }) => {
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);
  const [dateTimeSlots, setDateTimeSlots] = React.useState<DateTimeSlot[]>([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [copyFromDate, setCopyFromDate] = React.useState<string | null>(null);
  const [isCopyModalOpen, setIsCopyModalOpen] = React.useState(false);

  // React.useEffect(() => {
  //   if (open) {
  //     if (initialConfig) {
  //       setDateTimeSlots(initialConfig);
  //     } else {
  //       setDateTimeSlots([]);
  //     }
  //   }
  // }, [open, initialConfig]);

  React.useEffect(() => {
    if (open) {
      if (initialConfig) {
        // Deep clone the config to avoid reference issues
        setDateTimeSlots(JSON.parse(JSON.stringify(initialConfig)));
      } else {
        setDateTimeSlots([]);
      }
      // Reset selected dates when modal opens
      setSelectedDates([]);
      setCopyFromDate(null);
    }
  }, [open, initialConfig]);

  const eventConstraints = React.useMemo(() => {
    try {
      // if (eventData && process.env.NODE_ENV === 'development') {
      //   testDateParsing(eventData);
      // }

      return getEventDateConstraints(eventData ?? null);
    } catch (error) {
      console.error('Error getting event constraints:', error);
      return { minDate: null, maxDate: null, startDateTime: null, endDateTime: null };
    }
  }, [eventData]);

  // Helper function to format Date to YYYY-MM-DD string
  const formatDateToString = React.useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Get date constraints for the calendar
  const getCalendarConstraints = React.useMemo(() => {
    if (!eventConstraints.minDate || !eventConstraints.maxDate) {
      return { fromDate: undefined, toDate: undefined };
    }
    return {
      fromDate: new Date(eventConstraints.minDate + 'T00:00:00'),
      toDate: new Date(eventConstraints.maxDate + 'T23:59:59'),
    };
  }, [eventConstraints]);

  // Get dates that are already added
  const existingDates = React.useMemo(() => {
    return dateTimeSlots.map((dts) => dts.date);
  }, [dateTimeSlots]);

  // Handle date selection in calendar
  const handleDateSelect = (dates: Date[] | undefined) => {
    if (!dates) {
      setSelectedDates([]);
      return;
    }

    // Filter out dates that are already added
    const filteredDates = dates.filter((date) => {
      const dateStr = formatDateToString(date);
      return !existingDates.includes(dateStr);
    });

    setSelectedDates(filteredDates);
  };

  // Add all selected dates
  const addDates = () => {
    if (selectedDates.length === 0) {
      showError('Please select at least one date');
      return;
    }

    const newDateTimeSlots: DateTimeSlot[] = [];
    const invalidDates: string[] = [];

    for (const date of selectedDates) {
      const dateStr = formatDateToString(date);

      // Check if date already exists
      if (dateTimeSlots.some((dts) => dts.date === dateStr)) {
        continue; // Skip already existing dates
      }

      // Validate date is within event schedule
      if (eventData && eventConstraints.minDate && eventConstraints.maxDate) {
        const validation = isDateWithinEventSchedule(dateStr, eventData ?? null);
        if (!validation.isValid) {
          invalidDates.push(dateStr);
          continue;
        }
      }

      newDateTimeSlots.push({
        date: dateStr,
        timeSlots: [],
      });
    }

    if (invalidDates.length > 0) {
      showError(`${invalidDates.length} date(s) are outside the event schedule and were not added`);
    }

    if (newDateTimeSlots.length > 0) {
      // Sort dates chronologically
      const allSlots = [...dateTimeSlots, ...newDateTimeSlots].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setDateTimeSlots(allSlots);
      showSuccess(`${newDateTimeSlots.length} date(s) added successfully`);
    }

    setSelectedDates([]);
    setIsDatePickerOpen(false);
  };

  // Remove a selected date before adding
  const removeSelectedDate = (dateToRemove: Date) => {
    setSelectedDates(selectedDates.filter((d) => d.getTime() !== dateToRemove.getTime()));
  };

  const removeDate = (date: string) => {
    setDateTimeSlots(dateTimeSlots.filter((dts) => dts.date !== date));
  };

  // Get available dates for copying (dates within event schedule that don't exist yet or already exist)
  const getAvailableCopyTargets = React.useCallback(
    (sourceDate: string): string[] => {
      const existingDatesSet = new Set(dateTimeSlots.map((dts) => dts.date));
      const availableDates: string[] = [];

      // Add all existing dates except the source date
      dateTimeSlots.forEach((dts) => {
        if (dts.date !== sourceDate) {
          availableDates.push(dts.date);
        }
      });

      // If we have event constraints, also suggest dates in the event range that don't exist yet
      if (eventConstraints.minDate && eventConstraints.maxDate) {
        const startDate = new Date(eventConstraints.minDate);
        const endDate = new Date(eventConstraints.maxDate);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = formatDateToString(d);
          if (dateStr !== sourceDate && !existingDatesSet.has(dateStr)) {
            availableDates.push(dateStr);
          }
        }
      }

      // Sort dates chronologically
      return availableDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    },
    [dateTimeSlots, eventConstraints, formatDateToString]
  );

  // Handle opening copy modal
  const handleOpenCopyModal = (sourceDate: string) => {
    setCopyFromDate(sourceDate);
    setIsCopyModalOpen(true);
  };

  // Execute copy slots to selected dates
  const executeCopySlots = (copyTargetDates: string[]) => {
    if (!copyFromDate || copyTargetDates.length === 0) {
      showError('Please select at least one target date');
      return;
    }

    const sourceSlots = dateTimeSlots.find((dts) => dts.date === copyFromDate);
    if (!sourceSlots || sourceSlots.timeSlots.length === 0) {
      showError('Source date has no time slots to copy');
      return;
    }

    let newDateTimeSlots = [...dateTimeSlots];
    let copiedCount = 0;
    let createdDatesCount = 0;

    for (const targetDate of copyTargetDates) {
      const existingIndex = newDateTimeSlots.findIndex((dts) => dts.date === targetDate);

      // Create new slots with new IDs
      const copiedSlots: TimeSlot[] = sourceSlots.timeSlots.map((slot) => ({
        ...slot,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }));

      if (existingIndex >= 0) {
        // Append to existing date
        newDateTimeSlots[existingIndex] = {
          ...newDateTimeSlots[existingIndex],
          timeSlots: [...newDateTimeSlots[existingIndex].timeSlots, ...copiedSlots],
        };
      } else {
        // Create new date entry
        newDateTimeSlots.push({
          date: targetDate,
          timeSlots: copiedSlots,
        });
        createdDatesCount++;
      }
      copiedCount++;
    }

    // Sort by date
    newDateTimeSlots = newDateTimeSlots.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setDateTimeSlots(newDateTimeSlots);

    const message =
      createdDatesCount > 0
        ? `Copied ${sourceSlots.timeSlots.length} slot(s) to ${copiedCount} date(s) (${createdDatesCount} new date(s) created)`
        : `Copied ${sourceSlots.timeSlots.length} slot(s) to ${copiedCount} date(s)`;

    showSuccess(message);
    setCopyFromDate(null);
  };

  // const isTimeWithinEvent = (time: string) => {
  //   if (!eventData?.schedule?.startDateTime || !eventData?.schedule?.endDateTime) return true;
  //   // event times are in ISO, slot times are in HH:mm
  //   const eventStart = new Date(eventData.schedule.startDateTime);
  //   const eventEnd = new Date(eventData.schedule.endDateTime);
  //   const [slotHours, slotMinutes] = time.split(':').map(Number);
  //   // Use the event date for comparison
  //   const slotDate = new Date(eventStart);
  //   slotDate.setHours(slotHours, slotMinutes, 0, 0);
  //   return slotDate >= eventStart && slotDate <= eventEnd;
  // };

  // const isTimeWithinEvent = (date: string, time: string) => {
  //   if (!eventData?.schedule?.startDateTime || !eventData?.schedule?.endDateTime) return true;

  //   try {
  //     const eventStart = new Date(eventData.schedule.startDateTime);
  //     const eventEnd = new Date(eventData.schedule.endDateTime);

  //     const [hours, minutes] = time.split(':').map(Number);

  //     // Create a date object using the selected date
  //     const slotDateTime = new Date(date);
  //     slotDateTime.setHours(hours, minutes, 0, 0);

  //     return slotDateTime >= eventStart && slotDateTime <= eventEnd;
  //   } catch (error) {
  //     console.error('Error validating time:', error);
  //     return true;
  //   }
  // };

  const isTimeWithinEvent = (date: string, time: string) => {
    if (!eventData?.schedule?.startDateTime || !eventData?.schedule?.endDateTime) return true;

    try {
      // Parse the event start and end times
      const eventStartDate = new Date(eventData.schedule.startDateTime);
      const eventEndDate = new Date(eventData.schedule.endDateTime);

      // Get just the time portion from event times
      const eventStartHours = eventStartDate.getHours();
      const eventStartMinutes = eventStartDate.getMinutes();
      const eventEndHours = eventEndDate.getHours();
      const eventEndMinutes = eventEndDate.getMinutes();

      // Parse the selected slot time
      const [slotHours, slotMinutes] = time.split(':').map(Number);

      // Convert times to minutes for easier comparison
      const eventStartTotalMinutes = eventStartHours * 60 + eventStartMinutes;
      const eventEndTotalMinutes = eventEndHours * 60 + eventEndMinutes;
      const slotTotalMinutes = slotHours * 60 + slotMinutes;

      // Check if slot time is within event time range
      return slotTotalMinutes >= eventStartTotalMinutes && slotTotalMinutes <= eventEndTotalMinutes;
    } catch (error) {
      console.error('Error validating time:', error);
      return true;
    }
  };

  const addTimeSlot = (date: string) => {
    setDateTimeSlots(
      dateTimeSlots.map((dts) => {
        if (dts.date === date) {
          return {
            ...dts,
            timeSlots: [
              ...dts.timeSlots,
              {
                id: Date.now().toString(),
                startTime: '', // No default value, user must pick
                endTime: '', // No default value, user must pick
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
        .filter((dts) => dts.timeSlots.length > 0) // Remove date if no slots left
    );
  };

  const updateTimeSlot = (date: string, slotId: string, field: 'startTime' | 'endTime' | 'quantity', value: string | number) => {
    setDateTimeSlots(
      dateTimeSlots.map((dts) => {
        if (dts.date === date) {
          return {
            ...dts,
            timeSlots: dts.timeSlots.map((slot) => (slot.id === slotId ? { ...slot, [field]: value } : slot)),
          };
        }
        return dts;
      })
    );
  };

  const getTotalAllocated = () => {
    return dateTimeSlots.reduce((total, dts) => {
      return total + dts.timeSlots.reduce((sum, slot) => sum + (typeof slot.quantity === 'number' ? slot.quantity : 0), 0);
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

    // Validate all slots are within event time
    if (eventData?.schedule?.startDateTime && eventData?.schedule?.endDateTime) {
      const eventStart = new Date(eventData.schedule.startDateTime);
      const eventEnd = new Date(eventData.schedule.endDateTime);
      for (const dts of dateTimeSlots) {
        for (const slot of dts.timeSlots) {
          if (!slot.startTime || !slot.endTime) continue;
          const [startH, startM] = slot.startTime.split(':').map(Number);
          const [endH, endM] = slot.endTime.split(':').map(Number);
          const slotStart = new Date(eventStart);
          slotStart.setHours(startH, startM, 0, 0);
          const slotEnd = new Date(eventStart);
          slotEnd.setHours(endH, endM, 0, 0);
          if (slotStart < eventStart || slotEnd > eventEnd) {
            showError('All slot times must be within the event time duration.');
            return;
          }
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

    // Transform to API format: convert times to 12-hour format and quantity to string
    const apiFormat: ApiDateTimeSlot[] = dateTimeSlots.map((dts) => ({
      date: dts.date,
      timeSlots: dts.timeSlots.map((slot) => ({
        quantity: String(typeof slot.quantity === 'string' ? (slot.quantity === '' ? 0 : parseInt(slot.quantity, 10)) : slot.quantity),
        startTime: convertTo12Hour(slot.startTime),
        endTime: convertTo12Hour(slot.endTime),
      })),
    }));

    onSave(apiFormat);
    onClose();
  };

  // const handleSelectDate = (date: string) => {
  //   setSelectedDate(date);
  //   setShowDate(false);
  //   setSlotDuration('120');
  // };

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
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3">
                      <CalendarComponent
                        mode="multiple"
                        selected={selectedDates}
                        onSelect={handleDateSelect}
                        disabled={(date) => {
                          const dateStr = formatDateToString(date);
                          // Disable dates outside event range
                          if (getCalendarConstraints.fromDate && date < getCalendarConstraints.fromDate) return true;
                          if (getCalendarConstraints.toDate && date > getCalendarConstraints.toDate) return true;
                          // Disable already added dates
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

                {/* Selected dates preview */}
                {selectedDates.length > 0 && (
                  <div className="flex flex-1 flex-wrap gap-2">
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
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  Available dates: {fDate(eventConstraints.minDate, formatStr.split.date)} -{' '}
                  {fDate(eventConstraints.maxDate, formatStr.split.date)}
                </p>
              )}

              {eventData?.schedule?.startDateTime && eventData?.schedule?.endDateTime && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Time duration: {fDate(eventData.schedule.startDateTime, formatStr.time)} - {fDate(eventData.schedule.endDateTime, formatStr.time)}
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
                    <div className="flex items-center gap-2">
                      {/* Copy Slots Button */}
                      {dateTimeSlot.timeSlots.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleOpenCopyModal(dateTimeSlot.date)}
                          className="cursor-pointer rounded-md p-1 text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30"
                          title="Copy slots to other dates"
                        >
                          <Copy size={16} />
                        </button>
                      )}
                      {/* Remove Date Button */}
                      <button
                        type="button"
                        onClick={() => removeDate(dateTimeSlot.date)}
                        className="cursor-pointer rounded-md p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                        title="Remove date"
                      >
                        <X size={18} />
                      </button>
                    </div>
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
                        key={index}
                        className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-900"
                      >
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>

                        <div className="relative flex-1">
                          {/* <input
                            title="start time"
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => {
                              const newStartTime = e.target.value;
                              updateTimeSlot(dateTimeSlot.date, slot.id, 'startTime', newStartTime);

                              // Only auto-update end time if it is set and less than or equal to new start time
                              if (slot.endTime && slot.endTime <= newStartTime) {
                                updateTimeSlot(dateTimeSlot.date, slot.id, 'endTime', '');
                              }

                              // Show toast if not within event time
                              if (!isTimeWithinEvent(newStartTime)) {
                                showError('Start time must be within event time duration.');
                              }
                            }}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                          /> */}

                          <input
                            title="start time"
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => {
                              const newStartTime = e.target.value;

                              // Validate if time is within event schedule
                              if (!isTimeWithinEvent(dateTimeSlot.date, newStartTime)) {
                                showError('Start time must be within event time duration.');
                                return;
                              }

                              updateTimeSlot(dateTimeSlot.date, slot.id, 'startTime', newStartTime);

                              // Auto-clear end time if it's less than or equal to new start time
                              if (slot.endTime && slot.endTime <= newStartTime) {
                                updateTimeSlot(dateTimeSlot.date, slot.id, 'endTime', '');
                              }
                            }}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                          />
                        </div>

                        <span className="text-sm text-gray-500">to</span>

                        <div className="relative flex-1">
                          {/* <input
                            title="end time"
                            type="time"
                            value={slot.endTime}
                            min={slot.startTime || undefined}
                            onChange={(e) => {
                              const newEndTime = e.target.value;
                              if (!slot.startTime) {
                                showError('Please select a start time first');
                                return;
                              }
                              if (newEndTime > slot.startTime) {
                                updateTimeSlot(dateTimeSlot.date, slot.id, 'endTime', newEndTime);
                                if (!isTimeWithinEvent(newEndTime)) {
                                  showError('End time must be within event time duration.');
                                }
                              } else {
                                showError('End time must be after start time');
                              }
                            }}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                          /> */}

                          <input
                            title="end time"
                            type="time"
                            value={slot.endTime}
                            min={slot.startTime || undefined}
                            onChange={(e) => {
                              const newEndTime = e.target.value;

                              if (!slot.startTime) {
                                showError('Please select a start time first');
                                return;
                              }

                              if (newEndTime <= slot.startTime) {
                                showError('End time must be after start time');
                                return;
                              }

                              // Validate if time is within event schedule
                              if (!isTimeWithinEvent(dateTimeSlot.date, newEndTime)) {
                                showError('End time must be within event time duration.');
                                return;
                              }

                              updateTimeSlot(dateTimeSlot.date, slot.id, 'endTime', newEndTime);
                            }}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
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
                              // Allow empty string for user-friendly editing
                              updateTimeSlot(dateTimeSlot.date, slot.id, 'quantity', val === '' ? '' : Math.max(0, parseInt(val)));
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

      {/* Copy Slots Modal */}
      <CopySlotsModal
        open={isCopyModalOpen}
        onClose={() => {
          setIsCopyModalOpen(false);
          setCopyFromDate(null);
        }}
        sourceDate={copyFromDate}
        sourceSlotsCount={copyFromDate ? dateTimeSlots.find((dts) => dts.date === copyFromDate)?.timeSlots.length || 0 : 0}
        availableTargets={copyFromDate ? getAvailableCopyTargets(copyFromDate) : []}
        dateTimeSlots={dateTimeSlots}
        onCopy={executeCopySlots}
      />
    </Dialog>
  );
};

export default TimeSlotConfigModal;
