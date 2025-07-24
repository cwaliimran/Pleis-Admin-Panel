"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";

interface DndProviderProps {
  children: React.ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  overlay?: React.ReactNode;
}

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

export function CustomDndProvider({
  children,
  onDragStart,
  onDragOver,
  onDragEnd,
  overlay,
}: DndProviderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before drag starts
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      {children}
      {overlay &&
        createPortal(<DragOverlay>{overlay}</DragOverlay>, document.body)}
    </DndContext>
  );
}
