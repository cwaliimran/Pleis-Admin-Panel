import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const venueApi = createApi({
  reducerPath: 'venueApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['venue'],

  endpoints: (builder) => ({
    getVenues: builder.query({
      query: ({ search, page, status, date, limit, organization }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };

        if (date) params.date = date;
        if (organization) params.organization = organization;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_VENUES,
            organizerRoute: API_ROUTES.ORGANIZER_VENUES,
            // adminOnlyParams: ['organization'], // organizer should not filter by org
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['venue'],
    }),

    addVenue: builder.mutation({
      query: (newVenue) => ({
        url: '',
        method: 'POST',
        body: newVenue,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_VENUES,
          organizerRoute: API_ROUTES.ORGANIZER_VENUES,
        },
      }),
      invalidatesTags: ['venue'],
    }),

    updateVenue: builder.mutation({
      query: ({ id, ...updatedVenue }) => ({
        url: '',
        method: 'PUT',
        body: updatedVenue,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_VENUES_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_VENUES_BY_ID(id),
        },
      }),
      invalidatesTags: ['venue'],
    }),

    deleteVenue: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_VENUES_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_VENUES_BY_ID(id),
        },
      }),
      invalidatesTags: ['venue'],
    }),
  }),
});

export const { useGetVenuesQuery, useAddVenueMutation, useUpdateVenueMutation, useDeleteVenueMutation } = venueApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const venueApi = createApi({
//   reducerPath: 'venueApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['venue'],

//   endpoints: (builder) => ({
//     getVenues: builder.query({
//       query: ({ search, page, status, date, limit, organization }) => {
//         const params: any = {
//           keyword: search,
//           status,
//           page: page + 1,
//           limit,
//         };
//         if (date) (params as any).date = date;
//         if (organization) (params as any).organization = organization;
//         return {
//           url: API_ROUTES.ADMIN_VENUES,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['venue'],
//     }),

//     addVenue: builder.mutation({
//       query: (newVenue) => ({
//         url: API_ROUTES.ADMIN_VENUES,
//         method: 'POST',
//         body: newVenue,
//       }),
//       invalidatesTags: ['venue'],
//     }),

//     updateVenue: builder.mutation({
//       query: ({ id, ...updatedVenue }) => ({
//         url: API_ROUTES.ADMIN_VENUES_BY_ID(id),
//         method: 'PUT',
//         body: updatedVenue,
//       }),
//       invalidatesTags: ['venue'],
//     }),

//     deleteVenue: builder.mutation({
//       query: (id) => ({
//         url: API_ROUTES.ADMIN_VENUES_BY_ID(id),
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['venue'],
//     }),
//   }),
// });

// export const { useGetVenuesQuery, useAddVenueMutation, useUpdateVenueMutation, useDeleteVenueMutation } = venueApi;
