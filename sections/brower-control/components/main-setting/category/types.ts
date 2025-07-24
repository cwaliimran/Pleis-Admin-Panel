export interface Category {
  id: string;
  name: string;
  type: "event-1";
  priority: "priority-1";
  isPinned: boolean;
  isVisible: boolean;
  order: number;
  itemCount: number;
}

export interface CategoryFormData {
  name: string;
  type: "event-1";
  priority: "priority-1";
  isPinned: boolean;
  isVisible: boolean;
}
