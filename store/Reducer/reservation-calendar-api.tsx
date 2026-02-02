import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const reservationCalendarApi = createApi({
  reducerPath: 'reservationCalendarApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['reservation-calendar'],

  endpoints: (builder) => ({
    getReservationCalendar: builder.query({
      query: ({ organization, date }) => {
        const params: any = {};
        if (date) (params as any).date = date;
        if (organization) (params as any).organization = organization;
        return {
          url: API_ROUTES.ADMIN_RESERVATION_CALENDAR,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
      }),
      providesTags: ['reservation-calendar'],
    }),

    copyBookingOnMultipleDates: builder.mutation({
      query: ({ reservations, dates }) => ({
        url: API_ROUTES.ADMIN_RESERVATION_COPY,
        method: 'POST',
        body: { reservations, dates },
      }),
      invalidatesTags: ['reservation-calendar'],
    }),

    copyReservationSlots: builder.mutation({
      query: ({ data }) => ({
        url: API_ROUTES.ADMIN_RESERVATION_COPY_SLOTS,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['reservation-calendar'],
    }),

    updateReservationsTiming: builder.mutation({
      query: ({ updatedData }) => ({
        url: API_ROUTES.ADMIN_RESERVATION_CHANGE_TIMING,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['reservation-calendar'],
    }),
  }),
});

export const {
  useGetReservationCalendarQuery,
  useCopyBookingOnMultipleDatesMutation,
  useCopyReservationSlotsMutation,
  useUpdateReservationsTimingMutation,
} = reservationCalendarApi;
