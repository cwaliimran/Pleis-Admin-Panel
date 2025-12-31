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
import { pinnedContentApi } from './Reducer/pinned-content-api';
import { ticketingApi } from './Reducer/ticketing-api';
import { statusApi } from './Reducer/status-api';
import { streaksApi } from './Reducer/streaks-api';
import { promoCodesApi } from './Reducer/promo-codes-api';
import { loyaltyClubApi } from './Reducer/loyalty-club-api';
import { reservationsApi } from './Reducer/reservations-api';
import { loyaltyTransactionsApi } from './Reducer/loyalty-transactions-api';
import { membersApi } from './Reducer/members-api';
import { levelStatusApi } from './Reducer/level-status-api';
import { bundlesApi } from './Reducer/bundles-api';
import { rewardCategoryApi } from './Reducer/reward-category-api';
import { referralsApi } from './Reducer/referrals-api';
import { thirdPartyApi } from './Reducer/third-party-api';
import { marketingRequestApi } from './Reducer/marketing-request-api';
import { updatesApi } from './Reducer/updates-api';
import { subscriptionsApi } from './Reducer/subscriptions-api';
import { helpersApi } from './Reducer/helpers-api';
import { giveawaysApi } from './Reducer/giveaways-api';
import { qrcodesApi } from './Reducer/qrcodes-api';

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
  [pinnedContentApi.reducerPath]: pinnedContentApi.reducer,
  [ticketingApi.reducerPath]: ticketingApi.reducer,
  [statusApi.reducerPath]: statusApi.reducer,
  [streaksApi.reducerPath]: streaksApi.reducer,
  [promoCodesApi.reducerPath]: promoCodesApi.reducer,
  [loyaltyClubApi.reducerPath]: loyaltyClubApi.reducer,
  [reservationsApi.reducerPath]: reservationsApi.reducer,
  [loyaltyTransactionsApi.reducerPath]: loyaltyTransactionsApi.reducer,
  [membersApi.reducerPath]: membersApi.reducer,
  [levelStatusApi.reducerPath]: levelStatusApi.reducer,
  [bundlesApi.reducerPath]: bundlesApi.reducer,
  [rewardCategoryApi.reducerPath]: rewardCategoryApi.reducer,
  [referralsApi.reducerPath]: referralsApi.reducer,
  [thirdPartyApi.reducerPath]: thirdPartyApi.reducer,
  [marketingRequestApi.reducerPath]: marketingRequestApi.reducer,
  [updatesApi.reducerPath]: updatesApi.reducer,
  [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
  [helpersApi.reducerPath]: helpersApi.reducer,
  [giveawaysApi.reducerPath]: giveawaysApi.reducer,
  [qrcodesApi.reducerPath]: qrcodesApi.reducer,
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
      pinnedContentApi.middleware,
      ticketingApi.middleware,
      statusApi.middleware,
      streaksApi.middleware,
      promoCodesApi.middleware,
      loyaltyClubApi.middleware,
      reservationsApi.middleware,
      loyaltyTransactionsApi.middleware,
      membersApi.middleware,
      levelStatusApi.middleware,
      bundlesApi.middleware,
      rewardCategoryApi.middleware,
      menuListApi.middleware,
      thirdPartyApi.middleware,
      marketingRequestApi.middleware,
      updatesApi.middleware,
      subscriptionsApi.middleware,
      helpersApi.middleware,
      giveawaysApi.middleware,
      qrcodesApi.middleware,
      referralsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
