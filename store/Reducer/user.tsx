import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from '../customFetchBaseQuery';
import API_ROUTES from '../apiRoutes';

const ADMIN_ACCESS_TOKEN = process.env.NEXT_PUBLIC_ADMIN_ACCESS_TOKEN;

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: customFetchBaseQuery(),
  endpoints: (builder) => ({
    
    // -------------- SUPER ADMIN --------------
    adminLogin: builder.mutation({
      query: (login) => ({
        url: API_ROUTES.LOGIN,
        method: 'POST',
        body: login,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
    }),

    sendOtp: builder.mutation({
      query: (data) => ({
        url: API_ROUTES.RESEND_OTP,
        method: 'POST',
        body: data,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (data) => ({
        url: API_ROUTES.VERIFY_OTP,
        method: 'POST',
        body: data,
      }),
    }),

     resetPassword: builder.mutation({
      query: (data) => ({
        url: API_ROUTES.RESET_PASSWORD,
        method: 'POST',
        body: data,
      }),
    }),

    // -------------- ORGANIZER --------------
    login: builder.mutation({
      query: (login) => ({
        url: API_ROUTES.LOGIN,
        method: 'POST',
        body: login,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useAdminLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = userApi;
