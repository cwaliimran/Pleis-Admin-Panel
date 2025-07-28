/* eslint-disable react/forbid-dom-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
/* eslint-disable @next/next/no-css-tags */
"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CustomDndProvider } from "@/components/providers/DndProvider";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for events
const mockEvents = [
  {
    id: 1,
    name: "Summer Music Festival",
    category: "Music",
    date: "2024-07-15",
  },
  {
    id: 2,
    name: "Tech Conference 2024",
    category: "Technology",
    date: "2024-08-20",
  },
  { id: 3, name: "Food & Wine Expo", category: "Food", date: "2024-09-10" },
  { id: 4, name: "Art Gallery Opening", category: "Art", date: "2024-07-25" },
  {
    id: 5,
    name: "Marathon Championship",
    category: "Sports",
    date: "2024-10-05",
  },
  {
    id: 6,
    name: "Business Networking",
    category: "Business",
    date: "2024-08-15",
  },
  {
    id: 7,
    name: "Comedy Night Special",
    category: "Entertainment",
    date: "2024-09-20",
  },
  {
    id: 8,
    name: "Photography Workshop",
    category: "Education",
    date: "2024-11-12",
  },
  {
    id: 9,
    name: "Charity Gala Dinner",
    category: "Charity",
    date: "2024-12-01",
  },
  {
    id: 10,
    name: "Winter Sports Festival",
    category: "Sports",
    date: "2024-12-15",
  },
  {
    id: 11,
    name: "Jazz Concert Series",
    category: "Music",
    date: "2024-11-30",
  },
  {
    id: 12,
    name: "Startup Pitch Competition",
    category: "Business",
    date: "2024-10-18",
  },
  {
    id: 13,
    name: "Fashion Week Showcase",
    category: "Fashion",
    date: "2024-09-25",
  },
  {
    id: 14,
    name: "Science Fair Exhibition",
    category: "Education",
    date: "2024-11-08",
  },
  {
    id: 15,
    name: "International Book Fair",
    category: "Literature",
    date: "2024-10-22",
  },
  {
    id: 16,
    name: "Green Energy Summit",
    category: "Environment",
    date: "2024-08-28",
  },
  {
    id: 17,
    name: "Kids Coding Bootcamp",
    category: "Education",
    date: "2024-09-05",
  },
  {
    id: 18,
    name: "Cultural Dance Parade",
    category: "Culture",
    date: "2024-07-30",
  },
  {
    id: 19,
    name: "Vintage Car Show",
    category: "Automotive",
    date: "2024-11-20",
  },
  {
    id: 20,
    name: "Health & Wellness Expo",
    category: "Health",
    date: "2024-12-10",
  },
];

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
          <h3 className="font-semibold text-gray-900">{promo.eventName}</h3>
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
        <h3 className="font-semibold text-gray-900 dark:text-white">{promo.eventName}</h3>
      </div>
      <div className="flex items-center space-x-2">
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

