import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const referralsApi = createApi({
  reducerPath: 'referralsApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['referrals', 'globalReferral', 'localReferral'],

  endpoints: (builder) => ({
    getReferrals: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer, isGlobal = false }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };

        if (date) params.date = date;
        if (companyOrganizer && !isGlobal) params.companyOrganizer = companyOrganizer;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_REFERRALS(isGlobal),
            organizerRoute: API_ROUTES.ORGANIZER_REFERRALS,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: (result, error, arg) => {
        if (arg.isGlobal) {
          return ['globalReferral'];
        }
        return ['referrals', 'localReferral'];
      },
    }),

    /* --------------------------------
    Global Referral Settings Endpoints
    -------------------------------- */

    getGlobalReferralSetting: builder.query({
      query: () => {
        return {
          url: API_ROUTES.ADMIN_GLOBAL_REFERRALS_SETTING,
          method: 'GET',
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['globalReferral'],
    }),

    addGlobalReferralSetting: builder.mutation({
      query: (data) => ({
        url: API_ROUTES.ADMIN_GLOBAL_REFERRALS_SETTING,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['globalReferral'],
    }),

    updateGlobalReferralSetting: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: API_ROUTES.ADMIN_GLOBAL_REFERRALS_SETTING_BY_ID(id),
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['globalReferral'],
    }),

    resetGlobalReferralSetting: builder.mutation({
      query: () => ({
        url: API_ROUTES.ADMIN_GLOBAL_REFERRALS_SETTING_RESET,
        method: 'GET',
      }),
      invalidatesTags: ['globalReferral'],
    }),

    /* --------------------------------
    Local Referral Settings Endpoints
    -------------------------------- */

    getLocalReferralSetting: builder.query({
      query: ({ companyOrganizer }) => {
        const params: any = {};
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_LOCAL_REFERRALS_SETTING,
            organizerRoute: API_ROUTES.ORGANIZER_LOCAL_REFERRALS_SETTING,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['localReferral'],
    }),

    addLocalReferralSetting: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOCAL_REFERRALS_SETTING,
          organizerRoute: API_ROUTES.ORGANIZER_LOCAL_REFERRALS_SETTING,
        },
      }),
      invalidatesTags: ['localReferral'],
    }),

    updateLocalReferralSetting: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: '',
        method: 'PUT',
        body: updatedData,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOCAL_REFERRALS_SETTING_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_LOCAL_REFERRALS_SETTING_BY_ID(id),
        },
      }),
      invalidatesTags: ['localReferral'],
    }),

    resetLocalReferralSetting: builder.mutation({
      query: () => ({
        url: '',
        method: 'GET',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOCAL_REFERRALS_SETTING_RESET,
          organizerRoute: API_ROUTES.ORGANIZER_LOCAL_REFERRALS_SETTING_RESET,
        },
      }),
      invalidatesTags: ['localReferral'],
    }),

    referralGlobalAnalytics: builder.query({
      query: () => ({
        url: '',
        method: 'GET',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_GLOBAL_REFERRAL_ANALYTICS,
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
      }),
    }),

    referralLoyaltyAnalytics: builder.query({
      query: ({ companyOrganizer }) => {
        const params: any = {};
          if (companyOrganizer) params.companyOrganizer = companyOrganizer;
          return {
            url: '',
            method: 'GET',
            params,
            roleBasedRouting: {
              adminRoute: API_ROUTES.ADMIN_LOYALTY_REFERRAL_ANALYTICS,
              organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_REFERRAL_ANALYTICS,
            },
          };
        },
          transformResponse: (res) => ({
            data: res.data,
          }),
        }),
  }),
});

export const {
  useGetReferralsQuery,
  // global
  useGetGlobalReferralSettingQuery,
  useAddGlobalReferralSettingMutation,
  useResetGlobalReferralSettingMutation,
  useUpdateGlobalReferralSettingMutation,
  useReferralGlobalAnalyticsQuery,
  // local
  useGetLocalReferralSettingQuery,
  useAddLocalReferralSettingMutation,
  useResetLocalReferralSettingMutation,
  useUpdateLocalReferralSettingMutation,
  useReferralLoyaltyAnalyticsQuery,
} = referralsApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// // import { customFetchBaseQuery } from '../customFetchBaseQuery';
// import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

