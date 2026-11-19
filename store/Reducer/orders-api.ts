import { createApi } from '@reduxjs/toolkit/query/react';
import { AnalyticsScopeArgs, withAnalyticsScope } from '@/utils/analytics-scope-params';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['orders'],
  endpoints: (builder) => ({
    getOrdersAnalytics: builder.query<any, { dateFilter?: string } & AnalyticsScopeArgs>(
      {
        query: ({ dateFilter, ...scope } = {}) => {
          const params: any = withAnalyticsScope({}, scope);
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

    getOrderTransactions: builder.query<any, { page: number; limit: number } & AnalyticsScopeArgs>(
      {
        query: ({ page, limit, ...scope }) => {
          const params: any = withAnalyticsScope({ page, limit }, scope);
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
    
    getMenuItemPerformance: builder.query<any, { page: number; limit: number } & AnalyticsScopeArgs>(
      {
        query: ({ page, limit, ...scope }) => {
          const params: any = withAnalyticsScope({ page, limit }, scope);
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

    getActivePromotions: builder.query<any, { page: number; limit: number; keyword?: string; status?: string } & AnalyticsScopeArgs>(
      {
        // Promotions belong to a company's loyalty club: the super admin sees the
        // selected company's (or every company's) promotions, not Pleis global ones.
        query: ({ page, limit, keyword = '', status = '', companyOrganizer }) => {
          const params: any = { page, limit, keyword, status };
          if (companyOrganizer) params.companyOrganizer = companyOrganizer;
          return {
            url: '',
            method: 'GET',
            params,
          roleBasedRouting: {
            adminRoute: '/admin/loyalty/promotions',
            organizerRoute: '/organizer/loyalty/promotions',
          },
        }
      }}
    ),
    
  }),
});

export const { useGetOrdersAnalyticsQuery, useGetOrderTransactionsQuery, useGetMenuItemPerformanceQuery, useGetActivePromotionsQuery } = ordersApi;
