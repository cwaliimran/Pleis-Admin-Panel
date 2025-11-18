'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Plus, Trash2, X } from 'lucide-react';
import * as React from 'react';
import { EventData, getEventDateConstraints, isDateWithinEventSchedule } from './ticket-helpers';
import { testDateParsing } from './debug-date-parsing';
import { fDate, formatStr } from '@/utils/format-time';

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

const convertTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
};

const TimeSlotConfigModal: React.FC<TimeSlotConfigModalProps> = ({ open, onClose, onSave, totalQuantity = 0, eventData, initialConfig }) => {
  const [dateTimeSlots, setDateTimeSlots] = React.useState<DateTimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<string>('');

  React.useEffect(() => {
    if (open && initialConfig) {
      setDateTimeSlots(initialConfig);
    } else if (open && !initialConfig) {
      setDateTimeSlots([]);
    }
  }, [open, initialConfig]);

  const eventConstraints = React.useMemo(() => {
    try {
      if (eventData && process.env.NODE_ENV === 'development') {
        testDateParsing(eventData);
      }

      return getEventDateConstraints(eventData ?? null);
    } catch (error) {
      console.error('Error getting event constraints:', error);
      return { minDate: null, maxDate: null, startDateTime: null, endDateTime: null };
    }
  }, [eventData]);

  const addDate = () => {
    if (!selectedDate) {
      alert('Please select a date first');
      return;
    }

    if (dateTimeSlots.some((dts) => dts.date === selectedDate)) {
      alert('This date already exists. Please select a different date.');
      return;
    }

    if (eventData && eventConstraints.minDate && eventConstraints.maxDate) {
      const validation = isDateWithinEventSchedule(selectedDate, eventData ?? null);
      if (!validation.isValid) {
        alert(validation.message || 'Selected date is outside event schedule');
        return;
      }
    }

    setDateTimeSlots([
      ...dateTimeSlots,
      {
        date: selectedDate,
        timeSlots: [{ id: Date.now().toString(), startTime: '09:00', endTime: '10:00', quantity: 0 }],
      },
    ]);
    setSelectedDate('');
  };

  const removeDate = (date: string) => {
    setDateTimeSlots(dateTimeSlots.filter((dts) => dts.date !== date));
  };

  const addTimeSlot = (date: string) => {
    setDateTimeSlots(
      dateTimeSlots.map((dts) => {
        if (dts.date === date) {
          const lastSlot = dts.timeSlots[dts.timeSlots.length - 1];
          const newStartTime = lastSlot ? lastSlot.endTime : '09:00';

          const [hours, minutes] = newStartTime.split(':').map(Number);
          const totalMinutes = hours * 60 + minutes + 60; // 1 hour
          const newEndHours = Math.floor(totalMinutes / 60) % 24;
          const newEndMinutes = totalMinutes % 60;
          const newEndTime = `${String(newEndHours).padStart(2, '0')}:${String(newEndMinutes).padStart(2, '0')}`;

          return {
            ...dts,
            timeSlots: [
              ...dts.timeSlots,
              {
                id: Date.now().toString(),
                startTime: newStartTime,
                endTime: newEndTime,
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
      alert('Please add at least one date with time slots');
      return;
    }

    // Validate all dates have at least one time slot
    const invalidDates = dateTimeSlots.filter((dts) => dts.timeSlots.length === 0);
    if (invalidDates.length > 0) {
      alert('Each date must have at least one time slot');
      return;
    }

    if (totalQuantity > 0) {
      const totalAllocated = getTotalAllocated();
      if (totalAllocated > totalQuantity) {
        alert(`Total allocated quantity (${totalAllocated}) exceeds available quantity (${totalQuantity})`);
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
              <label className="mb-2 block text-sm font-medium">Add Date</label>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  title="select date"
                  value={selectedDate}
                  min={eventConstraints.minDate || undefined}
                  max={eventConstraints.maxDate || undefined}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
                <Button type="button" onClick={addDate} className="bg-blue-600 text-white hover:bg-blue-700" disabled={!selectedDate}>
                  <Plus size={16} className="mr-1" />
                  Add Date
                </Button>
              </div>

              {eventConstraints.minDate && eventConstraints.maxDate && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Available dates: {fDate(eventConstraints.minDate, formatStr.paramCase.date)} -{' '}
                  {fDate(eventConstraints.maxDate, formatStr.paramCase.date)}
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
                          <input
                            title="start time"
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => {
                              const newStartTime = e.target.value;
                              updateTimeSlot(dateTimeSlot.date, slot.id, 'startTime', newStartTime);

                              // Auto-update end time if start time changes (add 1 hour by default)
                              const [hours, minutes] = newStartTime.split(':').map(Number);
                              const totalMinutes = hours * 60 + minutes + 60; // 1 hour
                              const newEndHours = Math.floor(totalMinutes / 60) % 24;
                              const newEndMinutes = totalMinutes % 60;
                              const newEndTime = `${String(newEndHours).padStart(2, '0')}:${String(newEndMinutes).padStart(2, '0')}`;

                              if (newEndTime > newStartTime) {
                                updateTimeSlot(dateTimeSlot.date, slot.id, 'endTime', newEndTime);
                              }
                            }}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                          />
                        </div>

                        <span className="text-sm text-gray-500">to</span>

                        <div className="relative flex-1">
                          <input
                            title="end time"
                            type="time"
                            value={slot.endTime}
                            min={slot.startTime}
                            onChange={(e) => {
                              const newEndTime = e.target.value;
                              if (newEndTime > slot.startTime) {
                                updateTimeSlot(dateTimeSlot.date, slot.id, 'endTime', newEndTime);
                              } else {
                                alert('End time must be after start time');
                              }
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
    </Dialog>
  );
};

export default TimeSlotConfigModal;
