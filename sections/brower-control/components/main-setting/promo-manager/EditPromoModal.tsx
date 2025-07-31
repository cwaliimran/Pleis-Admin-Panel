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
import { useEffect, useState } from "react";
import { EventSelector } from "./EventSelector";
import { PromoEvent } from "./types";

interface EditPromoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingPromo: PromoEvent | null;
  onUpdatePromo: (eventId: number, addToTop10: boolean) => void;
}

export const EditPromoModal = ({
  isOpen,
  onOpenChange,
  editingPromo,
  onUpdatePromo,
}: EditPromoModalProps) => {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [editSearchOpen, setEditSearchOpen] = useState(false);
  const [editAddToTop10, setEditAddToTop10] = useState(false);

  useEffect(() => {
    if (editingPromo) {
      setSelectedEvent(editingPromo.eventId);
      setEditAddToTop10(false);
    }
  }, [editingPromo]);

  const handleEdit = () => {
    if (selectedEvent) {
      onUpdatePromo(selectedEvent, editAddToTop10);
      setSelectedEvent(null);
      setEditAddToTop10(false);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setSelectedEvent(null);
    setEditAddToTop10(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg dark:bg-secondary">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Promo Event
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="edit-event-select"
              className="text-sm font-medium text-gray-700 dark:text-white"
            >
              Select Event
            </Label>
            <EventSelector
              selectedEvent={selectedEvent}
              onEventSelect={setSelectedEvent}
              open={editSearchOpen}
              onOpenChange={setEditSearchOpen}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-add-to-top10"
                checked={editAddToTop10}
                className="border border-blue-500"
                onCheckedChange={(checked) => setEditAddToTop10(!!checked)}
              />
              <Label
                htmlFor="edit-add-to-top10"
                className="text-sm font-medium text-gray-700 dark:text-white cursor-pointer"
              >
                Add To Top 10
              </Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={!selectedEvent}
            >
              Update Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
