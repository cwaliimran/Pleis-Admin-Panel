import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const rewardsApi = createApi({
  reducerPath: 'rewardsApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['reward', 'globalReward'],

  endpoints: (builder) => ({
    getRewards: builder.query({
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
            adminRoute: API_ROUTES.ADMIN_LOYALTY_REWARDS(isGlobal),
            organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_REWARDS,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: (result, error, arg) => (arg.isGlobal ? ['globalReward'] : ['reward']),
    }),

    addReward: builder.mutation({
      query: ({ isGlobal = false, ...newReward }) => ({
        url: '',
        method: 'POST',
        body: newReward,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_REWARDS(isGlobal),
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_REWARDS,
        },
      }),
      invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalReward'] : ['reward']),
    }),

    updateReward: builder.mutation({
      query: ({ id, isGlobal = false, ...updatedReward }) => ({
        url: '',
        method: 'PUT',
        body: updatedReward,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_REWARDS_BY_ID(id, isGlobal),
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_REWARDS_BY_ID(id),
        },
      }),
      invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalReward'] : ['reward']),
    }),

    deleteReward: builder.mutation({
      query: ({ id, isGlobal = false }) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_REWARDS_BY_ID(id, isGlobal),
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_REWARDS_BY_ID(id),
        },
      }),
      invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalReward'] : ['reward']),
    }),

    rewardPointCalculator: builder.mutation({
      query: ({ data }) => ({
        url: '',
        method: 'POST',
        body: data,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_POINT_CAL,
          organizerRoute: API_ROUTES.ORGANIZER_POINT_CAL,
        },
      }),
    }),
  }),
});

export const { useGetRewardsQuery, useRewardPointCalculatorMutation, useAddRewardMutation, useUpdateRewardMutation, useDeleteRewardMutation } =
  rewardsApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const rewardsApi = createApi({
//   reducerPath: 'rewardsApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['reward', 'globalReward'],

//   endpoints: (builder) => ({
//     getRewards: builder.query({
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
//           // url: API_ROUTES.ADMIN_LOYALTY_REWARDS,
//           url: API_ROUTES.ADMIN_LOYALTY_REWARDS(isGlobal),
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       // providesTags: ['reward'],
//       providesTags: (result, error, arg) => (arg.isGlobal ? ['globalReward'] : ['reward']),
//     }),

//     addReward: builder.mutation({
//       query: ({ isGlobal = false, ...newReward }) => ({
//         url: API_ROUTES.ADMIN_LOYALTY_REWARDS(isGlobal),
//         method: 'POST',
//         body: newReward,
//       }),
//       // invalidatesTags: ['reward'],
//       invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalReward'] : ['reward']),
//     }),

//     updateReward: builder.mutation({
//       query: ({ id, isGlobal = false, ...updatedReward }) => ({
//         url: API_ROUTES.ADMIN_LOYALTY_REWARDS_BY_ID(id, isGlobal),
//         method: 'PUT',
//         body: updatedReward,
//       }),
//       // invalidatesTags: ['reward'],
//       invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalReward'] : ['reward']),
//     }),

//     deleteReward: builder.mutation({
//       query: ({ id, isGlobal = false }) => ({
//         // url: API_ROUTES.ADMIN_LOYALTY_REWARDS_BY_ID(id),
//         url: API_ROUTES.ADMIN_LOYALTY_REWARDS_BY_ID(id, isGlobal),
//         method: 'DELETE',
//       }),
//       // invalidatesTags: ['reward'],
//       invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalReward'] : ['reward']),
//     }),

//     rewardPointCalculator: builder.mutation({
//       query: ({ data }) => ({
//         url: API_ROUTES.ADMIN_POINT_CAL,
//         method: 'POST',
//         body: data,
//       }),
//       // invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalReward'] : ['reward']),
//     }),
//   }),
// });

// export const { useGetRewardsQuery, useRewardPointCalculatorMutation, useAddRewardMutation, useUpdateRewardMutation, useDeleteRewardMutation } =
//   rewardsApi;
