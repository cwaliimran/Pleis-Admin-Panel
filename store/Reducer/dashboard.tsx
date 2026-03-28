import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['dashboard'],

  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: ({ dateFilter }) => {
        const params: any = {
          dateFilter,
        };

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_DASHBOARD,
            organizerRoute: API_ROUTES.ORGANIZER_DASHBOARD,
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['dashboard'],
    }),

    getLoyaltyDashboard: builder.query({
      query: ({ dateFilter, companyOrganizer }) => {
        const params: any = {
          dateFilter,
        };

        if (companyOrganizer) {
          params.companyOrganizer = companyOrganizer;
        }

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_LOYALTY_DASHBOARD,
            organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_DASHBOARD,
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['dashboard'],
    }),
    
    getGlobalLoyaltyDashboard: builder.query({
      query: ({ dateFilter, companyOrganizer }) => {
        const params: any = {
          dateFilter,
        };

        if (companyOrganizer) {
          params.companyOrganizer = companyOrganizer;
        }

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_GLOBAL_LOYALTY_DASHBOARD,
            // organizerRoute: API_ROUTES.ORGANIZER_GLOBAL_LOYALTY_DASHBOARD,
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['dashboard'],
    }),



  }),
});

export const { useGetDashboardQuery, useGetLoyaltyDashboardQuery, useGetGlobalLoyaltyDashboardQuery } = dashboardApi;
