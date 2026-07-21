import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const subscriptionsApi = createApi({
  reducerPath: 'subscriptionsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['subscription', 'pricing', 'organizerSubscriptions'],

  endpoints: (builder) => ({
    getSubscriptions: builder.query({
      query: ({ search, page, status, date, limit, subscriptionTypes, selectedRange, billing }) => {
        const params: any = {
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        if (status) (params as any).status = status;
        if (subscriptionTypes) (params as any).subscriptionTypes = subscriptionTypes;
        if (selectedRange) (params as any).selectedRange = selectedRange;
        if (search) (params as any).keyword = search;
        if (billing) (params as any).billing = billing;

        return {
          url: API_ROUTES.ADMIN_USERS_SUBSCRIPTION,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['subscription'],
    }),

    addSubscription: builder.mutation({
      query: (newSubscription) => ({
        url: API_ROUTES.ADMIN_USERS_SUBSCRIPTION,
        method: 'POST',
        body: newSubscription,
      }),
      invalidatesTags: ['subscription'],
    }),

    updateSubscription: builder.mutation({
      query: ({ userId, ...updatedSubscription }) => ({
        url: API_ROUTES.ADMIN_UPDATE_USERS_SUBSCRIPTION_BY_ID(userId),
        method: 'PUT',
        body: updatedSubscription,
      }),
      invalidatesTags: ['subscription'],
    }),

    deleteSubscription: builder.mutation({
      query: (selectedId) => ({
        url: API_ROUTES.ADMIN_DELETE_USERS_SUBSCRIPTION_BY_ID(selectedId),
        method: 'DELETE',
      }),
      invalidatesTags: ['subscription'],
    }),

    getSubscriptionsPricing: builder.query({
      query: () => {
        return {
          url: API_ROUTES.ADMIN_SUBSCRIPTION_PRICING,
          method: 'GET',
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['pricing'],
    }),

    addSubscriptionPricing: builder.mutation({
      query: (subscriptionPricing) => ({
        url: API_ROUTES.ADMIN_SUBSCRIPTION_PRICING,
        method: 'POST',
        body: subscriptionPricing,
      }),
      invalidatesTags: ['pricing'],
    }),

    updateSubscriptionPricing: builder.mutation({
      query: ({ id, ...updatedSubscription }) => ({
        url: API_ROUTES.ADMIN_UPDATE_SUBSCRIPTION_PRICING_BY_ID(id),
        method: 'PUT',
        body: updatedSubscription,
      }),
      invalidatesTags: ['pricing'],
    }),

    // GET ORGANIZER SUBSCRIPTIONS -----------------------------

    getOrganizerSubscriptions: builder.query({
      query: ({}) => {
        return {
          url: API_ROUTES.GET_ORGANIZER_SUBSCRIPTION,
          method: 'GET',
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['organizerSubscriptions'],
    }),

    getOrganizerOwnSubscriptions: builder.query({
      query: ({}) => {
        return {
          url: API_ROUTES.GET_ORGANIZER_OWN_SUBSCRIPTION,
          method: 'GET',
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['organizerSubscriptions'],
    }),

    updateOrganizerSubscription: builder.mutation({
      query: (updatedSubscription) => ({
        url: API_ROUTES.GET_ORGANIZER_SUBSCRIPTION,
        method: 'PUT',
        body: updatedSubscription,
      }),
      invalidatesTags: ['organizerSubscriptions'],
    }),

    getMonriWebPaySession: builder.query({
      query: ({ amount, orderNumber, orderType, paymentMethod }) => ({
        url: API_ROUTES.MONRI_WEB_PAY_SESSION,
        method: 'GET',
        params: { amount, orderNumber, orderType, paymentMethod },
      }),
    }),
  }),
});

export const {
  useGetSubscriptionsQuery,
  useAddSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetSubscriptionsPricingQuery,
  useAddSubscriptionPricingMutation,
  useUpdateSubscriptionPricingMutation,

  useGetOrganizerSubscriptionsQuery,
  useGetOrganizerOwnSubscriptionsQuery,
  useUpdateOrganizerSubscriptionMutation,
  useLazyGetMonriWebPaySessionQuery,
} = subscriptionsApi;
