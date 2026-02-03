import { createApi } from '@reduxjs/toolkit/query/react';
import { ReservationsApiResponse, UserReservationsApiResponse } from '../../sections/reservation-modules/reservation-view/reservation-types';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const reservationsApi = createApi({
  reducerPath: 'reservationsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['reservation', 'userReservation'],

  endpoints: (builder) => ({
    getReservations: builder.query<
      ReservationsApiResponse,
      {
        page: number;
        limit: number;
        range?: string;
        date?: string;
        companyOrganizer?: string;
        organizationsId?: string;
        status?: string;
      }
    >({
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

        if (companyOrganizer) {
          params.companyOrganizer = companyOrganizer;
        }

        if (organizationsId) {
          params.organizationsId = organizationsId;
        }

        if (status) {
          params.status = status;
        }

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
    }),

    getUserReservations: builder.query<UserReservationsApiResponse, { reservationId: string; organizationId?: string }>({
      query: ({ reservationId, organizationId }) => {
        const params: Record<string, string> = {};
        if (reservationId) params.reservationId = reservationId;
        // if (companyOrganizer) params.companyOrganizer = companyOrganizer;
        if (organizationId) params.organizationsId = organizationId;
        return {
          url: API_ROUTES.ADMIN_USERS_RESERVATION,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['userReservation'],
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
      invalidatesTags: ['userReservation'],
    }),

    updateReservationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: API_ROUTES.ADMIN_UPDATE_RESERVATION_STATUS(id, status),
        method: 'PUT',
      }),
      invalidatesTags: ['userReservation'],
    }),

    deleteReservation: builder.mutation({
      query: ({ id }) => ({
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
