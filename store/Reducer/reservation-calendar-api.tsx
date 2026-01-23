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
  }),
});

export const { useGetReservationCalendarQuery } = reservationCalendarApi;
