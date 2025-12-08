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

    getReferralSetting: builder.query({
      query: ({ isGlobal = false, companyOrganizer }) => {
        const params: any = {};
        if (!isGlobal && companyOrganizer) params.companyOrganizer = companyOrganizer;
        return {
          url: API_ROUTES.ADMIN_REFERRALS_SETTING(isGlobal),
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
  }),
});

export const { useGetReferralsQuery, useGetReferralSettingQuery } = referralsApi;
