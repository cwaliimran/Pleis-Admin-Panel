"use client";

import type React from "react";
import { useState } from "react";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  Over,
  Active,
} from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Tag, MapPin } from "lucide-react";
import { CustomDndProvider } from "@/components/providers/DndProvider";
import { DroppableArea } from "@/components/ui/droppable-area";
import { DraggableItem } from "@/components/ui/draggable-item";
import { useDragAndDrop, type ContentItem } from "@/hooks/useDragAndDrop";
import { usePersistentState } from "@/hooks/usePersistentState";

const initialPinnedItems: ContentItem[] = [
  {
    id: "events",
    name: "Events",
    icon: <FolderOpen className="w-4 h-4" />,
    color: "text-blue-600",
  },
  {
    id: "loyalty",
    name: "Loyalty",
    icon: <Tag className="w-4 h-4" />,
    color: "text-yellow-600",
  },
];

const initialAvailableItems: ContentItem[] = [
  {
    id: "highlight",
    name: "Highlight",
    icon: <MapPin className="w-4 h-4" />,
    color: "text-pink-600",
  },
];

export default function PinnedContent() {
  const [pinnedItems, setPinnedItems] =
    useState<ContentItem[]>(initialPinnedItems);
  const [availableItems, setAvailableItems] = useState<ContentItem[]>(
    initialAvailableItems
  );
  const [activeItem, setActiveItem] = useState<ContentItem | null>(null);

  const pinnedDragDrop = useDragAndDrop(pinnedItems, setPinnedItems);
  const availableDragDrop = useDragAndDrop(availableItems, setAvailableItems);

  // Add persistence
  usePersistentState(
    pinnedItems,
    availableItems,
    setPinnedItems,
    setAvailableItems
  );

  const moveToTop = (item: ContentItem) => {
    setAvailableItems((prev) => prev.filter((i) => i.id !== item.id));
    setPinnedItems((prev) => [...prev, item]);
  };

  const moveToBottom = (item: ContentItem) => {
    setPinnedItems((prev) => prev.filter((i) => i.id !== item.id));
    setAvailableItems((prev) => [...prev, item]);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedItem = [...pinnedItems, ...availableItems].find(
      (item) => item.id === active.id
    );
    setActiveItem(draggedItem || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Only handle cross-container moves in dragOver, same-container moves in dragEnd
    if (activeData?.type !== overData?.type) {
      const activeItem = activeData?.item as ContentItem;
      if (!activeItem) return;

      // Don't move immediately, just check if it's a valid operation
      if (
        overData?.type === "pinned" &&
        availableItems.find((item) => item.id === active.id)
      ) {
        // Valid move from available to pinned
        return;
      } else if (
        overData?.type === "available" &&
        pinnedItems.find((item) => item.id === active.id)
      ) {
        // Valid move from pinned to available
        return;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle cross-container moves
    if (activeData?.type !== overData?.type) {
      const activeItem = activeData?.item as ContentItem;
      if (!activeItem) return;

      if (
        overData?.type === "pinned" &&
        availableItems.find((item) => item.id === active.id)
      ) {
        // Move from available to pinned
        setAvailableItems((prev) =>
          prev.filter((item) => item.id !== active.id)
        );
        setPinnedItems((prev) => [...prev, activeItem]);
      } else if (
        overData?.type === "available" &&
        pinnedItems.find((item) => item.id === active.id)
      ) {
        // Move from pinned to available
        setPinnedItems((prev) => prev.filter((item) => item.id !== active.id));
        setAvailableItems((prev) => [...prev, activeItem]);
      }
    } else if (active.id !== over.id) {
      // Handle reordering within the same container
      if (activeData?.type === "pinned") {
        pinnedDragDrop.moveItem(active.id as string, over.id as string);
      } else if (activeData?.type === "available") {
        availableDragDrop.moveItem(active.id as string, over.id as string);
      }
    }
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Pinned Content</h1>
        </div>

        <CustomDndProvider
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          overlay={
            activeItem ? (
              <DraggableItem
                item={activeItem}
                isPinned={pinnedItems.some((item) => item.id === activeItem.id)}
                onTogglePin={() => {}}
                isOverlay={true}
              />
            ) : null
          }
        >
          <Card className="w-full gap-0 max-w-md mx-auto">
            {/* <CardHeader className="mb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Pinned Content
            </CardTitle>
          </CardHeader> */}
            <CardContent className="space-y-6">
              <DroppableArea
                id="pinned"
                items={pinnedItems}
                title="Quick Access Bar"
                isPinned={true}
                onTogglePin={moveToBottom}
                emptyMessage="No pinned items"
              />

              <DroppableArea
                id="available"
                items={availableItems}
                title="Available to Pin"
                isPinned={false}
                onTogglePin={moveToTop}
                emptyMessage="All items are pinned"
              />
            </CardContent>
          </Card>
        </CustomDndProvider>
      </div>
    </>
  );
}
