import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const loyaltyTransactionsApi = createApi({
  reducerPath: 'loyaltyTransactionsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['loyalty-transaction', 'loyalty-transaction'],

  endpoints: (builder) => ({
    getLoyaltyTransactions: builder.query({
      query: ({
        search,
        sourceEntity,
        page,
        type,
        date,
        limit,
        companyOrganizer,
        organization,
        isGlobal = false,
        walletType,
        domainType,
        startDate,
        endDate,
        startPoints,
        endPoints,
        balance,
        startBalance,
        endBalance,
        campaign,
        referral,
        purchaseBased,
        streakBased,
        challengeBased,
        promotionBased,
        user,
        isAdmin,
      }) => {
        const params: any = {
          page: page + 1,
          limit,
        };
        if (search) (params as any).keyword = search;
        // if (sourceEntity) (params as any).sourceEntity = sourceEntity;
        if (sourceEntity) (params as any).entityId = sourceEntity;
        if (type) (params as any).type = type;
        if (date) (params as any).date = date;
        (params as any).walletType = walletType;

        if (startDate) (params as any).startDate = startDate;
        if (endDate) (params as any).endDate = endDate;
        if (startPoints !== undefined && startPoints !== '') (params as any).startPoints = startPoints;
        if (endPoints !== undefined && endPoints !== '') (params as any).endPoints = endPoints;
        if (balance !== undefined && balance !== '') (params as any).balance = balance;
        if (startBalance !== undefined && startBalance !== '') (params as any).startBalance = startBalance;
        if (endBalance !== undefined && endBalance !== '') (params as any).endBalance = endBalance;
        if (campaign) (params as any).campaign = campaign;
        if (referral) (params as any).referral = true;
        if (purchaseBased) (params as any).purchaseBased = true;
        if (streakBased) (params as any).streakBased = true;
        if (challengeBased) (params as any).challengeBased = true;
        if (promotionBased) (params as any).promotionBased = true;
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
      query: ({
        search,
        page,
        type,
        date,
        limit,
        status,
        companyOrganizer,
        organization,
        isGlobal = false,
        walletType,
        orderType,
        tier,
        paymentMethod,
        event,
        startAmount,
        endAmount,
        startDate,
        endDate,
        user,
        validationStatus,
        transfered,
        sent,
        refunded,
        resStartDate,
        resEndDate,
        resDate,
        resStartTime,
        resEndTime,
        futureRes,
        pastRes,
        paidRes,
        minimalSpendRes,
        prePay,
        ticketRequiredRes,
        cancelledRes,
        noShowRes,
        isAdmin,
      }) => {
        const params: any = {
          page: page + 1,
          limit,
        };
        if (search) (params as any).keyword = search;
        if (type) (params as any).type = type;
        if (status) (params as any).status = status;
        if (date) (params as any).date = date;
        (params as any).walletType = walletType;

        if (paymentMethod) (params as any).paymentMethod = paymentMethod;
        if (tier && String(tier).toLowerCase() !== 'all') (params as any).globalStatusLevel = tier;
        // if (event) (params as any).event = event;
        if (event) (params as any).keyword = event;
        if (startDate) (params as any).startDate = startDate;
        if (endDate) (params as any).endDate = endDate;
        if (startAmount) (params as any).startAmount = startAmount;
        if (endAmount) (params as any).endAmount = endAmount;
        if (orderType) (params as any).orderType = orderType;
        if (user) (params as any).user = user;
        if (validationStatus) (params as any).validationStatus = validationStatus;
        if (transfered) (params as any).transfered = true;
        if (sent) (params as any).sent = true;
        if (refunded) (params as any).refunded = true;
        if (resStartDate) (params as any).resStartDate = resStartDate;
        if (resEndDate) (params as any).resEndDate = resEndDate;
        if (resDate) (params as any).resDate = resDate;
        if (resStartTime) (params as any).resStartTime = resStartTime;
        if (resEndTime) (params as any).resEndTime = resEndTime;
        if (futureRes) (params as any).futureRes = true;
        if (pastRes) (params as any).pastRes = true;
        if (paidRes) (params as any).paidRes = true;
        if (minimalSpendRes !== undefined && minimalSpendRes !== '') (params as any).minimalSpendRes = minimalSpendRes;
        if (prePay) (params as any).prePay = true;
        if (ticketRequiredRes) (params as any).ticketRequiredRes = true;
        if (cancelledRes) (params as any).cancelledRes = true;
        if (noShowRes) (params as any).noShowRes = true;

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
        meta: res.data.meta,
      }),
      providesTags: (result, error, arg) => (arg.isGlobal ? ['loyalty-transaction'] : ['loyalty-transaction']),
    }),

    getTransactionsById: builder.query({
      query: ({ id, isAdmin }) => ({
        url: API_ROUTES.TRANSACTIONS_BY_ID(isAdmin, id),
        method: 'GET',
      }),
      transformResponse: (res) => res.data,
      // providesTags: ['event'],
    }),

    getOrderTransactionsAnalytics: builder.query({
      query: ({
        companyOrganizer,
        organizations,
        page,
        limit,
      }: {
        companyOrganizer?: string;
        organizations?: string;
        page?: number;
        limit?: number;
      }) => {
        const params: any = {};

        if (companyOrganizer) params.companyOrganizer = companyOrganizer;
        if (organizations) params.organizations = organizations;
        if (typeof page === 'number') params.page = page + 1;
        if (typeof limit === 'number') params.limit = limit;

        return {
          url: API_ROUTES.TRANSACTIONS_ANALYTICS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res: any) => ({
        data: res?.data?.stats || res?.stats || res?.data || [],
        meta: res?.data?.meta || res?.meta || {
          totalPages: 1,
          currentPage: 1,
          limit: 10,
          totalRecords: 0,
        },
      }),
      providesTags: ['loyalty-transaction'],
    }),
  }),
});

export const {
  useGetLoyaltyTransactionsQuery,
  useGetTransactionsQuery,
  useGetTransactionsByIdQuery,
} = loyaltyTransactionsApi;

export const useGetOrderTransactionsAnalyticsQuery = loyaltyTransactionsApi.endpoints.getOrderTransactionsAnalytics.useQuery;
