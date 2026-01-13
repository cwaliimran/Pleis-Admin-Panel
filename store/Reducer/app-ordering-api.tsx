import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const appOrderingApi = createApi({
  reducerPath: 'appOrderingApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['app-ordering'],

  endpoints: (builder) => ({
    getAppOrdering: builder.query({
      query: ({ search, page, status, limit, activeorderStatus, pickupFilter, companyOrganizer }) => {
        const params: any = {
          page: page + 1,
          limit,
        };

        // Add keyword search if provided
        if (search) {
          params.keyword = search;
        }

        // Add status filter (active, preorder, postorders)
        if (status) {
          params.orderStatus = status;
        }

        // Add active order sub-tab filter (new, inProgress, completed)
        if (activeorderStatus) {
          params.activeorderStatus = activeorderStatus;
        }

        // Add pickup/delivery type filter (tableService, togo, preorder, counter)
        if (pickupFilter) {
          params.pickupFilter = pickupFilter;
        }

        // Add company organizer
        if (companyOrganizer) {
          params.companyOrganizer = companyOrganizer;
        }

        return {
          url: API_ROUTES.ADMIN_ORDER_MANAGEMENT_GET,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['app-ordering'],
    }),

    updateAppOrdering: builder.mutation({
      query: ({ id, ...updatedAppOrdering }) => ({
        url: API_ROUTES.ADMIN_ORDER_MANAGEMENT_UPDATE(id),
        method: 'PUT',
        body: updatedAppOrdering,
      }),
      invalidatesTags: ['app-ordering'],
    }),

    getAppOrderingStatus: builder.query({
      query: ({ companyOrganizer }) => {
        const params: any = {};
        if (companyOrganizer) {
          params.companyOrganizer = companyOrganizer;
        }
        return {
          url: API_ROUTES.ADMIN_ORDER_MANAGEMENT_STATUS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
      }),
      providesTags: ['app-ordering'],
    }),

    updateAppOrderingStatus: builder.mutation({
      query: ({ id, ...updatedAppOrdering }) => ({
        url: API_ROUTES.ADMIN_ORDER_MANAGEMENT_STATUS_BY_ID(id),
        method: 'PUT',
        body: updatedAppOrdering,
      }),
      invalidatesTags: ['app-ordering'],
    }),
  }),
});

export const { useGetAppOrderingQuery, useUpdateAppOrderingMutation, useGetAppOrderingStatusQuery, useUpdateAppOrderingStatusMutation } =
  appOrderingApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const appOrderingApi = createApi({
//   reducerPath: 'appOrderingApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['app-ordering'],

//   endpoints: (builder) => ({
//     getAppOrdering: builder.query({
//       query: ({ search, page, status, date, limit, companyOrganizer }) => {
//         const params: any = {
//           keyword: search,
//           orderStatus: status,
//           page: page + 1,
//           limit,
//         };
//         if (date) (params as any).date = date;
//         if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
//         return {
//           url: API_ROUTES.ADMIN_ORDER_MANAGEMENT_GET,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['app-ordering'],
//     }),

//     updateAppOrdering: builder.mutation({
//       query: ({ id, ...updatedAppOrdering }) => ({
//         url: API_ROUTES.ADMIN_ORDER_MANAGEMENT_UPDATE(id),
//         method: 'PUT',
//         body: updatedAppOrdering,
//       }),
//       invalidatesTags: ['app-ordering'],
//     }),

//     getAppOrderingStatus: builder.query({
//       query: ({ companyOrganizer }) => {
//         const params: any = {};
//         if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
//         return {
//           url: API_ROUTES.ADMIN_ORDER_MANAGEMENT_STATUS,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//       }),
//       providesTags: ['app-ordering'],
//     }),

//     updateAppOrderingStatus: builder.mutation({
//       query: ({ id, ...updatedAppOrdering }) => ({
//         url: API_ROUTES.ADMIN_ORDER_MANAGEMENT_STATUS_BY_ID(id),
//         method: 'PUT',
//         body: updatedAppOrdering,
//       }),
//       invalidatesTags: ['app-ordering'],
//     }),
//   }),
// });

// export const { useGetAppOrderingQuery, useUpdateAppOrderingMutation, useGetAppOrderingStatusQuery, useUpdateAppOrderingStatusMutation } =
//   appOrderingApi;
