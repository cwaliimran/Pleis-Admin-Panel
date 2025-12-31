import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const referralsApi = createApi({
  reducerPath: 'referralsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['referrals', 'globalReferral'],

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
        if (!isGlobal && companyOrganizer) params.companyOrganizer = companyOrganizer;
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
      providesTags: (result, error, arg) => (arg.isGlobal ? ['globalReferral'] : ['referrals']),
    }),

    getGlobalReferralSetting: builder.query({
      query: ({}) => {
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

    resetGlobalReferralSetting: builder.mutation({
      query: () => ({
        url: API_ROUTES.ADMIN_GLOBAL_REFERRALS_SETTING_RESET,
        method: 'GET',
        // body: data,
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
  }),
});

export const {
  useGetReferralsQuery,
  useGetGlobalReferralSettingQuery,
  useAddGlobalReferralSettingMutation,
  useResetGlobalReferralSettingMutation,
  useUpdateGlobalReferralSettingMutation,
} = referralsApi;
