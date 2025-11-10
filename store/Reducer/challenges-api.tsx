import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const challengesApi = createApi({
  reducerPath: 'challengesApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['challenge'],

  endpoints: (builder) => ({
    getChallenges: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
        return {
          url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['challenge'],
    }),

    addChallenge: builder.mutation({
      query: (newChallenge) => ({
        url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE,
        method: 'POST',
        body: newChallenge,
      }),
      invalidatesTags: ['challenge'],
    }),

    updateChallenge: builder.mutation({
      query: ({ id, ...updatedChallenge }) => ({
        url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE_BY_ID(id),
        method: 'PUT',
        body: updatedChallenge,
      }),
      invalidatesTags: ['challenge'],
    }),

    deleteChallenge: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['challenge'],
    }),
  }),
});

export const { useGetChallengesQuery, useAddChallengeMutation, useUpdateChallengeMutation, useDeleteChallengeMutation } = challengesApi;
