import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['orders'],
  endpoints: (builder) => ({
    getOrdersAnalytics: builder.query<any, { dateFilter?: string , organizations?: string[] }>(
      {
        query: ({ dateFilter, organizations } = {}) => {
          const params: any = {};
          if (organizations) {
            params.organizations = organizations;
          }
          if (dateFilter) {
            params.dateFilter = dateFilter;
          }
          return {
            url: '',
            method: 'GET',
            params,
            roleBasedRouting: {
              adminRoute: '/admin/in-app-ordering/analytics',
            organizerRoute: '/organizer/in-app-ordering/analytics',
          },
        }
        },
        transformResponse: (res: any) => ({
          data: res.data,
        }),
      }
    ),

    getOrderTransactions: builder.query<any, { page: number; limit: number , organizations?: string[] }>(
      {
        query: ({ page, limit, organizations } ) => {
          const params: any = { page, limit };
          if (organizations) {
            params.organizations = organizations;
          }
         return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: '/admin/in-app-ordering/analytics/analytics-transsections',
            organizerRoute: '/organizer/in-app-ordering/analytics/analytics-transsections',
          },
        }},
        }),
    
    getMenuItemPerformance: builder.query<any, { page: number; limit: number ,organizations?: string[] }>(
      {
        query: ({ page, limit, organizations }) => {
          const params: any = { page, limit };
          if (organizations) {
            params.organizations = organizations;
          }
          return {
            url: '',
            method: 'GET',
            params,
            roleBasedRouting: {
              adminRoute: '/admin/in-app-ordering/analytics/menu-item-performance',
              organizerRoute: '/organizer/in-app-ordering/analytics/menu-item-performance',
          },
        }} ,
      }
    ),

    getActivePromotions: builder.query<any, { page: number; limit: number; keyword?: string; status?: string ,organizations?: string[]  }>(
      {
        query: ({ page, limit, keyword = '', status = '', organizations }) => {
          const params: any = { page, limit, keyword, status };
          if (organizations) {
            params.organizations = organizations;
          }
          return {
            url: '',
            method: 'GET',
            params,
          roleBasedRouting: {
            adminRoute: '/admin/global-loyalty/promotions',
            organizerRoute: '/organizer/loyalty/promotions',
          },
        }
      }}
    ),
    
  }),
});

export const { useGetOrdersAnalyticsQuery, useGetOrderTransactionsQuery, useGetMenuItemPerformanceQuery, useGetActivePromotionsQuery } = ordersApi;
