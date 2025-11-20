// /store/Reducer/reservations-api.ts (Updated for Typescript safety)

import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';
import { ReservationsApiResponse, UserReservationsApiResponse } from '../../sections/reservation/reservation-view/reservation-types'; // Import new types

export const reservationsApi = createApi({
  reducerPath: 'reservationsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['reservation'],

  endpoints: (builder) => ({
    getReservations: builder.query<ReservationsApiResponse, { page: number; range: string; date?: string; limit: number; companyOrganizer?: string }>(
      {
        query: ({ page, range, date, limit, companyOrganizer }) => {
          const params: Record<string, any> = {
            page: page + 1,
            limit,
          };
          if (date) params.date = date;
          if (range) params.range = range;
          if (companyOrganizer) params.companyOrganizer = companyOrganizer;
          return {
            url: API_ROUTES.ADMIN_RESERVATION,
            method: 'GET',
            params,
          };
        },
        transformResponse: (res: any) => ({
          data: res.data,
          meta: res.meta,
        }),
        providesTags: ['reservation'],
      }
    ),

    getUserReservations: builder.query<UserReservationsApiResponse, { reservationId: string; companyOrganizer: string }>({
      query: ({ reservationId, companyOrganizer }) => {
        const params: Record<string, any> = {};
        if (reservationId) params.reservationId = reservationId;
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;
        return {
          url: API_ROUTES.ADMIN_USERS_RESERVATION,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta, // Ensure meta is included if the API returns it
      }),
      providesTags: ['reservation'],
    }),

    addReservation: builder.mutation({
      query: (newReservation) => ({
        url: API_ROUTES.ADMIN_RESERVATION,
        method: 'POST',
        body: newReservation,
      }),
      invalidatesTags: ['reservation'],
    }),

    updateReservation: builder.mutation({
      query: ({ id, ...updatedReservation }) => ({
        url: API_ROUTES.ADMIN_RESERVATION_BY_ID(id),
        method: 'PUT',
        body: updatedReservation,
      }),
      invalidatesTags: ['reservation'],
    }),

    updateUserReservation: builder.mutation({
      query: ({ userId, id, ...updatedReservation }) => ({
        url: API_ROUTES.ADMIN_UPDATE_USER_RESERVATION(userId, id),
        method: 'PUT',
        body: updatedReservation,
      }),
      invalidatesTags: ['reservation'],
    }),

    updateReservationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: API_ROUTES.ADMIN_UPDATE_RESERVATION_STATUS(id, status),
        method: 'PUT',
      }),
      invalidatesTags: ['reservation'],
    }),

    deleteReservation: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_RESERVATION_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['reservation'],
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
} = reservationsApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const reservationsApi = createApi({
//   reducerPath: 'reservationsApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['reservation'],

//   endpoints: (builder) => ({
//     getReservations: builder.query({
//       query: ({ page, range, date, limit, companyOrganizer }) => {
//         const params: any = {
//           page: page + 1,
//           limit,
//         };
//         if (date) (params as any).date = date;
//         if (range) (params as any).range = range;
//         if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
//         return {
//           url: API_ROUTES.ADMIN_RESERVATION,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['reservation'],
//     }),

//     getUserReservations: builder.query({
//       query: ({ reservationId, companyOrganizer }) => {
//         const params: any = {};
//         if (reservationId) (params as any).reservationId = reservationId;
//         if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
//         return {
//           url: API_ROUTES.ADMIN_USERS_RESERVATION,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
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

//     updateUserReservation: builder.mutation({
//       query: ({ userId, id, ...updatedReservation }) => ({
//         url: API_ROUTES.ADMIN_UPDATE_USER_RESERVATION(userId, id),
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
//       invalidatesTags: ['reservation'],
//     }),

//     deleteReservation: builder.mutation({
//       query: (id) => ({
//         url: API_ROUTES.ADMIN_RESERVATION_BY_ID(id),
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['reservation'],
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
