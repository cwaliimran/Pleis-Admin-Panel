'use client';

import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './Reducer/user';
import { useSelector } from 'react-redux';
import { userSlice } from './slice/userSlice';
import { venueTypeApi } from './Reducer/venueType';
import { suppliersApi } from './Reducer/suppliers';
import { categoriesApi } from './Reducer/categories';
import { tagsApi } from './Reducer/tags';
import { venueApi } from './Reducer/venue';

export const store = configureStore({
  reducer: {
    userSlice: userSlice.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [venueTypeApi.reducerPath]: venueTypeApi.reducer,
    [suppliersApi.reducerPath]: suppliersApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    [venueApi.reducerPath]: venueApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      venueTypeApi.middleware,
      suppliersApi.middleware,
      categoriesApi.middleware,
      tagsApi.middleware,
      venueApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useMockedUser = () => {
  return useSelector((state: RootState) => state.userSlice);
};
