"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableItem } from "./draggable-item";
import type { ContentItem } from "@/hooks/useDragAndDrop";

interface DroppableAreaProps {
  id: string;
  items: ContentItem[];
  title: string;
  isPinned: boolean;
  onTogglePin: (item: ContentItem) => void;
  emptyMessage: string;
}

export function DroppableArea({
  id,
  items,
  title,
  isPinned,
  onTogglePin,
  emptyMessage,
}: DroppableAreaProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: isPinned ? "pinned" : "available",
      accepts: ["pinned", "available"],
    },
  });

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      <div
        ref={setNodeRef}
        className={`space-y-2 min-h-[80px] p-3 rounded-lg transition-all duration-300 ease-in-out ${
          isOver
            ? "bg-blue-50 border-2 border-blue-300 border-dashed shadow-inner scale-105"
            : isPinned
            ? "bg-gray-25 border border-gray-200"
            : "bg-white border border-gray-100"
        } ${items.length === 0 ? "flex items-center justify-center" : ""}`}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              isPinned={isPinned}
              onTogglePin={onTogglePin}
            />
          ))}
        </SortableContext>
        {items.length === 0 && (
          <div
            className={`text-sm text-gray-500 italic text-center py-4 ${
              isOver ? "text-blue-600 font-medium" : ""
            }`}
          >
            {isOver
              ? `Drop items here to ${isPinned ? "pin" : "unpin"}`
              : emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}
