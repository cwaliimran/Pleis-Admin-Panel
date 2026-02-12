import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const challengesApi = createApi({
  reducerPath: 'challengesApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
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

        if (date) params.date = date;
        if (!isGlobal && companyOrganizer) params.companyOrganizer = companyOrganizer;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_LOYALTY_CHALLENGE(isGlobal),
            organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_CHALLENGE,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: (result, error, arg) => (arg.isGlobal ? ['globalChallenge'] : ['challenge']),
    }),

    addChallenge: builder.mutation({
      query: ({ isGlobal = false, ...newChallenge }) => ({
        url: '',
        method: 'POST',
        body: newChallenge,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_CHALLENGE(isGlobal),
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_CHALLENGE,
        },
      }),
      invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalChallenge'] : ['challenge']),
    }),

    updateChallenge: builder.mutation({
      query: ({ id, isGlobal = false, ...updatedChallenge }) => ({
        url: '',
        method: 'PUT',
        body: updatedChallenge,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_CHALLENGE_BY_ID(id, isGlobal),
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_CHALLENGE_BY_ID(id),
        },
      }),
      invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalChallenge'] : ['challenge']),
    }),

    deleteChallenge: builder.mutation({
      query: ({ id, isGlobal = false }) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_CHALLENGE_BY_ID(id, isGlobal),
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_CHALLENGE_BY_ID(id),
        },
      }),
      invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalChallenge'] : ['challenge']),
    }),
  }),
});

export const { useGetChallengesQuery, useAddChallengeMutation, useUpdateChallengeMutation, useDeleteChallengeMutation } = challengesApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const challengesApi = createApi({
//   reducerPath: 'challengesApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['challenge', 'globalChallenge'],

//   endpoints: (builder) => ({
//     getChallenges: builder.query({
//       query: ({ search, page, status, date, limit, companyOrganizer, isGlobal = false }) => {
//         const params: any = {
//           keyword: search,
//           status,
//           page: page + 1,
//           limit,
//         };
//         if (date) (params as any).date = date;
//         // if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
//         if (!isGlobal && companyOrganizer) params.companyOrganizer = companyOrganizer;
//         return {
//           // url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE,
//           url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE(isGlobal),
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       // providesTags: ['challenge'],
//       providesTags: (result, error, arg) => (arg.isGlobal ? ['globalChallenge'] : ['challenge']),
//     }),

//     addChallenge: builder.mutation({
//       query: ({ isGlobal = false, ...newChallenge }) => ({
//         // url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE,
//         url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE(isGlobal),
//         method: 'POST',
//         body: newChallenge,
//       }),
//       // invalidatesTags: ['challenge'],
//       invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalChallenge'] : ['challenge']),
//     }),

//     updateChallenge: builder.mutation({
//       query: ({ id, isGlobal = false, ...updatedChallenge }) => ({
//         // url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE_BY_ID(id),
//         url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE_BY_ID(id, isGlobal),
//         method: 'PUT',
//         body: updatedChallenge,
//       }),
//       // invalidatesTags: ['challenge'],
//       invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalChallenge'] : ['challenge']),
//     }),

//     deleteChallenge: builder.mutation({
//       query: ({ id, isGlobal = false }) => ({
//         // url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE_BY_ID(id),
//         url: API_ROUTES.ADMIN_LOYALTY_CHALLENGE_BY_ID(id, isGlobal),
//         method: 'DELETE',
//       }),
//       // invalidatesTags: ['challenge'],
//       invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalChallenge'] : ['challenge']),
//     }),
//   }),
// });

// export const { useGetChallengesQuery, useAddChallengeMutation, useUpdateChallengeMutation, useDeleteChallengeMutation } = challengesApi;
