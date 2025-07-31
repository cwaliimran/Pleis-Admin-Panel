/* eslint-disable react/forbid-dom-props */
"use client";

import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit, GripVertical, Trash2 } from "lucide-react";
import { PromoEvent } from "./types";

interface DraggablePromoItemProps {
  promo: PromoEvent;
  onEdit: (promo: PromoEvent) => void;
  onDelete: (id: number) => void;
  isOverlay?: boolean;
}

export function DraggablePromoItem({
  promo,
  onEdit,
  onDelete,
  isOverlay = false,
}: DraggablePromoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: promo.id.toString(),
    data: {
      type: "promo",
      promo,
    },
  });

  const className = `bg-white dark:bg-secondary rounded-lg border border-gray-200 p-4 flex items-center justify-between border-l-4 border-l-blue-500 ${
    isDragging ? "opacity-50" : ""
  } hover:shadow-sm transition-shadow`;

  if (isOverlay) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between border-l-4 border-l-blue-500 shadow-lg opacity-95 rotate-1 scale-105">
        <div>
          <h3 className="text-xs font-semibold text-gray-900 ">
            {promo.eventName}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    );
  }

  // Use CSS.Transform for proper drag and drop functionality
  const dragStyle = transform
    ? {
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }
    : {};

  return (
    // eslint-disable-next-line react/forbid-component-props
    <div ref={setNodeRef} className={className} style={dragStyle}>
      <div>
        <h3 className="text-[14px] sm:text-[16px] font-semibold text-gray-900 dark:text-white">
          {promo.eventName}
        </h3>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-100"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(promo)}
          className="text-gray-600 hover:text-blue-600"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(promo.id)}
          className="text-gray-600 hover:text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
