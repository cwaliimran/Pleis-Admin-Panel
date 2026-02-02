import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface MultiDatePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDates: Date[];
  onDateSelect: (dates: Date[] | undefined) => void;
  selectedCalendarDate: Date;
  onConfirm: () => void;
  onCancel: () => void;
  isCopying: boolean;
}

export default function MultiDatePickerModal({
  open,
  onOpenChange,
  selectedDates,
  onDateSelect,
  selectedCalendarDate,
  onConfirm,
  onCancel,
  isCopying,
}: MultiDatePickerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onSelect={onDateSelect}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const checkDate = new Date(date);
              checkDate.setHours(0, 0, 0, 0);
              const selected = new Date(selectedCalendarDate);
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
                  <Badge key={idx} variant="secondary" className="bg-black text-xs text-white dark:bg-white dark:text-black">
                    {date instanceof Date ? format(date, 'dd-MM-yy') : String(date)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} className="border-gray-300 dark:border-zinc-700">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={selectedDates.length === 0 || isCopying}
            className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isCopying ? 'Copying...' : `Confirm (${selectedDates.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
