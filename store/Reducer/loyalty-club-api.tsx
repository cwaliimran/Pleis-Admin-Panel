import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const loyaltyClubApi = createApi({
  reducerPath: 'loyaltyClubApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['loyalty-club'],

  endpoints: (builder) => ({
    getLoyaltyClubsList: builder.query({
      query: ({ search, page, limit }) => {
        const params: any = {
          keyword: search,
          page: page + 1,
          limit,
        };
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
      // invalidatesTags: ['userList'],
    }),
  }),
});

export const { useGetLoyaltyClubsListQuery, useLinkLoyaltyClubMutation } = loyaltyClubApi;
