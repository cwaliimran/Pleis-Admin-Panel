import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const venueTypeApi = createApi({
  reducerPath: 'venueTypeApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['venueType'],

  endpoints: (builder) => ({
    getVenueTypes: builder.query({
      query: ({ search, page, status, date, limit, category }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };

        if (date) params.date = date;

        if (category) {
          params.categories = category;
        }

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.VENUES_TYPES,
            organizerRoute: API_ROUTES.ORGANIZER_VENUES_TYPES,
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['venueType'],
    }),

    addVenueType: builder.mutation({
      query: (newVenueType) => ({
        url: '',
        method: 'POST',
        body: newVenueType,
        roleBasedRouting: {
          adminRoute: API_ROUTES.VENUES_TYPES,
          organizerRoute: API_ROUTES.ORGANIZER_VENUES_TYPES,
        },
      }),
      invalidatesTags: ['venueType'],
    }),

    updateVenueType: builder.mutation({
      query: ({ id, ...updatedVenueType }) => ({
        url: '',
        method: 'PUT',
        body: updatedVenueType,
        roleBasedRouting: {
          adminRoute: API_ROUTES.VENUES_TYPE_By_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_VENUES_TYPE_BY_ID(id),
        },
      }),
      invalidatesTags: ['venueType'],
    }),

    deleteVenueType: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.VENUES_TYPE_By_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_VENUES_TYPE_BY_ID(id),
        },
      }),
      invalidatesTags: ['venueType'],
    }),
  }),
});

export const { useGetVenueTypesQuery, useAddVenueTypeMutation, useUpdateVenueTypeMutation, useDeleteVenueTypeMutation } = venueTypeApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const venueTypeApi = createApi({
//   reducerPath: 'venueTypeApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['venueType'],

//   endpoints: (builder) => ({
//     getVenueTypes: builder.query({
//       query: ({ search, page, status, date, limit }) => {
//         const params: any = {
//           keyword: search,
//           status,
//           page: page + 1,
//           limit,
//         };
//         if (date) (params as any).date = date;
//         return {
//           url: API_ROUTES.VENUES_TYPES,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['venueType'],
//     }),

//     addVenueType: builder.mutation({
//       query: (newVenueType) => ({
//         url: API_ROUTES.VENUES_TYPES,
//         method: 'POST',
//         body: newVenueType,
//       }),
//       invalidatesTags: ['venueType'],
//     }),

//     updateVenueType: builder.mutation({
//       query: ({ id, ...updatedVenueType }) => ({
//         url: API_ROUTES.VENUES_TYPE_By_ID(id),
//         method: 'PUT',
//         body: updatedVenueType,
//       }),
//       invalidatesTags: ['venueType'],
//     }),

//     deleteVenueType: builder.mutation({
//       query: (id) => ({
//         url: API_ROUTES.VENUES_TYPE_By_ID(id),
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['venueType'],
//     }),
//   }),
// });

// export const {
//   useGetVenueTypesQuery,
//   useAddVenueTypeMutation,
//   useUpdateVenueTypeMutation,
//   useDeleteVenueTypeMutation,
// } = venueTypeApi;
