export interface Category {
  id: string;
  name: string;
  type: "events" | "experiences" | "organizers" | "loyalty";
  isPinned: boolean;
  isVisible: boolean;
  order: number;
  itemCount: number;
}

export interface CategoryFormData {
  name: string;
  type: "events" | "experiences" | "organizers" | "loyalty";
  isPinned: boolean;
  isVisible: boolean;
}
