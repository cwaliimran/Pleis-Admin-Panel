export interface Category {
  id: string;
  name: string;
  type: string;
  priority: string;
  isPinned: boolean;
  isVisible: boolean;
  order: number;
  itemCount: number;
}

export interface CategoryFormData {
  name: string;
  type: string;
  priority: string;
  isPinned: boolean;
  isVisible: boolean;
  selectedOption?: string;
}