// export const referralsApi = createApi({
//   reducerPath: 'referralsApi',
//   baseQuery: customFetchBaseQueryWithRoleRouting(),
//   tagTypes: ['referrals', 'globalReferral', 'localReferral'],

//   endpoints: (builder) => ({
//     getReferrals: builder.query({
//       query: ({ search, page, status, date, limit, companyOrganizer, isGlobal = false }) => {
//         const params: any = {
//           keyword: search,
//           status,
//           page: page + 1,
//           limit,
//         };
//         if (date) (params as any).date = date;
//         // if (companyOrganizer) params.companyOrganizer = companyOrganizer;
//         if (companyOrganizer && !isGlobal) params.companyOrganizer = companyOrganizer;
//         return {
//           url: API_ROUTES.ADMIN_REFERRALS(isGlobal),
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: (result, error, arg) => {
//         if (arg.isGlobal) {
//           return ['globalReferral'];
//         }
//         return ['referrals', 'localReferral'];
//       },
//     }),

//     /* --------------------------------
//     Global Referral Settings Endpoints
//     -------------------------------- */

//     getGlobalReferralSetting: builder.query({
//       query: () => {
//         return {
//           url: API_ROUTES.ADMIN_GLOBAL_REFERRALS_SETTING,
//           method: 'GET',
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['globalReferral'],
//     }),

//     addGlobalReferralSetting: builder.mutation({
//       query: (data) => ({
//         url: API_ROUTES.ADMIN_GLOBAL_REFERRALS_SETTING,
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: ['globalReferral'],
//     }),

//     updateGlobalReferralSetting: builder.mutation({
//       query: ({ id, ...updatedData }) => ({
//         url: API_ROUTES.ADMIN_GLOBAL_REFERRALS_SETTING_BY_ID(id),
//         method: 'PUT',
//         body: updatedData,
//       }),
//       invalidatesTags: ['globalReferral'],
//     }),

//     resetGlobalReferralSetting: builder.mutation({
//       query: () => ({
//         url: API_ROUTES.ADMIN_GLOBAL_REFERRALS_SETTING_RESET,
//         method: 'GET',
//         // body: data,
//       }),
//       invalidatesTags: ['globalReferral'],
//     }),

//     /* --------------------------------
//     Local Referral Settings Endpoints
//     -------------------------------- */

//     getLocalReferralSetting: builder.query({
//       query: ({ companyOrganizer }) => {
//         const params: any = {};
//         if (companyOrganizer) params.companyOrganizer = companyOrganizer;

//         return {
//           url: API_ROUTES.ADMIN_LOCAL_REFERRALS_SETTING,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['localReferral'],
//     }),

//     addLocalReferralSetting: builder.mutation({
//       query: (data) => ({
//         url: API_ROUTES.ADMIN_LOCAL_REFERRALS_SETTING,
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: ['localReferral'],
//     }),

//     updateLocalReferralSetting: builder.mutation({
//       query: ({ id, ...updatedData }) => ({
//         url: API_ROUTES.ADMIN_LOCAL_REFERRALS_SETTING_BY_ID(id),
//         method: 'PUT',
//         body: updatedData,
//       }),
//       invalidatesTags: ['localReferral'],
//     }),

//     resetLocalReferralSetting: builder.mutation({
//       query: () => ({
//         url: API_ROUTES.ADMIN_LOCAL_REFERRALS_SETTING_RESET,
//         method: 'GET',
//         // body: data,
//       }),
//       invalidatesTags: ['localReferral'],
//     }),
//   }),
// });

// export const {
//   useGetReferralsQuery,
//   // global
//   useGetGlobalReferralSettingQuery,
//   useAddGlobalReferralSettingMutation,
//   useResetGlobalReferralSettingMutation,
//   useUpdateGlobalReferralSettingMutation,
//   // local
//   useGetLocalReferralSettingQuery,
//   useAddLocalReferralSettingMutation,
//   useResetLocalReferralSettingMutation,
//   useUpdateLocalReferralSettingMutation,
// } = referralsApi;
