'use client';

import { configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { categoriesApi } from './Reducer/categories';
import { organizationApi } from './Reducer/organization';
import { suppliersApi } from './Reducer/suppliers';
import { tagsApi } from './Reducer/tags';
import { userApi } from './Reducer/user';
import { userAccessApi } from './Reducer/user-access';
import { venueApi } from './Reducer/venue';
import { venueTypeApi } from './Reducer/venueType';
import { userSlice } from './slice/userSlice';
import { userListApi } from './Reducer/user-list';
import { highlightsApi } from './Reducer/highlights';
import { eventApi } from './Reducer/events';
import { twoFactorAuthApi } from './Reducer/twoFactorAuth';
import { settingsApi } from './Reducer/settings';

export const store = configureStore({
  reducer: (state, action) => {
    if (action.type === 'RESET_APP_STATE') {
      // Reset all slices and RTK Query caches
      return {
        userSlice: userSlice.getInitialState(),
        [userApi.reducerPath]: userApi.reducer(undefined, action),
        [venueTypeApi.reducerPath]: venueTypeApi.reducer(undefined, action),
        [suppliersApi.reducerPath]: suppliersApi.reducer(undefined, action),
        [categoriesApi.reducerPath]: categoriesApi.reducer(undefined, action),
        [tagsApi.reducerPath]: tagsApi.reducer(undefined, action),
        [venueApi.reducerPath]: venueApi.reducer(undefined, action),
        [userAccessApi.reducerPath]: userAccessApi.reducer(undefined, action),
        [organizationApi.reducerPath]: organizationApi.reducer(
          undefined,
          action
        ),
        [userListApi.reducerPath]: userListApi.reducer(undefined, action),
        [highlightsApi.reducerPath]: highlightsApi.reducer(undefined, action),
        [eventApi.reducerPath]: eventApi.reducer(undefined, action),
        [twoFactorAuthApi.reducerPath]: twoFactorAuthApi.reducer(
          undefined,
          action
        ),
        [settingsApi.reducerPath]: settingsApi.reducer(undefined, action),
      };
    }
    return {
      userSlice: userSlice.reducer(state?.userSlice, action),
      [userApi.reducerPath]: userApi.reducer(
        state?.[userApi.reducerPath],
        action
      ),
      [venueTypeApi.reducerPath]: venueTypeApi.reducer(
        state?.[venueTypeApi.reducerPath],
        action
      ),
      [suppliersApi.reducerPath]: suppliersApi.reducer(
        state?.[suppliersApi.reducerPath],
        action
      ),
      [categoriesApi.reducerPath]: categoriesApi.reducer(
        state?.[categoriesApi.reducerPath],
        action
      ),
      [tagsApi.reducerPath]: tagsApi.reducer(
        state?.[tagsApi.reducerPath],
        action
      ),
      [venueApi.reducerPath]: venueApi.reducer(
        state?.[venueApi.reducerPath],
        action
      ),
      [userAccessApi.reducerPath]: userAccessApi.reducer(
        state?.[userAccessApi.reducerPath],
        action
      ),
      [organizationApi.reducerPath]: organizationApi.reducer(
        state?.[organizationApi.reducerPath],
        action
      ),
      [userListApi.reducerPath]: userListApi.reducer(
        state?.[userListApi.reducerPath],
        action
      ),
      [highlightsApi.reducerPath]: highlightsApi.reducer(
        state?.[highlightsApi.reducerPath],
        action
      ),
      [eventApi.reducerPath]: eventApi.reducer(
        state?.[eventApi.reducerPath],
        action
      ),
      [twoFactorAuthApi.reducerPath]: twoFactorAuthApi.reducer(
        state?.[twoFactorAuthApi.reducerPath],
        action
      ),
      [settingsApi.reducerPath]: settingsApi.reducer(
        state?.[settingsApi.reducerPath],
        action
      ),
    };
  },
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
      settingsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useMockedUser = () => {
  return useSelector((state: RootState) => state.userSlice);
};
