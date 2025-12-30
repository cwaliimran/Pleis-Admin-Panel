import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const giveawaysApi = createApi({
  reducerPath: 'giveawaysApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['giveaway'],

  endpoints: (builder) => ({
    getGiveaways: builder.query({
      query: ({ search, page, status, date, limit, organizationId }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };

        if (date) params.date = date;
        if (organizationId) params.organizationId = organizationId;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_GIVEAWAYS,
            organizerRoute: API_ROUTES.ORGANIZER_GIVEAWAYS,
            // adminOnlyParams: ['organizationId'], // organizer should not send this
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['giveaway'],
    }),

    addGiveaway: builder.mutation({
      query: (newGiveaway) => ({
        url: '',
        method: 'POST',
        body: newGiveaway,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_GIVEAWAYS,
          organizerRoute: API_ROUTES.ORGANIZER_GIVEAWAYS,
        },
      }),
      invalidatesTags: ['giveaway'],
    }),

    updateGiveaway: builder.mutation({
      query: ({ id, ...updatedGiveaway }) => ({
        url: '',
        method: 'PUT',
        body: updatedGiveaway,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_GIVEAWAYS_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_GIVEAWAYS_BY_ID(id),
        },
      }),
      invalidatesTags: ['giveaway'],
    }),

    deleteGiveaway: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_GIVEAWAYS_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_GIVEAWAYS_BY_ID(id),
        },
      }),
      invalidatesTags: ['giveaway'],
    }),

    /* ─────────────────────────────────────────────
     * Admin-only endpoints
     * ───────────────────────────────────────────── */

    getOrganizerGiveawayEventsAdminSide: builder.query({
      query: ({ organizationId }) => ({
        url: API_ROUTES.ADMIN_GIVEAWAYS_EVENTS,
        method: 'GET',
        params: { organizationId },
        roleBasedRouting: {
          adminOnly: true,
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
      }),
      providesTags: ['giveaway'],
    }),

    /* ─────────────────────────────────────────────
     * Organizer-only endpoints
     * ───────────────────────────────────────────── */

    getOrganizerGiveawayEvents: builder.query({
      query: () => ({
        url: API_ROUTES.ORGANIZER_GIVEAWAYS_EVENTS,
        method: 'GET',
        roleBasedRouting: {
          adminOnly: false,
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
      }),
      providesTags: ['giveaway'],
    }),

    getOrganizerGiveawayEventTickets: builder.query({
      query: ({ eventId }) => ({
        url: API_ROUTES.ORGANIZER_GIVEAWAYS_EVENTS_TICKETS,
        method: 'GET',
        params: { eventId },
        roleBasedRouting: {
          adminOnly: false,
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
      }),
      providesTags: ['giveaway'],
    }),
    /* ─────────────────────────────────────────────
     * Get Giveaway Winners (admin & organizer)
     * ───────────────────────────────────────────── */
    getGiveawayWinners: builder.query({
      query: ({ giveawayId }) => ({
        url: '',
        method: 'GET',
        params: { giveawayId },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_GIVEAWAYS_WINNERS,
          organizerRoute: API_ROUTES.ORGANIZER_GIVEAWAYS_WINNERS,
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['giveaway'],
    }),
  }),
});

export const {
  useGetGiveawaysQuery,
  useAddGiveawayMutation,
  useUpdateGiveawayMutation,
  useDeleteGiveawayMutation,
  useGetOrganizerGiveawayEventsAdminSideQuery,
  useGetOrganizerGiveawayEventsQuery,
  useGetOrganizerGiveawayEventTicketsQuery,
  useGetGiveawayWinnersQuery,
} = giveawaysApi;
