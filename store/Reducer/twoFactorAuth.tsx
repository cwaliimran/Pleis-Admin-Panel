import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const twoFactorAuthApi = createApi({
  reducerPath: 'twoFactorAuthApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['twoFactorAuth'],

  endpoints: (builder) => ({
    addTwoFactorAuth: builder.mutation({
      query: () => ({
        url: API_ROUTES.TWO_FACTOR_AUTH_SETUP,
        method: 'POST',
      }),
    }),

    confirmTwoFactorAuth: builder.mutation({
      query: (token) => ({
        url: API_ROUTES.TWO_FACTOR_AUTH_CONFIRM,
        method: 'POST',
        body: token,
      }),
    }),

    confirmTwoFactorAuthLogin: builder.mutation({
      query: ({ token, headers }) => ({
        url: API_ROUTES.TWO_FACTOR_AUTH_CONFIRM,
        method: 'POST',
        body: { token },
        headers: {
          ...headers, 
        },
      }),
    }),

    disableTwoFactorAuth: builder.mutation({
      query: () => ({
        url: API_ROUTES.TWO_FACTOR_AUTH_DISABLE,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useAddTwoFactorAuthMutation,
  useConfirmTwoFactorAuthMutation,
  useDisableTwoFactorAuthMutation,
  useConfirmTwoFactorAuthLoginMutation,
} = twoFactorAuthApi;
