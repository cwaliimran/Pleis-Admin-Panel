'use client';

import {
  combineReducers,
  configureStore,
  createAction,
} from '@reduxjs/toolkit';
import { categoriesApi } from './Reducer/categories';
import { eventApi } from './Reducer/events';
import { highlightsApi } from './Reducer/highlights';
import { organizationApi } from './Reducer/organization';
import { settingsApi } from './Reducer/settings';
import { suppliersApi } from './Reducer/suppliers';
import { tagsApi } from './Reducer/tags';
import { twoFactorAuthApi } from './Reducer/twoFactorAuth';
import { userApi } from './Reducer/user';
import { userAccessApi } from './Reducer/user-access';
import { userListApi } from './Reducer/user-list';
import { venueApi } from './Reducer/venue';
import { venueTypeApi } from './Reducer/venueType';
import { userSlice } from './slice/userSlice';
import { presetMenuApi } from './Reducer/preset-menu-api';
import { menuListApi } from './Reducer/menu-list-api';
import { menuItemsApi } from './Reducer/menu-items-api';
import { itemsCategoryApi } from './Reducer/items-category-api';
import { rewardsApi } from './Reducer/rewards-api';
import { promotionApi } from './Reducer/promotion-api';
import { challengesApi } from './Reducer/challenges-api';
import { tiersApi } from './Reducer/tiers-api';
import { promoSectionApi } from './Reducer/promo-section-api';
import { bannerControlApi } from './Reducer/banner-control-api';
import { customCategoriesApi } from './Reducer/custom-categories-api';

export const resetStore = createAction('RESET_STORE');

const appReducer = combineReducers({
  userSlice: userSlice.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [venueTypeApi.reducerPath]: venueTypeApi.reducer,
  [suppliersApi.reducerPath]: suppliersApi.reducer,
  [categoriesApi.reducerPath]: categoriesApi.reducer,
  [tagsApi.reducerPath]: tagsApi.reducer,
  [venueApi.reducerPath]: venueApi.reducer,
  [userAccessApi.reducerPath]: userAccessApi.reducer,
  [organizationApi.reducerPath]: organizationApi.reducer,
  [userListApi.reducerPath]: userListApi.reducer,
  [highlightsApi.reducerPath]: highlightsApi.reducer,
  [eventApi.reducerPath]: eventApi.reducer,
  [twoFactorAuthApi.reducerPath]: twoFactorAuthApi.reducer,
  [settingsApi.reducerPath]: settingsApi.reducer,
  [presetMenuApi.reducerPath]: presetMenuApi.reducer,
  [menuListApi.reducerPath]: menuListApi.reducer,
  [menuItemsApi.reducerPath]: menuItemsApi.reducer,
  [itemsCategoryApi.reducerPath]: itemsCategoryApi.reducer,
  [rewardsApi.reducerPath]: rewardsApi.reducer,
  [promotionApi.reducerPath]: promotionApi.reducer,
  [challengesApi.reducerPath]: challengesApi.reducer,
  [tiersApi.reducerPath]: tiersApi.reducer,
  [promoSectionApi.reducerPath]: promoSectionApi.reducer,
  [bannerControlApi.reducerPath]: bannerControlApi.reducer,
  [customCategoriesApi.reducerPath]: customCategoriesApi.reducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === resetStore.type) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      venueTypeApi.middleware,
      suppliersApi.middleware,
      categoriesApi.middleware,
      tagsApi.middleware,
      venueApi.middleware,
      userAccessApi.middleware,
      organizationApi.middleware,
      userListApi.middleware,
      highlightsApi.middleware,
      eventApi.middleware,
      twoFactorAuthApi.middleware,
      settingsApi.middleware,
      presetMenuApi.middleware,
      menuItemsApi.middleware,
      itemsCategoryApi.middleware,
      rewardsApi.middleware,
      promotionApi.middleware,
      challengesApi.middleware,
      tiersApi.middleware,
      promoSectionApi.middleware,
      bannerControlApi.middleware,
      customCategoriesApi.middleware,
      menuListApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
