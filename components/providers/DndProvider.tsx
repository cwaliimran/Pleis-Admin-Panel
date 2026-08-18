"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { RefObject } from "react";
import { createPortal } from "react-dom";

/** Pins the dragged node to its starting column — for list/table rows that only move up and down. */
export const restrictToVerticalAxis: Modifier = ({ transform }) => ({
  ...transform,
  x: 0,
});

/**
 * Clamps the dragged node so it can never travel past the edges of `ref`. Without a bound, dragging
 * a row below the last one runs into the document's auto-scroll and the node keeps sliding away.
 * Pair with `autoScroll={false}` so the measured rects stay valid for the length of the gesture.
 */
export function restrictToBounds(ref: RefObject<HTMLElement | null>): Modifier {
  return ({ transform, draggingNodeRect }) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!draggingNodeRect || !bounds) return transform;

    if (draggingNodeRect.top + transform.y < bounds.top) {
      return { ...transform, y: bounds.top - draggingNodeRect.top };
    }

    if (draggingNodeRect.bottom + transform.y > bounds.bottom) {
      return { ...transform, y: bounds.bottom - draggingNodeRect.bottom };
    }

    return transform;
  };
}

interface DndProviderProps {
  children: React.ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  overlay?: React.ReactNode;
  modifiers?: Modifier[];
  autoScroll?: boolean;
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
  modifiers,
  autoScroll = true,
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
      modifiers={modifiers}
      autoScroll={autoScroll}
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
