import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const loyaltyClubApi = createApi({
  reducerPath: 'loyaltyClubApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['loyalty-club'],

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
          url: API_ROUTES.LOYALTY_LISTINGS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => res.data,
    }),

    linkLoyaltyClub: builder.mutation({
      query: (data) => ({
        url: API_ROUTES.ADMIN_REQUEST_LOYALTY_CLUBS,
        method: 'POST',
        body: data,
      }),
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
          url: API_ROUTES.GET_ADMIN_REQUEST_LOYALTY_CLUBS(companyOrganizer),
          method: 'GET',
          params,
        };
      },
      providesTags: ['loyalty-club'],
    }),

    updateRequest: builder.mutation({
      query: ({ id, ...body }) => ({
        url: API_ROUTES.GET_ADMIN_REQUEST_LOYALTY_CLUBS(id),
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['loyalty-club'],
    }),

    deleteClub: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_REQUEST_LOYALTY_CLUBS_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['loyalty-club'],
    }),
  }),
});

export const { useGetLoyaltyClubsListQuery, useLinkLoyaltyClubMutation, useGetAllClubsListQuery, useUpdateRequestMutation, useDeleteClubMutation } = loyaltyClubApi;
