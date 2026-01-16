import { ApiMenuItem, MenuItem } from './types';

/**
 * Transform API menu item to frontend format
 */
export const transformApiMenuItemToFrontend = (apiItem: ApiMenuItem): MenuItem => {
  // Calculate if item is on sale (has discount)
  const isOnSale = apiItem.discountPrice > 0 && apiItem.discountPrice < apiItem.basePrice;
  const discountValue = isOnSale ? apiItem.basePrice - apiItem.discountPrice : 0;
//   const discountPercent = isOnSale ? Math.round((discountValue / apiItem.basePrice) * 100) : 0;

  return {
    id: apiItem._id,
    name: apiItem.title,
    category: apiItem.category.title,
    categoryId: apiItem.category._id,
    price: apiItem.basePrice,
    discountPrice: apiItem.discountPrice,
    description: apiItem.description,
    imageUrl: apiItem.image,
    isInStock: apiItem.isAvailableInStock,
    isUpsell: apiItem.upSellItem,
    isLimitedTime: apiItem.isLimitedTimeOffer,
    isScheduled: apiItem.isScheduled,
    isPreorder: apiItem.availabilityType !== null,
    soldCount: 0, // Not provided by API
    limitedTimeEnd: apiItem.endDate ? new Date(apiItem.endDate) : undefined,
    availabilityType: apiItem.availabilityType as any,
    taxPercent: apiItem.taxPercent,
    startTime: apiItem.startTime,
    endTime: apiItem.endTime,
    startDate: apiItem.startDate,
    endDate: apiItem.endDate,
    event: apiItem.event
      ? {
          id: apiItem.event._id,
          title: apiItem.event.basicInfo.title,
        }
      : null,
    createdAt: apiItem.createdAt,
    // Sale-related
    isOnSale,
    salePrice: isOnSale ? apiItem.discountPrice : undefined,
    discountType: 'fixed',
    discountValue,
  };
};

/**
 * Transform array of API menu items to frontend format
 */
export const transformApiMenuItemsToFrontend = (apiItems: ApiMenuItem[]): MenuItem[] => {
  return apiItems.map(transformApiMenuItemToFrontend);
};

/**
 * Map frontend tab to API filter parameter
 */
export const mapTabToFilter = (tab: string): string => {
  const mapping: Record<string, string> = {
    all: 'all',
    limited: 'limited',
    upsells: 'upsell',
    'out-of-stock': 'outOfStock',
    'schedule-sale': 'schedule',
  };
  return mapping[tab] || 'all';
};

/**
 * Map frontend sort to API sortBy parameter
 */
export const mapSortToApi = (sort: string): string => {
  const mapping: Record<string, string> = {
    name: 'name',
    'price-low': 'priceLowToHigh',
    'price-high': 'priceHighToLow',
    recent: 'recentlyAdded',
  };
  return mapping[sort] || 'name';
};
