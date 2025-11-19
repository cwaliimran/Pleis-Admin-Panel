import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const reservationsApi = createApi({
  reducerPath: 'reservationsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['reservation'],

  endpoints: (builder) => ({
    getReservations: builder.query({
      query: ({ page, range, date, limit, companyOrganizer }) => {
        const params: any = {
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        if (range) (params as any).range = range;
        if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
        return {
          url: API_ROUTES.ADMIN_RESERVATION,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
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

    deleteReservation: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_RESERVATION_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['reservation'],
    }),
  }),
});

export const { useGetReservationsQuery, useAddReservationMutation, useUpdateReservationMutation, useDeleteReservationMutation } = reservationsApi;
