import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const challengesApi = createApi({
  reducerPath: 'challengesApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['challenge', 'globalChallenge'],

  endpoints: (builder) => ({
    getChallenges: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer, isGlobal = false }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        // if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
        if (!isGlobal && companyOrganizer) params.companyOrganizer = companyOrganizer;
        return {
          // url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE,
          url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE(isGlobal),
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      // providesTags: ['challenge'],
      providesTags: (result, error, arg) => (arg.isGlobal ? ['globalChallenge'] : ['challenge']),
    }),

    addChallenge: builder.mutation({
      query: ({ isGlobal = false, ...newChallenge }) => ({
        // url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE,
        url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE(isGlobal),
        method: 'POST',
        body: newChallenge,
      }),
      // invalidatesTags: ['challenge'],
      invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalChallenge'] : ['challenge']),
    }),

    updateChallenge: builder.mutation({
      query: ({ id, isGlobal = false, ...updatedChallenge }) => ({
        // url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE_BY_ID(id),
        url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE_BY_ID(id, isGlobal),
        method: 'PUT',
        body: updatedChallenge,
      }),
      // invalidatesTags: ['challenge'],
      invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalChallenge'] : ['challenge']),
    }),

    deleteChallenge: builder.mutation({
      query: ({ id, isGlobal = false }) => ({
        // url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE_BY_ID(id),
        url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE_BY_ID(id, isGlobal),
        method: 'DELETE',
      }),
      // invalidatesTags: ['challenge'],
      invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalChallenge'] : ['challenge']),
    }),
  }),
});

export const { useGetChallengesQuery, useAddChallengeMutation, useUpdateChallengeMutation, useDeleteChallengeMutation } = challengesApi;
