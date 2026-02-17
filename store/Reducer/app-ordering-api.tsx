import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const appOrderingApi = createApi({
  reducerPath: 'appOrderingApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['app-ordering'],

  endpoints: (builder) => ({
    getAppOrdering: builder.query({
      query: ({ search, page, status, limit, activeorderStatus, pickupFilter, organization }) => {
        const params: any = {
          page: page + 1,
          limit,
        };

        if (search) params.keyword = search;
        if (status) params.orderStatus = status;
        if (activeorderStatus) params.activeorderStatus = activeorderStatus;
        if (pickupFilter) params.pickupFilter = pickupFilter;
        if (organization) params.organization = organization;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_ORDER_MANAGEMENT_GET,
            organizerRoute: API_ROUTES.ORGANIZER_ORDER_MANAGEMENT_GET,
            // adminOnlyParams: ['organization'],
          },
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
        url: '',
        method: 'PUT',
        body: updatedAppOrdering,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_ORDER_MANAGEMENT_UPDATE(id),
          organizerRoute: API_ROUTES.ORGANIZER_ORDER_MANAGEMENT_UPDATE(id),
        },
      }),
      invalidatesTags: ['app-ordering'],
    }),

    getAppOrderingStatus: builder.query({
      query: ({ organizationId }) => {
        const params: any = {};
        if (organizationId) params.organization = organizationId;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_ORDER_MANAGEMENT_STATUS,
            organizerRoute: API_ROUTES.ORGANIZER_ORDER_MANAGEMENT_STATUS,
            // adminOnlyParams: ['organization'],
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
      }),
      providesTags: ['app-ordering'],
    }),

    updateAppOrderingStatus: builder.mutation({
      query: ({ id, ...updatedAppOrdering }) => ({
        url: '',
        method: 'PUT',
        body: updatedAppOrdering,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_ORDER_MANAGEMENT_STATUS_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_ORDER_MANAGEMENT_STATUS_BY_ID(id),
        },
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
//       query: ({ search, page, status, limit, activeorderStatus, pickupFilter, organization }) => {
//         const params: any = {
//           page: page + 1, // Already 0-indexed from the component
//           limit,
//         };

//         // Add keyword search if provided
//         if (search) {
//           params.keyword = search;
//         }

//         // Add status filter (active, preorder, postorders)
//         if (status) {
//           params.orderStatus = status;
//         }

//         // Add active order sub-tab filter (new, inProgress, completed)
//         if (activeorderStatus) {
//           params.activeorderStatus = activeorderStatus;
//         }

//         // Add pickup/delivery type filter (tableService, togo, preorder, counter)
//         if (pickupFilter) {
//           params.pickupFilter = pickupFilter;
//         }

//         // Add company organizer
//         // if (companyOrganizer) {
//         //   params.companyOrganizer = companyOrganizer;
//         // }

//         // Add organization ID
//         if (organization) {
//           params.organization = organization;
//         }

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
//       query: ({ organizationId }) => {
//         const params: any = {};
//         if (organizationId) {
//           params.organization = organizationId;
//         }
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
