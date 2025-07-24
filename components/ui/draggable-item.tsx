"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { X, Plus, GripVertical } from "lucide-react";
import type { ContentItem } from "@/hooks/useDragAndDrop";

interface DraggableItemProps {
  item: ContentItem;
  isPinned: boolean;
  onTogglePin: (item: ContentItem) => void;
  isOverlay?: boolean;
}

export function DraggableItem({
  item,
  isPinned,
  onTogglePin,
  isOverlay = false,
}: DraggableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: item.id,
    data: {
      type: isPinned ? "pinned" : "available",
      item,
    },
  });

  const transformStyle = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging
      ? "none"
      : transition || "transform 200ms cubic-bezier(0.25, 1, 0.5, 1)",
  };

  if (isOverlay) {
    return (
      <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg shadow-lg drag-item drag-overlay">
        <div className="flex items-center gap-3">
          <div className="cursor-grab">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <div className={item.color}>{item.icon}</div>
          <span className="text-sm font-medium text-gray-900">{item.name}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center justify-between p-2 ${
        isPinned ? "bg-gray-50" : "bg-white border border-gray-200"
      } rounded-lg drag-item ${
        isDragging
          ? "dragging opacity-40 scale-95 z-50"
          : isOver
          ? "scale-105 shadow-md ring-2 ring-blue-300 ring-opacity-50"
          : "hover:scale-102 hover:shadow-sm"
      } ${isPinned ? "hover:bg-gray-100" : "hover:bg-gray-50"}`}
      style={transformStyle}
    >
      <div className="flex items-center gap-3">
        <div
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <div className={item.color}>{item.icon}</div>
        <span className="text-sm font-medium text-gray-900">{item.name}</span>
      </div>
      {/* <Button
        variant="ghost"
        size="sm"
        className={`h-6 w-6 p-0 transition-all duration-200 ${
          isPinned
            ? "hover:bg-red-100 hover:scale-110 cursor-pointer"
            : "hover:bg-green-100 hover:scale-110 cursor-pointer"
        }`}
        onClick={() => onTogglePin(item)}
      >
        {isPinned ? (
          <X className="w-3 h-3 text-red-500" />
        ) : (
          <Plus className="w-3 h-3 text-green-500" />
        )}
      </Button> */}
    </div>
  );
}
