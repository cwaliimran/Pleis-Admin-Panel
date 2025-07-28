import { useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";

export interface ContentItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

export function useDragAndDrop<T extends ContentItem>(
  items: T[],
  setItems: (items: T[]) => void
) {
  const moveItem = useCallback(
    (activeId: string, overId: string) => {
      const activeIndex = items.findIndex((item) => item.id === activeId);
      const overIndex = items.findIndex((item) => item.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        setItems(arrayMove(items, activeIndex, overIndex));
      }
    },
    [items, setItems]
  );

  const moveItemBetweenLists = useCallback(
    (
      item: T,
      targetItems: T[],
      setTargetItems: (items: T[]) => void,
      overId?: string
    ) => {
      // Remove item from source list
      const newSourceItems = items.filter(
        (sourceItem) => sourceItem.id !== item.id
      );
      setItems(newSourceItems);

      // Add item to target list
      const newTargetItems = [...targetItems];
      if (overId) {
        const overIndex = targetItems.findIndex(
          (targetItem) => targetItem.id === overId
        );
        if (overIndex !== -1) {
          newTargetItems.splice(overIndex, 0, item);
        } else {
          newTargetItems.push(item);
        }
      } else {
        newTargetItems.push(item);
      }
      setTargetItems(newTargetItems);
    },
    [items, setItems]
  );

  return {
    moveItem,
    moveItemBetweenLists,
  };
}
