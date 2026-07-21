import { mockMenuItemsData } from '../menuItems/data';
import { mockSubcategories } from '../menuSubcategories/data';

export const getDiscountItems = (itemIds: string[]) =>
  itemIds.map((id) => mockMenuItemsData.find((item) => item._id === id)).filter(Boolean) as typeof mockMenuItemsData;

/**
 * Collapses a full subcategory selection down to "All {Subcategory}" (matching the mockup),
 * otherwise falls back to a comma-separated list of item titles.
 */
export const getAppliesToLabel = (itemIds: string[]): string => {
  const items = getDiscountItems(itemIds);
  if (items.length === 0) return '-';

  const subcategoryIds = new Set(items.map((item) => item.subcategoryId));
  if (subcategoryIds.size === 1) {
    const [subcategoryId] = subcategoryIds;
    const allInSubcategory = mockMenuItemsData.filter((item) => item.subcategoryId === subcategoryId);
    const allIncluded = allInSubcategory.length === items.length && allInSubcategory.every((item) => itemIds.includes(item._id));

    if (allIncluded) {
      const subcategoryTitle = mockSubcategories.find((sub) => sub._id === subcategoryId)?.title;
      return `All ${subcategoryTitle}`;
    }
  }

  return items.map((item) => item.title).join(', ');
};
