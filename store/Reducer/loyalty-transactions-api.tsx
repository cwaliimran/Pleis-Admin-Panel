import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const loyaltyTransactionsApi = createApi({
  reducerPath: 'loyaltyTransactionsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['loyalty-transaction', 'loyalty-transaction'],

  endpoints: (builder) => ({
    getLoyaltyTransactions: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer, isGlobal = false, walletType }) => {
        const params: any = {
          page: page + 1,
          limit,
        };
        if (search) (params as any).keyword = search;
        if (status) (params as any).status = status;
        if (date) (params as any).date = date;
        (params as any).walletType = walletType;
        
        // if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
        if (!isGlobal && companyOrganizer) params.companyOrganizer = companyOrganizer;
        return {
          url: API_ROUTES.ADMIN_LOYALTY_TRANSACTIONS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      // providesTags: ['loyalty-transaction'],
      providesTags: (result, error, arg) => (arg.isGlobal ? ['loyalty-transaction'] : ['loyalty-transaction']),
    }),
  }),
});

export const { useGetLoyaltyTransactionsQuery } = loyaltyTransactionsApi;
