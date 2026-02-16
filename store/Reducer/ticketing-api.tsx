import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const ticketingApi = createApi({
  reducerPath: 'ticketingApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['ticketing'],

  endpoints: (builder) => ({
    getTicketing: builder.query({
      query: ({ search, page, status, date, limit, organization }) => {
        const params: any = {
          status,
          page: page + 1,
          limit,
        };

        if (date) params.date = date;
        if (search) params.keyword = search;
        if (organization) params.organizations = organization;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.TICKETING_BY_ORGANIZATION(organization),
            organizerRoute: API_ROUTES.ORGANIZER_TICKETING,
            organizerOnlyParams: ['organizations'],
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['ticketing'],
    }),

    addTicketing: builder.mutation({
      query: (newTicketing) => ({
        url: '',
        method: 'POST',
        body: newTicketing,
        roleBasedRouting: {
          adminRoute: API_ROUTES.TICKETING,
          organizerRoute: API_ROUTES.ORGANIZER_TICKETING,
        },
      }),
      invalidatesTags: ['ticketing'],
    }),

    updateTicketing: builder.mutation({
      query: ({ id, ...updatedTicketing }) => ({
        url: '',
        method: 'PUT',
        body: updatedTicketing,
        roleBasedRouting: {
          adminRoute: API_ROUTES.TICKETING_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_TICKETING_BY_ID(id),
        },
      }),
      invalidatesTags: ['ticketing'],
    }),

    deleteTicketing: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.TICKETING_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_TICKETING_BY_ID(id),
        },
      }),
      invalidatesTags: ['ticketing'],
    }),

    getTicketingByEvent: builder.query({
      query: ({ eventId }) => ({
        url: '',
        method: 'GET',
        roleBasedRouting: {
          adminRoute: API_ROUTES.TICKETING_BY_EVENT(eventId),
          organizerRoute: API_ROUTES.ORGANIZER_TICKETING_BY_EVENT(eventId),
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
      }),
      providesTags: ['ticketing'],
    }),
  }),
});

export const { useGetTicketingQuery, useGetTicketingByEventQuery, useAddTicketingMutation, useUpdateTicketingMutation, useDeleteTicketingMutation } =
  ticketingApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const ticketingApi = createApi({
//   reducerPath: 'ticketingApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['ticketing'],

//   endpoints: (builder) => ({
//     getTicketing: builder.query({
//       query: ({ search, page, status, date, limit, organization }) => {
//         const params: any = {
//           // keyword: search,
//           status,
//           page: page + 1,
//           limit,
//         };
//         if (date) (params as any).date = date;
//         if (search) (params as any).keyword = search;
//         return {
//           url: API_ROUTES.TICKETING_BY_ORGANIZATION(organization),
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['ticketing'],
//     }),

//     addTicketing: builder.mutation({
//       query: (newTicketing) => ({
//         url: API_ROUTES.TICKETING,
//         method: 'POST',
//         body: newTicketing,
//       }),
//       invalidatesTags: ['ticketing'],
//     }),

//     updateTicketing: builder.mutation({
//       query: ({ id, ...updatedTicketing }) => ({
//         url: API_ROUTES.TICKETING_BY_ID(id),
//         method: 'PUT',
//         body: updatedTicketing,
//       }),
//       invalidatesTags: ['ticketing'],
//     }),

//     deleteTicketing: builder.mutation({
//       query: (id) => ({
//         url: API_ROUTES.TICKETING_BY_ID(id),
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['ticketing'],
//     }),

//     getTicketingByEvent: builder.query({
//       query: ({ eventId }) => {
//         return {
//           url: API_ROUTES.TICKETING_BY_EVENT(eventId),
//           method: 'GET',
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//       }),
//       providesTags: ['ticketing'],
//     }),
//   }),
// });

// export const { useGetTicketingQuery, useGetTicketingByEventQuery, useAddTicketingMutation, useUpdateTicketingMutation, useDeleteTicketingMutation } =
//   ticketingApi;
