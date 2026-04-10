import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const membersApi = createApi({
  reducerPath: 'membersApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['member'],

  endpoints: (builder) => ({
    getMembers: builder.query({
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
            adminRoute: API_ROUTES.ADMIN_LOYALTY_MEMBERS,
            organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_MEMBERS,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data.members,
        meta: res.meta,
      }),
      providesTags: ['member'],
    }),

    sendGiftToMember: builder.mutation({
      query: (newMember) => ({
        url: '',
        method: 'POST',
        body: newMember,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_MEMBERS_GIFT,
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_MEMBERS_GIFT,
        },
      }),
      invalidatesTags: ['member'],
    }),

    getMemberById: builder.query({
      query: ({ memberId, companyOrganizer }) => {
        const params: any = {};
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;

        return {
          url: `/${memberId}`,
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_LOYALTY_MEMBERS,
            organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_MEMBERS,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      providesTags: ['member'],
    }),

    getClubMembersAnalytics: builder.query({
      query: ({ user, companyOrganizer }) => {
        const params: any = {};
        
        if (user) params.user = user;
        // Only add companyOrganizer if it's provided (for admin)
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_LOYALTY_MEMBERS_ANALYTICS,
            organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_MEMBERS_ANALYTICS,
          },
        };
      },
      providesTags: ['member'],
    }),

    getClubMembersAnalyticsTransactions: builder.query({
      query: ({ user, companyOrganizer, page = 1, limit = 10 }) => {
        const params: any = { page, limit };

        if (user) params.user = user;
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_LOYALTY_MEMBERS_ANALYTICS_TRANSACTIONS,
            organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_MEMBERS_ANALYTICS_TRANSACTIONS,
          },
        };
      },
      transformResponse: (res: any) => ({
        data: res?.data?.transactions || res?.data?.stats || res?.data || [],
        meta: res?.data?.meta || res?.meta || {
          totalPages: 1,
          currentPage: 1,
          totalRecords: 0,
          limit: 10,
        },
      }),
      providesTags: ['member'],
    }),
      getClubMembersAnalyticsSummary: builder.query({
        query: ({ user, companyOrganizer }) => {
          const params: any = {};

          if (user) params.user = user;
          if (companyOrganizer) params.companyOrganizer = companyOrganizer;

          return {
            url: '',
            method: 'GET',
            params,
            roleBasedRouting: {
              adminRoute: API_ROUTES.ADMIN_LOYALTY_MEMBERS_ANALYTICS_SUMMARY,
              organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_MEMBERS_ANALYTICS_SUMMARY,
            },
          };
        },
        transformResponse: (res: any) => ({
          data: res?.data || {},
        }),
        providesTags: ['member'],
      }),
  }),
});

export const {
  useGetMembersQuery,
  useSendGiftToMemberMutation,
  useGetMemberByIdQuery,
  useGetClubMembersAnalyticsQuery,
  useGetClubMembersAnalyticsTransactionsQuery,
} = membersApi;

export const useGetClubMembersAnalyticsSummaryQuery =
  membersApi.endpoints.getClubMembersAnalyticsSummary.useQuery;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const membersApi = createApi({
//   reducerPath: 'membersApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['member'],

//   endpoints: (builder) => ({
//     getMembers: builder.query({
//       query: ({ search, page, status, date, limit, companyOrganizer }) => {
//         const params: any = {
//           keyword: search,
//           status,
//           page: page + 1,
//           limit,
//         };
//         if (date) (params as any).date = date;
//         if (companyOrganizer) params.companyOrganizer = companyOrganizer;
//         return {
//           url: API_ROUTES.ADMIN_LOYALTY_MEMBERS,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data.members,
//         meta: res.meta,
//       }),
//       providesTags: ['member'],
//     }),

//     sendGiftToMember: builder.mutation({
//       query: (newMember) => ({
//         url: API_ROUTES.ADMIN_LOYALTY_MEMBERS_GIFT,
//         method: 'POST',
//         body: newMember,
//       }),
//       // invalidatesTags: ['member'],
//     }),
//   }),
// });

// export const { useGetMembersQuery, useSendGiftToMemberMutation } = membersApi;
