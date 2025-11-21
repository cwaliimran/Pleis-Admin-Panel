import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const loyaltyTransactionsApi = createApi({
  reducerPath: 'loyaltyTransactionsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['loyalty-transaction'],

  endpoints: (builder) => ({
    getLoyaltyTransactions: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
        return {
          url: API_ROUTES.ADMIN_LOYALTY_TRANSACTIONS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data.transactions,
        meta: res.meta,
      }),
      providesTags: ['loyalty-transaction'],
    }),
  }),
});

export const { useGetLoyaltyTransactionsQuery } = loyaltyTransactionsApi;
