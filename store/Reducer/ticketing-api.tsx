import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const ticketingApi = createApi({
  reducerPath: 'ticketingApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['ticketing'],

  endpoints: (builder) => ({
    getTicketing: builder.query({
      query: ({ search, page, status, date, limit, organization }) => {
        const params: any = {
          // keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        if (search) (params as any).keyword = search;
        return {
          url: API_ROUTES.TICKETING_BY_ORGANIZATION(organization),
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['ticketing'],
    }),

    getTicketingByEvent: builder.query({
      query: ({ eventId }) => {
        return {
          url: API_ROUTES.TICKETING_BY_EVENT(eventId),
          method: 'GET',
        };
      },
      transformResponse: (res) => ({
        data: res.data,
      }),
      // providesTags: ['ticketing'],
    }),

    addTicketing: builder.mutation({
      query: (newTicketing) => ({
        url: API_ROUTES.TICKETING,
        method: 'POST',
        body: newTicketing,
      }),
      invalidatesTags: ['ticketing'],
    }),

    updateTicketing: builder.mutation({
      query: ({ id, ...updatedTicketing }) => ({
        url: API_ROUTES.TICKETING_BY_ID(id),
        method: 'PUT',
        body: updatedTicketing,
      }),
      invalidatesTags: ['ticketing'],
    }),

    deleteTicketing: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.TICKETING_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['ticketing'],
    }),
  }),
});

export const { useGetTicketingQuery, useGetTicketingByEventQuery, useAddTicketingMutation, useUpdateTicketingMutation, useDeleteTicketingMutation } =
  ticketingApi;
