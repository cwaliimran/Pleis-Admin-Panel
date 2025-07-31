"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { EventSelector } from "./EventSelector";

interface CreatePromoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePromo: (eventId: number, addToTop10: boolean) => void;
}

export const CreatePromoModal = ({
  isOpen,
  onOpenChange,
  onCreatePromo,
}: CreatePromoModalProps) => {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [addToTop10, setAddToTop10] = useState(false);

  const handleCreate = () => {
    if (selectedEvent) {
      onCreatePromo(selectedEvent, addToTop10);
      setSelectedEvent(null);
      setAddToTop10(false);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setSelectedEvent(null);
    setAddToTop10(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg dark:bg-secondary">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Add New Promo Event
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="event-select"
              className="text-sm font-medium text-gray-700 dark:text-white"
            >
              Select Event
            </Label>
            <EventSelector
              selectedEvent={selectedEvent}
              onEventSelect={setSelectedEvent}
              open={searchOpen}
              onOpenChange={setSearchOpen}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="add-to-top10"
                className="border border-blue-500"
                checked={addToTop10}
                onCheckedChange={(checked) => setAddToTop10(!!checked)}
              />
              <Label
                htmlFor="add-to-top10"
                className="text-sm font-medium text-gray-700 dark:text-white cursor-pointer"
              >
                Add To Top 10
              </Label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={!selectedEvent}
            >
              Add Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
