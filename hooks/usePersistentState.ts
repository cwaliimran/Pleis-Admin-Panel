import { useEffect, createElement } from "react";
import { FolderOpen, Tag, MapPin } from "lucide-react";
import type { ContentItem } from "./useDragAndDrop";

const STORAGE_KEY = "pinnedContent";

export interface PinnedContentState {
  pinnedItems: ContentItem[];
  availableItems: ContentItem[];
}

export function usePersistentState(
  pinnedItems: ContentItem[],
  availableItems: ContentItem[],
  setPinnedItems: (items: ContentItem[]) => void,
  setAvailableItems: (items: ContentItem[]) => void
) {
  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState: PinnedContentState = JSON.parse(savedState);

        // Reconstruct the React elements for icons
        const reconstructItems = (items: any[]) =>
          items.map((item) => ({
            ...item,
            icon:
              item.iconType === "FolderOpen"
                ? createElement(FolderOpen, { className: "w-4 h-4" })
                : item.iconType === "Tag"
                ? createElement(Tag, { className: "w-4 h-4" })
                : item.iconType === "MapPin"
                ? createElement(MapPin, { className: "w-4 h-4" })
                : null,
          }));

        setPinnedItems(reconstructItems(parsedState.pinnedItems));
        setAvailableItems(reconstructItems(parsedState.availableItems));
      }
    } catch (error) {
      console.error("Failed to load pinned content state:", error);
    }
  }, [setPinnedItems, setAvailableItems]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      // Serialize the state, converting React elements to strings
      const serializableState: PinnedContentState = {
        pinnedItems: pinnedItems.map((item) => ({
          ...item,
          icon: null, // Remove React element
          iconType:
            item.id === "events"
              ? "FolderOpen"
              : item.id === "loyalty"
              ? "Tag"
              : item.id === "highlight"
              ? "MapPin"
              : "Unknown",
        })),
        availableItems: availableItems.map((item) => ({
          ...item,
          icon: null, // Remove React element
          iconType:
            item.id === "events"
              ? "FolderOpen"
              : item.id === "loyalty"
              ? "Tag"
              : item.id === "highlight"
              ? "MapPin"
              : "Unknown",
        })),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableState));
    } catch (error) {
      console.error("Failed to save pinned content state:", error);
    }
  }, [pinnedItems, availableItems]);

  const clearSavedState = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return { clearSavedState };
}
