// store.ts
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
      settingsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 'use client';

// import { configureStore } from '@reduxjs/toolkit';
// import { useSelector } from 'react-redux';
// import { categoriesApi } from './Reducer/categories';
// import { organizationApi } from './Reducer/organization';
// import { suppliersApi } from './Reducer/suppliers';
// import { tagsApi } from './Reducer/tags';
// import { userApi } from './Reducer/user';
// import { userAccessApi } from './Reducer/user-access';
// import { venueApi } from './Reducer/venue';
// import { venueTypeApi } from './Reducer/venueType';
// import { userSlice } from './slice/userSlice';
// import { userListApi } from './Reducer/user-list';
// import { highlightsApi } from './Reducer/highlights';
// import { eventApi } from './Reducer/events';
// import { twoFactorAuthApi } from './Reducer/twoFactorAuth';
// import { settingsApi } from './Reducer/settings';

// export const store = configureStore({
//   reducer: {
//     userSlice: userSlice.reducer,
//     [userApi.reducerPath]: userApi.reducer,
//     [venueTypeApi.reducerPath]: venueTypeApi.reducer,
//     [suppliersApi.reducerPath]: suppliersApi.reducer,
//     [categoriesApi.reducerPath]: categoriesApi.reducer,
//     [tagsApi.reducerPath]: tagsApi.reducer,
//     [venueApi.reducerPath]: venueApi.reducer,
//     [userAccessApi.reducerPath]: userAccessApi.reducer,
//     [organizationApi.reducerPath]: organizationApi.reducer,
//     [userListApi.reducerPath]: userListApi.reducer,
//     [highlightsApi.reducerPath]: highlightsApi.reducer,
//     [eventApi.reducerPath]: eventApi.reducer,
//     [twoFactorAuthApi.reducerPath]: twoFactorAuthApi.reducer,
//     [settingsApi.reducerPath]: settingsApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(
//       userApi.middleware,
//       venueTypeApi.middleware,
//       suppliersApi.middleware,
//       categoriesApi.middleware,
//       tagsApi.middleware,
//       venueApi.middleware,
//       userAccessApi.middleware,
//       organizationApi.middleware,
//       userListApi.middleware,
//       highlightsApi.middleware,
//       eventApi.middleware,
//       twoFactorAuthApi.middleware,
//       settingsApi.middleware
//     ),
// });

// export type RootState = ReturnType<typeof store.getState>;

// export type AppDispatch = typeof store.dispatch;

// export const useMockedUser = () => {
//   return useSelector((state: RootState) => state.userSlice);
// };
