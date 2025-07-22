"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
import type { Category, CategoryFormData } from "./types";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormData) => void;
  category?: Category | null;
  mode: "create" | "edit";
}

export function CategoryModal({
  isOpen,
  onClose,
  onSave,
  category,
  mode,
}: CategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    type: "events",
    isPinned: false,
    isVisible: true,
  });

  useEffect(() => {
    if (category && mode === "edit") {
      setFormData({
        name: category.name,
        type: category.type,
        isPinned: category.isPinned,
        isVisible: category.isVisible,
      });
    } else {
      setFormData({
        name: "",
        type: "events",
        isPinned: false,
        isVisible: true,
      });
    }
  }, [category, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Category Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="experiences">Experiences</SelectItem>
                <SelectItem value="organizers">Organizers</SelectItem>
                <SelectItem value="loyalty">Loyalty Programs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* <Label htmlFor="pinned" className="text-sm font-medium">
                Pin to Homepage
              </Label>
              <Switch
                id="pinned"
                checked={formData.isPinned}
                onCheckedChange={(checked) => setFormData({ ...formData, isPinned: checked })}
              /> */}
              <Input
                id="pinned"
                type="checkbox"
                checked={formData.isPinned}
                onChange={(e) =>
                  setFormData({ ...formData, isPinned: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="pinned" className="text-sm font-medium">
                Pin to Homepage
              </Label>
            </div>

            <div className="flex items-center justify-between">
              {/* <Label htmlFor="visible" className="text-sm font-medium">
                Visible to Users
              </Label>
              <Switch
                id="visible"
                checked={formData.isVisible}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isVisible: checked })
                }
              /> */}
              <Input
                id="visible"
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) =>
                  setFormData({ ...formData, isVisible: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="visible" className="text-sm font-medium">
                Visible to Users
              </Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create Category" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
