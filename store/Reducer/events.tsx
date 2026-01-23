import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['event'],

  endpoints: (builder) => ({
    getevents: builder.query({
      query: ({ search, page, status, startDate, endDate, limit, organization }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (organization) params.organization = organization;
        return {
          url: API_ROUTES.ADMIN_EVENTS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['event'],
    }),

    getEventsByOrganization: builder.query({
      query: ({ organization }) => ({
        url: API_ROUTES.ADMIN_EVENTS_BY_ORGANIZATION(organization),
        method: 'GET',
      }),
      transformResponse: (res) => res.data,
      providesTags: ['event'],
    }),

    geteventById: builder.query({
      query: (id) => ({
        url: API_ROUTES.ADMIN_EVENTS_BY_ID(id),
        method: 'GET',
      }),
      transformResponse: (res) => res.data,
      providesTags: ['event'],
    }),

    geteventAnalyticsById: builder.query({
      query: (id) => ({
        url: API_ROUTES.ADMIN_EVENTS_ANALYTICS_BY_ID(id),
        method: 'GET',
      }),
      transformResponse: (res) => res.data,
    }),

    geteventTicketsAnalyticsById: builder.query({
      query: (id) => ({
        url: API_ROUTES.ADMIN_EVENTS_TICKETS_ANALYTICS_BY_ID(id),
        method: 'GET',
      }),
      transformResponse: (res) => res.data,
    }),

    // geteventNotificationsById: builder.query({
    //   query: (id) => ({
    //     url: API_ROUTES.ADMIN_EVENTS_NOTIFICATIONS_BY_ID(id),
    //     method: 'GET',
    //   }),
    //   // transformResponse: (res) => res.data,
    //   transformResponse: (res) => ({
    //     data: res.data,
    //     meta: res.meta,
    //   }),
    // }),

    geteventNotificationsById: builder.query({
      query: ({ id, page, limit }) => ({
        url: API_ROUTES.ADMIN_EVENTS_NOTIFICATIONS_BY_ID(id),
        method: 'GET',
        params: {
          page: page + 1,
          limit,
        },
      }),
      // transformResponse: (res) => res.data,
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),

    // geteventFeedbackById: builder.query({
    //   query: (id) => ({
    //     url: API_ROUTES.ADMIN_EVENTS_FEEDBACK_BY_ID(id),
    //     method: 'GET',
    //   }),
    //   transformResponse: (res) => res.data,
    // }),

    geteventFeedbackById: builder.query({
      query: ({ id, search, page, limit }) => {
        const params: any = {
          keyword: search,
          page: page + 1,
          limit,
        };
        return {
          url: API_ROUTES.ADMIN_EVENTS_FEEDBACK_BY_ID(id),
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['event'],
    }),

    addevent: builder.mutation({
      query: (newevent) => ({
        url: API_ROUTES.ADMIN_EVENTS,
        method: 'POST',
        body: newevent,
      }),
      invalidatesTags: ['event'],
    }),

    cloneevent: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_EVENTS_BY_ID(id) + '/clone',
        method: 'POST',
      }),
      invalidatesTags: ['event'],
    }),

    // updateevent: builder.mutation({
    //   query: ({ id, ...updatedevent }) => ({
    //     // query: ({ id, scope, ...updatedevent }) => ({
    //     url: API_ROUTES.ADMIN_EVENTS_BY_ID(id),
    //     // url: API_ROUTES.UPDATE_ADMIN_EVENTS_BY_ID_AND_SCOPE(id, scope),
    //     method: 'PUT',
    //     body: updatedevent,
    //   }),
    //   invalidatesTags: ['event'],
    // }),

    updateevent: builder.mutation({
      query: ({ id, scope, ...updatedevent }) => ({
        url: scope ? API_ROUTES.UPDATE_ADMIN_EVENTS_BY_ID_AND_SCOPE(id, scope) : API_ROUTES.ADMIN_EVENTS_BY_ID(id),
        method: 'PUT',
        body: updatedevent,
      }),
      invalidatesTags: ['event'],
    }),

    deleteevent: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.DELETE_ADMIN_EVENTS_BY_ID_AND_SCOPE(payload.id, payload.scope),
        method: 'DELETE',
      }),
      invalidatesTags: ['event'],
    }),
  }),
});

export const {
  useGeteventsQuery,
  useGetEventsByOrganizationQuery,
  useGeteventByIdQuery,
  useGeteventAnalyticsByIdQuery,
  useGeteventTicketsAnalyticsByIdQuery,
  useGeteventNotificationsByIdQuery,
  useGeteventFeedbackByIdQuery,
  useAddeventMutation,
  useUpdateeventMutation,
  useCloneeventMutation,
  useDeleteeventMutation,
} = eventApi;
