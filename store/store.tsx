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
  reducer: {
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
