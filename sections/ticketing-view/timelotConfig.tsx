'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface TimeSlotConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: TimeSlotConfig) => void;
}

interface TimeSlotConfig {
  slotDuration: string;
  operatingDays: string[];
  timeSlots: TimeSlot[];
}

const DAYS = [
  { label: 'Sun', value: 'sunday' },
  { label: 'Mon', value: 'monday' },
  { label: 'Tue', value: 'tuesday' },
  { label: 'Wed', value: 'wednesday' },
  { label: 'Thu', value: 'thursday' },
  { label: 'Fri', value: 'friday' },
  { label: 'Sat', value: 'saturday' },
];

// const SLOT_DURATIONS = [
//   { label: '30 minutes', value: '30' },
//   { label: '1 hour', value: '60' },
//   { label: '2 hours', value: '120' },
//   { label: '3 hours', value: '180' },
//   { label: '4 hours', value: '240' },
//   { label: '6 hours', value: '360' },
//   { label: '8 hours', value: '480' },
// ];

const TimeSlotConfigModal: React.FC<TimeSlotConfigModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [showDate, setShowDate] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<string>('');

  const [slotDuration, setSlotDuration] = React.useState('120');
  const [operatingDays, setOperatingDays] = React.useState<string[]>([
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
  ]);
  const [timeSlots, setTimeSlots] = React.useState<TimeSlot[]>([
    { id: '1', startTime: '09:00', endTime: '11:00' },
  ]);

  const toggleDay = (day: string) => {
    setOperatingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addTimeSlot = () => {
    const lastSlot = timeSlots[timeSlots.length - 1];
    const newStartTime = lastSlot ? lastSlot.endTime : '09:00';

    // Calculate end time based on slot duration
    const [hours, minutes] = newStartTime.split(':').map(Number);
    const durationMinutes = parseInt(slotDuration);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const newEndHours = Math.floor(totalMinutes / 60) % 24;
    const newEndMinutes = totalMinutes % 60;
    const newEndTime = `${String(newEndHours).padStart(2, '0')}:${String(newEndMinutes).padStart(2, '0')}`;

    setTimeSlots([
      ...timeSlots,
      {
        id: Date.now().toString(),
        startTime: newStartTime,
        endTime: newEndTime,
      },
    ]);
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
  };

  const updateTimeSlot = (
    id: string,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setTimeSlots(
      timeSlots.map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    );
  };

  // const autoGenerateSlots = () => {
  //   if (timeSlots.length === 0) return;

  //   const firstSlot = timeSlots[0];
  //   const [startHours, startMinutes] = firstSlot.startTime
  //     .split(':')
  //     .map(Number);
  //   const lastSlot = timeSlots[timeSlots.length - 1];
  //   const [endHours, endMinutes] = lastSlot.endTime.split(':').map(Number);

  //   const totalStartMinutes = startHours * 60 + startMinutes;
  //   const totalEndMinutes = endHours * 60 + endMinutes;
  //   const workingMinutes = totalEndMinutes - totalStartMinutes;
  //   const durationMinutes = parseInt(slotDuration);
  //   const numberOfSlots = Math.floor(workingMinutes / durationMinutes);

  //   const newSlots: TimeSlot[] = [];
  //   for (let i = 0; i < numberOfSlots; i++) {
  //     const slotStartMinutes = totalStartMinutes + i * durationMinutes;
  //     const slotEndMinutes = slotStartMinutes + durationMinutes;

  //     const startHour = Math.floor(slotStartMinutes / 60) % 24;
  //     const startMin = slotStartMinutes % 60;
  //     const endHour = Math.floor(slotEndMinutes / 60) % 24;
  //     const endMin = slotEndMinutes % 60;

  //     newSlots.push({
  //       id: `${i + 1}`,
  //       startTime: `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`,
  //       endTime: `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`,
  //     });
  //   }

  //   setTimeSlots(newSlots);
  // };

  const handleSave = () => {
    onSave({
      slotDuration,
      operatingDays,
      timeSlots,
    });
    onClose();
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setShowDate(false);
    setSlotDuration('120');
  };

  // const handleSaveAsTemplate = () => {
  //   // Implement template saving logic
  //   console.log('Saving as template:', {
  //     slotDuration,
  //     operatingDays,
  //     timeSlots,
  //   });
  // };

  // const calculateSlotsPerDay = () => {
  //   if (timeSlots.length === 0) return 0;
  //   const firstSlot = timeSlots[0];
  //   const lastSlot = timeSlots[timeSlots.length - 1];

  //   const [startHours, startMinutes] = firstSlot.startTime
  //     .split(':')
  //     .map(Number);
  //   const [endHours, endMinutes] = lastSlot.endTime.split(':').map(Number);

  //   const totalMinutes =
  //     endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
  //   const durationMinutes = parseInt(slotDuration);

  //   return Math.floor(totalMinutes / durationMinutes);
  // };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 z-50 flex w-full items-center justify-center bg-black/0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col overflow-y-auto md:!max-w-[800px]"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Configure Time Slots
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Slot Duration */}
            {/* <div>
              <label className="mb-2 block text-sm font-medium">
                Slot Duration
              </label>
              <div className="flex items-center gap-3">
                <select
                  title="select"
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                >
                  {SLOT_DURATIONS.map((duration) => (
                    <option key={duration.value} value={duration.value}>
                      {duration.label}
                    </option>
                  ))}
                </select>
              </div>
            </div> */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Select Date
              </label>
              <div className="flex flex-1 items-center gap-3">
                <input
                  type="date"
                  title="select date"
                  // value={selectedDate}
                  // onChange={(e) => handleSelectDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
            </div>

            {/* Operating Days */}
            <div>
              <label className="mb-3 block text-sm font-medium">
                Operating Days
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`cursor-pointer rounded-lg px-6 py-2.5 font-medium transition-colors ${
                      operatingDays.includes(day.value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Time Slots */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium">Daily Time Slots</label>
                <button
                  type="button"
                  onClick={addTimeSlot}
                  className="flex cursor-pointer items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus size={16} />
                  Add Slot
                </button>
              </div>

              <div className="space-y-3">
                {timeSlots.map((slot, index) => (
                  <div
                    key={slot.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      #{index + 1}
                    </span>

                    <div className="relative flex-1">
                      <input
                        title="time"
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          updateTimeSlot(slot.id, 'startTime', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
                      />
                      {/* <Clock
                        size={16}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                      /> */}
                    </div>

                    <span className="text-sm text-gray-500">to</span>

                    <div className="relative flex-1">
                      <input
                        title="time"
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          updateTimeSlot(slot.id, 'endTime', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
                      />
                      {/* <Clock
                        size={16}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                      /> */}
                    </div>

                    <button
                      title="button"
                      type="button"
                      onClick={() => removeTimeSlot(slot.id)}
                      className="cursor-pointer text-red-500 hover:text-red-600"
                      disabled={timeSlots.length === 1}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-blue-600 dark:text-white">
                Time slots copied to date:{' '}
                <span className="font-semibold">{selectedDate}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between gap-3 border-t pt-4">
              {showDate ? (
                <div className="flex flex-1 items-center gap-3">
                  <input
                    title="select date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleSelectDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  />
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={() => setShowDate(true)}
                  className="h-11 flex-1 bg-blue-600 text-white hover:bg-blue-700"
                >
                  <span>
                    <Calendar size={16} />
                  </span>
                  Copy to Selected Date
                </Button>
              )}

              <Button
                type="button"
                onClick={handleSave}
                className="h-11 flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default TimeSlotConfigModal;
