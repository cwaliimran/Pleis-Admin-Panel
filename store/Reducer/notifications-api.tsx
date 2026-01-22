import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['notification'],

  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ search, page, status, date, limit, sendTiming, isDelivered }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) params.date = date;
        if (sendTiming) params.sendTiming = sendTiming;
        if (isDelivered !== undefined && isDelivered !== '') params.isDelivered = isDelivered;
        return {
          url: API_ROUTES.ADMIN_NOTIFICATIONS_GET_ALL,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['notification'],
    }),

    getAllOrganizatons: builder.query({
      query: ({ search, limit, page }) => {
        const params: any = {};
        if (search) params.keyword = search;
        if (limit) params.limit = limit;
        if (page !== undefined) params.page = page + 1;
        return {
          url: API_ROUTES.ADMIN_GET_ALL_ORGANIZATIONS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => res.data,
    }),

    getAllEvents: builder.query({
      query: ({ search, limit, page }) => {
        const params: any = {};
        if (search) params.keyword = search;
        if (limit) params.limit = limit;
        if (page !== undefined) params.page = page + 1;
        return {
          url: API_ROUTES.ADMIN_GET_ALL_EVENTS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => res.data,
    }),

    getAllInterestTags: builder.query({
      query: ({ search, limit, page }) => {
        const params: any = {};
        if (search) params.keyword = search;
        if (limit) params.limit = limit;
        if (page !== undefined) params.page = page + 1;
        return {
          url: API_ROUTES.ADMIN_GET_ALL_INTEREST_TAGS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => res.data,
    }),

    addNotification: builder.mutation({
      query: (newNotification) => ({
        url: API_ROUTES.ADMIN_NOTIFICATIONS,
        method: 'POST',
        body: newNotification,
      }),
      invalidatesTags: ['notification'],
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_NOTIFICATIONS_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useAddNotificationMutation,
  useDeleteNotificationMutation,
  useGetAllOrganizatonsQuery,
  useGetAllEventsQuery,
  useGetAllInterestTagsQuery,
} = notificationsApi;
