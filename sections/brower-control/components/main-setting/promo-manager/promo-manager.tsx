/* eslint-disable react/forbid-dom-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
/* eslint-disable @next/next/no-css-tags */
"use client";

import { CustomDndProvider } from "@/components/providers/DndProvider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreatePromoModal } from "./CreatePromoModal";
import { DraggablePromoItem } from "./DraggablePromoItem";
import { EditPromoModal } from "./EditPromoModal";
import { PromoEvent, mockEvents } from "./types";

const PromoManager = () => {
  const [promoEvents, setPromoEvents] = useState<PromoEvent[]>([
    { id: 1, eventId: 1, eventName: "Summer Music Festival", position: 1 },
    { id: 2, eventId: 2, eventName: "Tech Conference 2024", position: 2 },
    { id: 3, eventId: 3, eventName: "Food & Wine Expo", position: 3 },
    { id: 4, eventId: 4, eventName: "Art Gallery Opening", position: 4 },
    { id: 5, eventId: 5, eventName: "Marathon Championship", position: 5 },
    { id: 6, eventId: 6, eventName: "Business Networking", position: 6 },
    { id: 7, eventId: 7, eventName: "Comedy Night Special", position: 7 },
    { id: 8, eventId: 8, eventName: "Photography Workshop", position: 8 },
    { id: 9, eventId: 9, eventName: "Photography Workshop", position: 9 },
    { id: 10, eventId: 10, eventName: "Photography Workshop", position: 10 },
    { id: 11, eventId: 11, eventName: "Photography Workshop", position: 11 },
    { id: 12, eventId: 12, eventName: "Photography Workshop", position: 12 },
  ]);

  const router = useRouter();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoEvent | null>(null);
  const [activePromo, setActivePromo] = useState<PromoEvent | null>(null);

  const handleCreatePromo = (eventId: number, addToTop10: boolean) => {
    const event = mockEvents.find((e) => e.id === eventId);
    if (event) {
      const newPromo: PromoEvent = {
        id: Date.now(),
        eventId: event.id,
        eventName: event.name,
        position: promoEvents.length + 1,
      };
      setPromoEvents([...promoEvents, newPromo]);
    }
  };

  const handleUpdatePromo = (eventId: number, addToTop10: boolean) => {
    if (editingPromo) {
      const event = mockEvents.find((e) => e.id === eventId);
      if (event) {
        setPromoEvents(
          promoEvents.map((p) =>
            p.id === editingPromo.id
              ? { ...p, eventId: event.id, eventName: event.name }
              : p
          )
        );
        setEditingPromo(null);
      }
    }
  };

  const handleDelete = (id: number) => {
    setPromoEvents(promoEvents.filter((p) => p.id !== id));
  };

  const openEditModal = (promo: PromoEvent) => {
    setEditingPromo(promo);
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

  const navigateToAllPromos = () => {
    router.push("/super-admin/browser-control/all-promos");
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
          <div className="flex justify-between flex-col sm:flex-row gap-y-2 items-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold w-full sm:w-auto text-center sm:text-start text-gray-900 dark:text-white">
              Top 10 / Promo Section
            </h1>

            <div>
              <Dialog
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="rounded-full bg-primary px-3 hover:shadow-lg shadow-blue-200 transition-shadow duration-300 cursor-pointer text-white hover:bg-primary">
                    <Plus className="w-4 h-4 mr-1" />
                    New Promo
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
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

          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={navigateToAllPromos}
              className="px-6 py-2 border-gray-300 hover:border-gray-400 bg-white"
            >
              View All
            </Button>
          </div>

          {/* Modals */}
          <CreatePromoModal
            isOpen={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            onCreatePromo={handleCreatePromo}
          />

          <EditPromoModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            editingPromo={editingPromo}
            onUpdatePromo={handleUpdatePromo}
          />
        </div>
      </div>
    </CustomDndProvider>
  );
};

export default PromoManager;
