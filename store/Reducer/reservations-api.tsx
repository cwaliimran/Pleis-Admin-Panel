import { createApi } from '@reduxjs/toolkit/query/react';
import { UserReservationsApiResponse } from '../../sections/reservation-modules/reservation-view/reservation-types';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const reservationsApi = createApi({
  reducerPath: 'reservationsApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['reservation', 'userReservation'],

  endpoints: (builder) => ({
    getReservations: builder.query({
      query: ({ page, limit, range, date, companyOrganizer, organizationsId, status }) => {
        const params: Record<string, string | number> = {
          page: page + 1,
          limit,
        };

        if (date) {
          params.date = date;
        } else if (range) {
          params.range = range;
        }

        if (companyOrganizer) params.companyOrganizer = companyOrganizer;
        if (organizationsId) params.organizationsId = organizationsId;
        if (status) params.status = status;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_RESERVATION,
            organizerRoute: API_ROUTES.ORGANIZER_RESERVATION,
            // adminOnlyParams: ['companyOrganizer', 'organizationsId'],
          },
        };
      },
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['reservation'],
    }),

    addReservation: builder.mutation({
      query: (newReservation) => ({
        url: '',
        method: 'POST',
        body: newReservation,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_RESERVATION,
          organizerRoute: API_ROUTES.ORGANIZER_RESERVATION,
        },
      }),
      invalidatesTags: ['reservation'],
    }),

    updateReservation: builder.mutation({
      query: ({ id, ...updatedReservation }) => ({
        url: '',
        method: 'PUT',
        body: updatedReservation,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_RESERVATION_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_RESERVATION_BY_ID(id),
        },
      }),
      invalidatesTags: ['reservation'],
    }),

    updateReservationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: '',
        method: 'PUT',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_UPDATE_RESERVATION_STATUS(id, status),
          organizerRoute: API_ROUTES.ORGANIZER_UPDATE_RESERVATION_STATUS(id, status),
        },
      }),
      invalidatesTags: ['userReservation'],
    }),

    deleteReservation: builder.mutation({
      query: ({ id }) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_RESERVATION_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_RESERVATION_BY_ID(id),
        },
      }),
      invalidatesTags: ['reservation'],
    }),

    // User Reservations
    getUserReservations: builder.query<UserReservationsApiResponse, { reservationId: string; organizationId?: string }>({
      query: ({ reservationId, organizationId }) => {
        const params: Record<string, string> = {};

        if (reservationId) params.reservationId = reservationId;
        if (organizationId) params.organizationsId = organizationId;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_USERS_RESERVATION,
            organizerRoute: API_ROUTES.ORGANIZER_USERS_RESERVATION,
            // adminOnlyParams: ['organizationsId'],
          },
        };
      },
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['userReservation'],
    }),

    updateUserReservation: builder.mutation({
      query: ({ userId, id, ...updatedReservation }) => ({
        url: '',
        method: 'PUT',
        body: updatedReservation,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_UPDATE_USER_RESERVATION(userId, id),
          organizerRoute: API_ROUTES.ORGANIZER_UPDATE_USER_RESERVATION(userId, id),
        },
      }),
      invalidatesTags: ['userReservation'],
    }),


    getReservationsAnalytics: builder.query({
      query: ({organizations}) => {
       const params: any = {};
        if (organizations) {
           params.organizations = organizations;
         }
        return {
          url: '',
          params,
          method: 'GET',
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_RESERVATION_ANALYTICS,
            organizerRoute: '/organizer/reservations-analytics',
          },
        };
      },
      transformResponse: (res: any) => ({
        data: res.data,
      }),
    }),

    getReservationTransactions: builder.query<any, { page: number; limit: number; organizations?: string[] }>({
      query: ({ page, limit, organizations }) =>  {
        const params: any = { page, limit };
        if (organizations) {
          params.organizations = organizations;
        }
        return {
          url: `/admin/reservations-analytics/analytics-transsections`,
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: `/admin/reservations-analytics/analytics-transsections`,
            organizerRoute: '/organizer/reservations-analytics/analytics-transsections',
        },
      }},
    }),

    getStaffChangeLogs: builder.query<any, { page?: number; limit?: number; organizations?: string[] }>({
      query: ({ page = 1, limit = 10, organizations } = {}) => {
          const params: any = { page, limit };
        if (organizations) {
          params.organizations = organizations;
        }
        return {    
        url: `/admin/reservations-analytics/change-logs`,
        method: 'GET',
        params,
        roleBasedRouting: {
          adminRoute: `/admin/reservations-analytics/change-logs`,
          organizerRoute: '/organizer/reservations-analytics/change-logs',
        },
      }},
    }),

  }),
});

