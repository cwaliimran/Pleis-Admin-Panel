import Time24hInput from '@/components/common/time-24h-input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { normalizeTimeTo24 } from '../helpers';
import { ProcessedBooking } from '../types';

interface TimeUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBooking: ProcessedBooking | null;
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onUpdate: () => void;
  isUpdating: boolean;
}

export default function TimeUpdateModal({
  open,
  onOpenChange,
  selectedBooking,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  onUpdate,
  isUpdating,
}: TimeUpdateModalProps) {
  // Check if start and end time are the same
  const isSameTime = !!(startTime && endTime && normalizeTimeTo24(startTime) === normalizeTimeTo24(endTime));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle>Update Booking Time</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2 pb-4">
          <div className="flex items-center justify-start gap-x-2">
            <label className="text-md font-medium">Current Time Slot:</label>
            <div className="text-md font-medium">
              {selectedBooking?.startTime} - {selectedBooking?.endTime}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Time24hInput
                value={startTime}
                onChange={onStartTimeChange}
                placeholder="HH:mm"
                className="w-full border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Time24hInput
                value={endTime}
                onChange={onEndTimeChange}
                placeholder="HH:mm"
                className="w-full border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>
          </div>

          {isSameTime && <p className="text-sm text-red-500">Start time and end time cannot be the same</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating} className="border-gray-300 dark:border-zinc-700">
            Cancel
          </Button>
          <Button onClick={onUpdate} disabled={isUpdating || isSameTime} className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
            {isUpdating ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
