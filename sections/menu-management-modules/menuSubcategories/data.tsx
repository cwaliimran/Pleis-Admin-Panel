import { CategoryOption, MenuSubcategoryRecord } from './types';

// TODO(v2-api): replace with real category data once the backend endpoint is ready.
// Shared with sections/menu-management-modules/menuItems — kept here as the single source of truth.
export const mockCategories: CategoryOption[] = [
  { _id: 'cat-1', title: 'Drinks', code: 'PIĆA' },
  { _id: 'cat-2', title: 'Food', code: 'HRANA' },
];

// TODO(v2-api): replace with real subcategory data once the backend endpoint is ready.
// Shared with sections/menu-management-modules/menuItems — kept here as the single source of truth.
// _id values are kept stable with the ones already referenced by mockMenuItemsData.
export const mockSubcategories: MenuSubcategoryRecord[] = [
  { _id: 'subcat-2', title: 'Wines', icon: '🍷', categoryId: 'cat-1', itemsCount: 12, sortOrder: 1, status: 'active', createdAt: '2026-06-01' },
  { _id: 'subcat-4', title: 'Beer & Cider', icon: '🍺', categoryId: 'cat-1', itemsCount: 6, sortOrder: 2, status: 'active', createdAt: '2026-06-01' },
  { _id: 'subcat-5', title: 'Hot Drinks', icon: '☕', categoryId: 'cat-1', itemsCount: 7, sortOrder: 3, status: 'active', createdAt: '2026-06-01' },
  { _id: 'subcat-1', title: 'House Cocktails', icon: '🍹', categoryId: 'cat-1', itemsCount: 8, sortOrder: 4, status: 'active', createdAt: '2026-06-01' },
  { _id: 'subcat-3', title: 'Starters', icon: '🥗', categoryId: 'cat-2', itemsCount: 5, sortOrder: 5, status: 'active', createdAt: '2026-06-01' },
  { _id: 'subcat-6', title: 'Main Courses', icon: '🍗', categoryId: 'cat-2', itemsCount: 8, sortOrder: 6, status: 'active', createdAt: '2026-06-01' },
  { _id: 'subcat-7', title: 'Desserts', icon: '🍰', categoryId: 'cat-2', itemsCount: 4, sortOrder: 7, status: 'active', createdAt: '2026-06-01' },
  { _id: 'subcat-8', title: 'Fast Food Category', categoryId: 'cat-2', itemsCount: 0, sortOrder: 8, status: 'inactive', createdAt: '2026-02-16' },
];
