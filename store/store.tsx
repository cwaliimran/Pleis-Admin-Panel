'use client';

import { configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { categoriesApi } from './Reducer/categories';
import { suppliersApi } from './Reducer/suppliers';
import { tagsApi } from './Reducer/tags';
import { userApi } from './Reducer/user';
import { userAccessApi } from './Reducer/user-access';
import { venueApi } from './Reducer/venue';
import { venueTypeApi } from './Reducer/venueType';
import { userSlice } from './slice/userSlice';

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
    ),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useMockedUser = () => {
  return useSelector((state: RootState) => state.userSlice);
};
