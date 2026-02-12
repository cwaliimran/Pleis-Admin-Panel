import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const streaksApi = createApi({
  reducerPath: 'streaksApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['streak'],

  endpoints: (builder) => ({
    getStreaks: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };

        if (date) params.date = date;
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.STREAKS,
            organizerRoute: API_ROUTES.ORGNIZER_STREAKS,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['streak'],
    }),

    getUserStreaks: builder.query({
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
            adminRoute: API_ROUTES.ADMIN_USER_STREAKS(isGlobal),
            organizerRoute: API_ROUTES.ORGANIZER_USER_STREAKS,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['streak'],
    }),

    addStreak: builder.mutation({
      query: (newStreak) => ({
        url: '',
        method: 'POST',
        body: newStreak,
        roleBasedRouting: {
          adminRoute: API_ROUTES.STREAKS,
          organizerRoute: API_ROUTES.ORGNIZER_STREAKS,
        },
      }),
      invalidatesTags: ['streak'],
    }),

    updateStreak: builder.mutation({
      query: ({ id, ...updatedStreak }) => ({
        url: '',
        method: 'PUT',
        body: updatedStreak,
        roleBasedRouting: {
          adminRoute: API_ROUTES.STREAKS_BY_ID(id),
          organizerRoute: API_ROUTES.ORGNIZER_STREAKS_BY_ID(id),
        },
      }),
      invalidatesTags: ['streak'],
    }),

    deleteStreak: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.STREAKS_BY_ID(id),
          organizerRoute: API_ROUTES.ORGNIZER_STREAKS_BY_ID(id),
        },
      }),
      invalidatesTags: ['streak'],
    }),
  }),
});

export const { useGetStreaksQuery, useGetUserStreaksQuery, useAddStreakMutation, useUpdateStreakMutation, useDeleteStreakMutation } = streaksApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const streaksApi = createApi({
//   reducerPath: 'streaksApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['streak'],

//   endpoints: (builder) => ({
//     getStreaks: builder.query({
//       query: ({ search, page, status, date, limit, companyOrganizer }) => {
//         const params: any = {
//           keyword: search,
//           status,
//           page: page + 1,
//           limit,
//         };
//         if (date) (params as any).date = date;
//         if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
//         return {
//           url: API_ROUTES.STREAKS,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['streak'],
//     }),

//     getUserStreaks: builder.query({
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
//           url: API_ROUTES.ADMIN_USER_STREAKS(isGlobal),
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['streak'],
//     }),

//     addStreak: builder.mutation({
//       query: (newStreak) => ({
//         url: API_ROUTES.STREAKS,
//         method: 'POST',
//         body: newStreak,
//       }),
//       invalidatesTags: ['streak'],
//     }),

//     updateStreak: builder.mutation({
//       query: ({ id, ...updatedStreak }) => ({
//         url: API_ROUTES.STREAKS_BY_ID(id),
//         method: 'PUT',
//         body: updatedStreak,
//       }),
//       invalidatesTags: ['streak'],
//     }),

//     deleteStreak: builder.mutation({
//       query: (id) => ({
//         url: API_ROUTES.STREAKS_BY_ID(id),
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['streak'],
//     }),
//   }),
// });

// export const { useGetStreaksQuery, useGetUserStreaksQuery, useAddStreakMutation, useUpdateStreakMutation, useDeleteStreakMutation } = streaksApi;
