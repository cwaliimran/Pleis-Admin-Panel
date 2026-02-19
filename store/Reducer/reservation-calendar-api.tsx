import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const reservationCalendarApi = createApi({
  reducerPath: 'reservationCalendarApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['reservation-calendar'],

  endpoints: (builder) => ({
    getReservationCalendar: builder.query({
      query: ({ organization, date }) => {
        const params: any = {};

        if (date) params.date = date;
        if (organization) params.organization = organization;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_RESERVATION_CALENDAR,
            organizerRoute: API_ROUTES.ORGANIZER_RESERVATION_CALENDAR,
            // adminOnlyParams: ['organization'],
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
      }),
      providesTags: ['reservation-calendar'],
    }),

    copyBookingOnMultipleDates: builder.mutation({
      query: ({ reservations, dates }) => ({
        url: '',
        method: 'POST',
        body: { reservations, dates },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_RESERVATION_COPY,
          organizerRoute: API_ROUTES.ORGANIZER_RESERVATION_COPY,
        },
      }),
      invalidatesTags: ['reservation-calendar'],
    }),

    copyReservationSlots: builder.mutation({
      query: ({ data }) => ({
        url: '',
        method: 'POST',
        body: data,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_RESERVATION_COPY_SLOTS,
          organizerRoute: API_ROUTES.ORGANIZER_RESERVATION_COPY_SLOTS,
        },
      }),
      invalidatesTags: ['reservation-calendar'],
    }),

    updateReservationsTiming: builder.mutation({
      query: ({ updatedData }) => ({
        url: '',
        method: 'PUT',
        body: updatedData,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_RESERVATION_CHANGE_TIMING,
          organizerRoute: API_ROUTES.ORGANIZER_RESERVATION_CHANGE_TIMING,
        },
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

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const reservationCalendarApi = createApi({
//   reducerPath: 'reservationCalendarApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['reservation-calendar'],

//   endpoints: (builder) => ({
//     getReservationCalendar: builder.query({
//       query: ({ organization, date }) => {
//         const params: any = {};
//         if (date) (params as any).date = date;
//         if (organization) (params as any).organization = organization;
//         return {
//           url: API_ROUTES.ADMIN_RESERVATION_CALENDAR,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//       }),
//       providesTags: ['reservation-calendar'],
//     }),

//     copyBookingOnMultipleDates: builder.mutation({
//       query: ({ reservations, dates }) => ({
//         url: API_ROUTES.ADMIN_RESERVATION_COPY,
//         method: 'POST',
//         body: { reservations, dates },
//       }),
//       invalidatesTags: ['reservation-calendar'],
//     }),

//     copyReservationSlots: builder.mutation({
//       query: ({ data }) => ({
//         url: API_ROUTES.ADMIN_RESERVATION_COPY_SLOTS,
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: ['reservation-calendar'],
//     }),

//     updateReservationsTiming: builder.mutation({
//       query: ({ updatedData }) => ({
//         url: API_ROUTES.ADMIN_RESERVATION_CHANGE_TIMING,
//         method: 'PUT',
//         body: updatedData,
//       }),
//       invalidatesTags: ['reservation-calendar'],
//     }),
//   }),
// });

// export const {
//   useGetReservationCalendarQuery,
//   useCopyBookingOnMultipleDatesMutation,
//   useCopyReservationSlotsMutation,
//   useUpdateReservationsTimingMutation,
// } = reservationCalendarApi;
