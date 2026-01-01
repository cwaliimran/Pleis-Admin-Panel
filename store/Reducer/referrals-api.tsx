import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const referralsApi = createApi({
  reducerPath: 'referralsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['referrals', 'globalReferral', 'localReferral'],

  endpoints: (builder) => ({
    getReferrals: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer, isGlobal = false }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        // if (companyOrganizer) params.companyOrganizer = companyOrganizer;
        if (companyOrganizer && !isGlobal) params.companyOrganizer = companyOrganizer;
        return {
          url: API_ROUTES.ADMIN_REFERRALS(isGlobal),
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: (result, error, arg) => {
        if (arg.isGlobal) {
          return ['globalReferral'];
        }
        // Provide both 'referrals' and 'localReferral' tags for local referrals
        return ['referrals', 'localReferral'];
      },
    }),

    /* --------------------------------
    Global Referral Settings Endpoints
    -------------------------------- */

    getGlobalReferralSetting: builder.query({
      query: () => {
        return {
          url: API_ROUTES.ADMIN_GLOBAL_REFERRALS_SETTING,
          method: 'GET',
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['globalReferral'],
    }),

    addGlobalReferralSetting: builder.mutation({
      query: (data) => ({
        url: API_ROUTES.ADMIN_GLOBAL_REFERRALS_SETTING,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['globalReferral'],
    }),

    updateGlobalReferralSetting: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: API_ROUTES.ADMIN_GLOBAL_REFERRALS_SETTING_BY_ID(id),
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['globalReferral'],
    }),

    resetGlobalReferralSetting: builder.mutation({
      query: () => ({
        url: API_ROUTES.ADMIN_GLOBAL_REFERRALS_SETTING_RESET,
        method: 'GET',
        // body: data,
      }),
      invalidatesTags: ['globalReferral'],
    }),

    /* --------------------------------
    Local Referral Settings Endpoints
    -------------------------------- */

    getLocalReferralSetting: builder.query({
      query: ({ companyOrganizer }) => {
        const params: any = {};
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;

        return {
          url: API_ROUTES.ADMIN_LOCAL_REFERRALS_SETTING,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['localReferral'],
    }),

    addLocalReferralSetting: builder.mutation({
      query: (data) => ({
        url: API_ROUTES.ADMIN_LOCAL_REFERRALS_SETTING,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['localReferral'],
    }),

    updateLocalReferralSetting: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: API_ROUTES.ADMIN_LOCAL_REFERRALS_SETTING_BY_ID(id),
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['localReferral'],
    }),

    resetLocalReferralSetting: builder.mutation({
      query: () => ({
        url: API_ROUTES.ADMIN_LOCAL_REFERRALS_SETTING_RESET,
        method: 'GET',
        // body: data,
      }),
      invalidatesTags: ['localReferral'],
    }),
  }),
});

export const {
  useGetReferralsQuery,
  // global
  useGetGlobalReferralSettingQuery,
  useAddGlobalReferralSettingMutation,
  useResetGlobalReferralSettingMutation,
  useUpdateGlobalReferralSettingMutation,
  // local
  useGetLocalReferralSettingQuery,
  useAddLocalReferralSettingMutation,
  useResetLocalReferralSettingMutation,
  useUpdateLocalReferralSettingMutation,
} = referralsApi;