const ViewAllPromos = () => {
  const [promoEvents, setPromoEvents] = useState<PromoEvent[]>([
    { id: 1, eventId: 1, eventName: "Summer Music Festival", position: 1 },
    { id: 2, eventId: 2, eventName: "Tech Conference 2024", position: 2 },
    { id: 3, eventId: 3, eventName: "Food & Wine Expo", position: 3 },
    { id: 4, eventId: 4, eventName: "Art Gallery Opening", position: 4 },
    { id: 5, eventId: 5, eventName: "Marathon Championship", position: 5 },
    { id: 6, eventId: 6, eventName: "Business Networking", position: 6 },
    { id: 7, eventId: 7, eventName: "Comedy Night Special", position: 7 },
    { id: 8, eventId: 8, eventName: "Photography Workshop", position: 8 },
    { id: 9, eventId: 9, eventName: "Charity Gala Dinner", position: 9 },
    { id: 10, eventId: 10, eventName: "Winter Sports Festival", position: 10 },
    { id: 11, eventId: 11, eventName: "Jazz Concert Series", position: 11 },
    {
      id: 12,
      eventId: 12,
      eventName: "Startup Pitch Competition",
      position: 12,
    },
    { id: 13, eventId: 13, eventName: "Fashion Week Showcase", position: 13 },
    { id: 14, eventId: 14, eventName: "Science Fair Exhibition", position: 14 },
    { id: 15, eventId: 15, eventName: "International Book Fair", position: 15 },
    { id: 16, eventId: 16, eventName: "Green Energy Summit", position: 16 },
    { id: 17, eventId: 17, eventName: "Kids Coding Bootcamp", position: 17 },
    { id: 18, eventId: 18, eventName: "Cultural Dance Parade", position: 18 },
    { id: 19, eventId: 19, eventName: "Vintage Car Show", position: 19 },
    { id: 20, eventId: 20, eventName: "Health & Wellness Expo", position: 20 },
  ]);

  const router = useRouter();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [editingPromo, setEditingPromo] = useState<PromoEvent | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [editSearchOpen, setEditSearchOpen] = useState(false);
  const [activePromo, setActivePromo] = useState<PromoEvent | null>(null);
  const [addToTop10, setAddToTop10] = useState(false);
  const [editAddToTop10, setEditAddToTop10] = useState(false);

  const handleCreate = () => {
    if (selectedEvent) {
      const event = mockEvents.find((e) => e.id === selectedEvent);
      if (event) {
        const newPromo: PromoEvent = {
          id: Date.now(),
          eventId: event.id,
          eventName: event.name,
          position: promoEvents.length + 1,
        };
        setPromoEvents([...promoEvents, newPromo]);
        setSelectedEvent(null);
        setAddToTop10(false);
        setIsCreateModalOpen(false);
      }
    }
  };

  const handleEdit = () => {
    if (editingPromo && selectedEvent) {
      const event = mockEvents.find((e) => e.id === selectedEvent);
      if (event) {
        setPromoEvents(
          promoEvents.map((p) =>
            p.id === editingPromo.id
              ? { ...p, eventId: event.id, eventName: event.name }
              : p
          )
        );
        setEditingPromo(null);
        setSelectedEvent(null);
        setEditAddToTop10(false);
        setIsEditModalOpen(false);
        setIsViewAllModalOpen(false);
      }
    }
  };

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
      <div className="p-0 pb-12">
        <div className="max-w-full mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              All Promos ({promoEvents.length})
            </h1>

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

                    <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={searchOpen}
                          className="w-full justify-between h-11 px-3 bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        >
                          <span
                            className={
                              selectedEvent ? "text-gray-900 dark:text-white" : "text-gray-500"
                            }
                          >
                            {selectedEvent
                              ? mockEvents.find(
                                  (event) => event.id === selectedEvent
                                )?.name
                              : "Search and select an event..."}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-full p-0 border-gray-200 shadow-lg"
                        style={{ width: "var(--radix-popover-trigger-width)" }}
                        onWheel={(e) => e.stopPropagation()}
                      >
                        <Command className="rounded-lg w-full dark:bg-secondary">
                          <CommandInput
                            placeholder="Search events..."
                            className="border-0 focus:ring-0 focus:outline-none h-11 w-full"
                          />
                          <div
                            className="max-h-[240px] overflow-hidden"
                            onWheel={(e) => {
                              e.stopPropagation();
                              const commandList =
                                e.currentTarget.querySelector("[cmdk-list]");
                              if (commandList) {
                                commandList.scrollTop += e.deltaY;
                              }
                            }}
                          >
                            <CommandList className="max-h-[240px] overflow-y-auto">
                              <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                                No event found.
                              </CommandEmpty>
                              <CommandGroup>
                                {mockEvents.map((event) => (
                                  <CommandItem
                                    key={event.id}
                                    value={event.name}
                                    onSelect={() => {
                                      setSelectedEvent(event.id);
                                      setSearchOpen(false);
                                    }}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-50 dark:bg-secondary data-[selected]:bg-gray-50"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-3 h-4 w-4 text-blue-600",
                                        selectedEvent === event.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <div className="flex flex-col">
                                      <span className="font-medium text-gray-900 dark:text-white">
                                        {event.name}
                                      </span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {event.category} • {event.date}
                                      </span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </div>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1"
                    >
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
          </div>

          {/* Promo Events List */}
          <SortableContext
            items={displayedEvents.map((promo) => promo.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Search by event name..."
                  className="w-full rounded-lg border px-3 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    bg-white border-gray-300  text-gray-900 placeholder-gray-400
                    dark:bg-secondary dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                />
              </div>
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

          {/* Edit Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
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
                  <Popover
                    open={editSearchOpen}
                    onOpenChange={setEditSearchOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={editSearchOpen}
                        className="w-full justify-between h-11 px-3 bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      >
                        <span
                          className={
                            selectedEvent ? "text-gray-900 dark:text-white" : "text-gray-500"
                          }
                        >
                          {selectedEvent
                            ? mockEvents.find(
                                (event) => event.id === selectedEvent
                              )?.name
                            : "Search and select an event..."}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-0 border-gray-200 shadow-lg dark:bg-secondary"
                      style={{ width: "var(--radix-popover-trigger-width)" }}
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <Command className="rounded-lg dark:bg-secondary">
                        <CommandInput
                          placeholder="Search events..."
                          className="border-0 focus:ring-0 focus:outline-none h-11"
                        />
                        <div
                          className="max-h-[240px] overflow-hidden"
                          onWheel={(e) => {
                            e.stopPropagation();
                            const commandList =
                              e.currentTarget.querySelector("[cmdk-list]");
                            if (commandList) {
                              commandList.scrollTop += e.deltaY;
                            }
                          }}
                        >
                          <CommandList className="max-h-[240px] overflow-y-auto">
                            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                              No event found.
                            </CommandEmpty>
                            <CommandGroup>
                              {mockEvents.map((event) => (
                                <CommandItem
                                  key={event.id}
                                  value={event.name}
                                  onSelect={() => {
                                    setSelectedEvent(event.id);
                                    setEditSearchOpen(false);
                                  }}
                                  className="px-3 py-2 cursor-pointer hover:bg-gray-50 dark:bg-secondary data-[selected]:bg-gray-50"
                                >
                                  <Check
                                    className={cn(
                                      "mr-3 h-4 w-4 text-blue-600",
                                      selectedEvent === event.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      {event.name}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {event.category} • {event.date}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </div>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-add-to-top10"
                      checked={editAddToTop10}
                      className="border border-blue-500"
                      onCheckedChange={(checked) =>
                        setEditAddToTop10(!!checked)
                      }
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
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setIsViewAllModalOpen(false);
                    }}
                    className="flex-1"
                  >
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
        </div>
      </div>
    </CustomDndProvider>
  );
};

export default ViewAllPromos;
