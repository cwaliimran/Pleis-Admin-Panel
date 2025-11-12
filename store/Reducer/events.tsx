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

    updateevent: builder.mutation({
      query: ({ id, ...updatedevent }) => ({
        url: API_ROUTES.ADMIN_EVENTS_BY_ID(id),
        method: 'PUT',
        body: updatedevent,
      }),
      invalidatesTags: ['event'],
    }),

    deleteevent: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_EVENTS_BY_ID(id),
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
  useAddeventMutation,
  useUpdateeventMutation,
  useCloneeventMutation,
  useDeleteeventMutation,
} = eventApi;
