/* eslint-disable react/forbid-dom-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
/* eslint-disable @next/next/no-css-tags */
"use client";

import { GripVertical } from "lucide-react";
import { useState } from "react";

import { CustomDndProvider } from "@/components/providers/DndProvider";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PromoEvent {
  id: number;
  eventId: number;
  eventName: string;
  position: number;
}

// Draggable Promo Item Component
interface DraggablePromoItemProps {
  promo: PromoEvent;
  onEdit: (promo: PromoEvent) => void;
  onDelete: (id: number) => void;
  isOverlay?: boolean;
}

function DraggablePromoItem({
  promo,
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
          <h3 className="font-semibold text-gray-900 ">{promo.eventName}</h3>
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
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {promo.eventName}
        </h3>
      </div>
      <div className="flex items-center space-x-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-100"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}

const QuickAccess = () => {
  const [promoEvents, setPromoEvents] = useState<PromoEvent[]>([
    { id: 1, eventId: 1, eventName: "Quick Access Bar 1", position: 1 },
    { id: 2, eventId: 2, eventName: "Quick Access Bar 2", position: 2 },
    { id: 3, eventId: 3, eventName: "Quick Access Bar 3", position: 3 },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [editingPromo, setEditingPromo] = useState<PromoEvent | null>(null);
  const [activePromo, setActivePromo] = useState<PromoEvent | null>(null);
  const [editAddToTop10, setEditAddToTop10] = useState(false);

  console.log(
    isEditModalOpen,
    selectedEvent,
    editingPromo,
    activePromo,
    editAddToTop10
  );

  // const handleCreate = () => {
  //   if (selectedEvent) {
  //     const event = mockEvents.find((e) => e.id === selectedEvent);
  //     if (event) {
  //       const newPromo: PromoEvent = {
  //         id: Date.now(),
  //         eventId: event.id,
  //         eventName: event.name,
  //         position: promoEvents.length + 1,
  //       };
  //       setPromoEvents([...promoEvents, newPromo]);
  //       setSelectedEvent(null);
  //       setAddToTop10(false);
  //       setIsCreateModalOpen(false);
  //     }
  //   }
  // };

  // const handleEdit = () => {
  //   if (editingPromo && selectedEvent) {
  //     const event = mockEvents.find((e) => e.id === selectedEvent);
  //     if (event) {
  //       setPromoEvents(
  //         promoEvents.map((p) =>
  //           p.id === editingPromo.id
  //             ? { ...p, eventId: event.id, eventName: event.name }
  //             : p
  //         )
  //       );
  //       setEditingPromo(null);
  //       setSelectedEvent(null);
  //       setEditAddToTop10(false);
  //       setIsEditModalOpen(false);
  //       setIsViewAllModalOpen(false);
  //     }
  //   }
  // };

  const handleDelete = (id: number) => {
    setPromoEvents(promoEvents.filter((p) => p.id !== id));
  };

  const openEditModal = (promo: PromoEvent) => {
    setEditingPromo(promo);
    setSelectedEvent(promo.eventId);
    setEditAddToTop10(false);
    setIsEditModalOpen(true);
  };

  // Drag and Drop Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedPromo = promoEvents.find(
      (promo) => promo.id.toString() === active.id
    );
    setActivePromo(draggedPromo || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActivePromo(null);

    if (!over || active.id === over.id) return;

    const activeIndex = promoEvents.findIndex(
      (promo) => promo.id.toString() === active.id
    );
    const overIndex = promoEvents.findIndex(
      (promo) => promo.id.toString() === over.id
    );

    if (activeIndex !== -1 && overIndex !== -1) {
      const newPromoEvents = arrayMove(promoEvents, activeIndex, overIndex);

      // Update positions
      const updatedPromoEvents = newPromoEvents.map((promo, index) => ({
        ...promo,
        position: index + 1,
      }));

      setPromoEvents(updatedPromoEvents);
    }
  };

  const displayedEvents = promoEvents.slice(0, 10);

  return (
    <CustomDndProvider
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      overlay={
        activePromo ? (
          <DraggablePromoItem
            promo={activePromo}
            onEdit={() => {}}
            onDelete={() => {}}
            isOverlay={true}
          />
        ) : null
      }
    >
      <div className="p-0">
        <div className="max-w-full mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quick Access
            </h1>
          </div>

          {/* Promo Events List */}
          <SortableContext
            items={displayedEvents.map((promo) => promo.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {displayedEvents.map((promo) => (
                <DraggablePromoItem
                  key={promo.id}
                  promo={promo}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      </div>
    </CustomDndProvider>
  );
};

export default QuickAccess;
