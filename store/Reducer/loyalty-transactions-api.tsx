import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const loyaltyTransactionsApi = createApi({
  reducerPath: 'loyaltyTransactionsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['loyalty-transaction', 'loyalty-transaction'],

  endpoints: (builder) => ({
    getLoyaltyTransactions: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer, isGlobal = false }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        // if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
        if (!isGlobal && companyOrganizer) params.companyOrganizer = companyOrganizer;
        return {
          url: API_ROUTES.ADMIN_LOYALTY_TRANSACTIONS(isGlobal),
          method: 'GET',
          params,
        };
      },
      transformResponse: (res, meta, arg) => ({
        data: arg.isGlobal ? res.data : res.data.transactions,
        meta: res.meta,
      }),
      // providesTags: ['loyalty-transaction'],
      providesTags: (result, error, arg) => (arg.isGlobal ? ['loyalty-transaction'] : ['loyalty-transaction']),
    }),
  }),
});

export const { useGetLoyaltyTransactionsQuery } = loyaltyTransactionsApi;
