import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const loyaltyClubApi = createApi({
  reducerPath: 'loyaltyClubApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['loyalty-club', 'loyalty-listings'],

  endpoints: (builder) => ({
    getLoyaltyClubsList: builder.query({
      query: ({ search, page, limit, companyOrganizer }) => {
        const params: any = {
          keyword: search,
          page: page + 1,
          limit,
        };

        if (companyOrganizer) params.companyOrganizer = companyOrganizer;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.LOYALTY_LISTINGS,
            organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_LISTINGS,
            // adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res) => res.data,
      providesTags: ['loyalty-listings'],
    }),

    linkLoyaltyClub: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_REQUEST_LOYALTY_CLUBS,
          organizerRoute: API_ROUTES.ORGANIZER_REQUEST_LOYALTY_CLUBS,
        },
      }),
      invalidatesTags: ['loyalty-listings'],
    }),

    getAllClubsList: builder.query({
      query: ({ status, page, limit, companyOrganizer }) => {
        const params: any = {
          page: page + 1,
          limit,
        };

        if (status) params.status = status;
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.GET_ADMIN_REQUEST_LOYALTY_CLUBS(companyOrganizer),
            organizerRoute: API_ROUTES.GET_ORGANIZER_REQUEST_LOYALTY_CLUBS(companyOrganizer),
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      providesTags: ['loyalty-club'],
    }),

    updateRequest: builder.mutation({
      query: ({ id, ...body }) => ({
        url: '',
        method: 'PUT',
        body: body,
        roleBasedRouting: {
          adminRoute: API_ROUTES.GET_ADMIN_REQUEST_LOYALTY_CLUBS(id),
          organizerRoute: API_ROUTES.GET_ORGANIZER_REQUEST_LOYALTY_CLUBS(id),
        },
      }),
      invalidatesTags: ['loyalty-club'],
    }),

    deleteClub: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_REQUEST_LOYALTY_CLUBS_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_REQUEST_LOYALTY_CLUBS_BY_ID(id),
        },
      }),
      invalidatesTags: ['loyalty-club'],
    }),
  }),
});

export const { useGetLoyaltyClubsListQuery, useLinkLoyaltyClubMutation, useGetAllClubsListQuery, useUpdateRequestMutation, useDeleteClubMutation } =
  loyaltyClubApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const loyaltyClubApi = createApi({
//   reducerPath: 'loyaltyClubApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['loyalty-club', 'loyalty-listings'],

//   endpoints: (builder) => ({
//     getLoyaltyClubsList: builder.query({
//       query: ({ search, page, limit, companyOrganizer }) => {
//         const params: any = {
//           keyword: search,
//           page: page + 1,
//           limit,
//         };
//         if (companyOrganizer) params.companyOrganizer = companyOrganizer;
//         return {
//           url: API_ROUTES.LOYALTY_LISTINGS,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => res.data,
//       providesTags: ['loyalty-listings'],
//     }),

//     linkLoyaltyClub: builder.mutation({
//       query: (data) => ({
//         url: API_ROUTES.ADMIN_REQUEST_LOYALTY_CLUBS,
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: ['loyalty-listings'],
//     }),

//     getAllClubsList: builder.query({
//       query: ({ status, page, limit, companyOrganizer }) => {
//         const params: any = {
//           page: page + 1,
//           limit,
//         };
//         if (status) params.status = status;
//         if (companyOrganizer) params.companyOrganizer = companyOrganizer;
//         return {
//           url: API_ROUTES.GET_ADMIN_REQUEST_LOYALTY_CLUBS(companyOrganizer),
//           method: 'GET',
//           params,
//         };
//       },
//       providesTags: ['loyalty-club'],
//     }),

//     updateRequest: builder.mutation({
//       query: ({ id, ...body }) => ({
//         url: API_ROUTES.GET_ADMIN_REQUEST_LOYALTY_CLUBS(id),
//         method: 'PUT',
//         body: body,
//       }),
//       invalidatesTags: ['loyalty-club'],
//     }),

//     deleteClub: builder.mutation({
//       query: (id) => ({
//         url: API_ROUTES.ADMIN_REQUEST_LOYALTY_CLUBS_BY_ID(id),
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['loyalty-club'],
//     }),
//   }),
// });

// export const { useGetLoyaltyClubsListQuery, useLinkLoyaltyClubMutation, useGetAllClubsListQuery, useUpdateRequestMutation, useDeleteClubMutation } =
//   loyaltyClubApi;
