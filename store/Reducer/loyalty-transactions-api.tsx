import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const loyaltyTransactionsApi = createApi({
  reducerPath: 'loyaltyTransactionsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['loyalty-transaction', 'loyalty-transaction'],

  endpoints: (builder) => ({
    getLoyaltyTransactions: builder.query({
      query: ({ search, page, type, date, limit, companyOrganizer, organization, isGlobal = false, walletType, domainType, startDate, endDate, user, isAdmin }) => {
        const params: any = {
          page: page + 1,
          limit,
        };
        if (search) (params as any).keyword = search;
        if (type) (params as any).type = type;
        if (date) (params as any).date = date;
        (params as any).walletType = walletType;

        if (startDate) (params as any).startDate = startDate;
        if (endDate) (params as any).endDate = endDate;
        if (domainType) (params as any).domainType = domainType;
        if (user) (params as any).user = user;

        // if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
        if (!isGlobal && companyOrganizer) params.companyOrganizer = companyOrganizer;
        if (organization) params.organization = organization;
        
        return {
          url: API_ROUTES.LOYALTY_TRANSACTIONS(isAdmin),
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: (result, error, arg) => (arg.isGlobal ? ['loyalty-transaction'] : ['loyalty-transaction']),
    }),

    getTransactions: builder.query({
      query: ({ search, page, type, date, limit, companyOrganizer, organization, isGlobal = false, walletType, orderType, startDate, endDate, user, isAdmin }) => {
        const params: any = {
          page: page + 1,
          limit,
        };
        if (search) (params as any).keyword = search;
        if (type) (params as any).type = type;
        if (date) (params as any).date = date;
        (params as any).walletType = walletType;

        if (startDate) (params as any).startDate = startDate;
        if (endDate) (params as any).endDate = endDate;
        if (orderType) (params as any).orderType = orderType;
        if (user) (params as any).user = user;

        // if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
        if (!isGlobal && companyOrganizer) params.companyOrganizer = companyOrganizer;
        if (organization) params.organization = organization;
        
        return {
          url: API_ROUTES.TRANSACTIONS(isAdmin),
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data.transactions,
        meta: res.meta,
      }),
      providesTags: (result, error, arg) => (arg.isGlobal ? ['loyalty-transaction'] : ['loyalty-transaction']),
    }),
  }),
});

export const { useGetLoyaltyTransactionsQuery, useGetTransactionsQuery } = loyaltyTransactionsApi;