export const {
  useGetReservationsQuery,
  useGetUserReservationsQuery,
  useAddReservationMutation,
  useUpdateReservationMutation,
  useUpdateUserReservationMutation,
  useUpdateReservationStatusMutation,
  useDeleteReservationMutation,
  useGetReservationsAnalyticsQuery,
  useGetReservationTransactionsQuery,
  useGetStaffChangeLogsQuery,
} = reservationsApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import { ReservationsApiResponse, UserReservationsApiResponse } from '../../sections/reservation-modules/reservation-view/reservation-types';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const reservationsApi = createApi({
//   reducerPath: 'reservationsApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['reservation', 'userReservation'],

//   endpoints: (builder) => ({
//     getReservations: builder.query<
//       ReservationsApiResponse,
//       {
//         page: number;
//         limit: number;
//         range?: string;
//         date?: string;
//         companyOrganizer?: string;
//         organizationsId?: string;
//         status?: string;
//       }
//     >({
//       query: ({ page, limit, range, date, companyOrganizer, organizationsId, status }) => {
//         const params: Record<string, string | number> = {
//           page: page + 1,
//           limit,
//         };

//         if (date) {
//           params.date = date;
//         } else if (range) {
//           params.range = range;
//         }

//         if (companyOrganizer) {
//           params.companyOrganizer = companyOrganizer;
//         }

//         if (organizationsId) {
//           params.organizationsId = organizationsId;
//         }

//         if (status) {
//           params.status = status;
//         }

//         return {
//           url: API_ROUTES.ADMIN_RESERVATION,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res: any) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['reservation'],
//     }),

//     addReservation: builder.mutation({
//       query: (newReservation) => ({
//         url: API_ROUTES.ADMIN_RESERVATION,
//         method: 'POST',
//         body: newReservation,
//       }),
//       invalidatesTags: ['reservation'],
//     }),

//     updateReservation: builder.mutation({
//       query: ({ id, ...updatedReservation }) => ({
//         url: API_ROUTES.ADMIN_RESERVATION_BY_ID(id),
//         method: 'PUT',
//         body: updatedReservation,
//       }),
//       invalidatesTags: ['reservation'],
//     }),

//     updateReservationStatus: builder.mutation({
//       query: ({ id, status }) => ({
//         url: API_ROUTES.ADMIN_UPDATE_RESERVATION_STATUS(id, status),
//         method: 'PUT',
//       }),
//       invalidatesTags: ['userReservation'],
//     }),

//     deleteReservation: builder.mutation({
//       query: ({ id }) => ({
//         url: API_ROUTES.ADMIN_RESERVATION_BY_ID(id),
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['reservation'],
//     }),

//     // User Reservations
//     getUserReservations: builder.query<UserReservationsApiResponse, { reservationId: string; organizationId?: string }>({
//       query: ({ reservationId, organizationId }) => {
//         const params: Record<string, string> = {};
//         if (reservationId) params.reservationId = reservationId;
//         // if (companyOrganizer) params.companyOrganizer = companyOrganizer;
//         if (organizationId) params.organizationsId = organizationId;
//         return {
//           url: API_ROUTES.ADMIN_USERS_RESERVATION,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res: any) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['userReservation'],
//     }),

//     updateUserReservation: builder.mutation({
//       query: ({ userId, id, ...updatedReservation }) => ({
//         url: API_ROUTES.ADMIN_UPDATE_USER_RESERVATION(userId, id),
//         method: 'PUT',
//         body: updatedReservation,
//       }),
//       invalidatesTags: ['userReservation'],
//     }),
//   }),
// });

// export const {
//   useGetReservationsQuery,
//   useGetUserReservationsQuery,
//   useAddReservationMutation,
//   useUpdateReservationMutation,
//   useUpdateUserReservationMutation,
//   useUpdateReservationStatusMutation,
//   useDeleteReservationMutation,
// } = reservationsApi;
