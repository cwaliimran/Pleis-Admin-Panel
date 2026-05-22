import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['event'],

  endpoints: (builder) => ({
    getevents: builder.query({
      query: ({ search, page, status, startDate, endDate, limit, organization, sortBy, sortOrder }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };

        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (organization) params.organization = organization;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_EVENTS,
            organizerRoute: API_ROUTES.ORGANIZER_EVENTS,
            // adminOnlyParams: ['organization'],
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['event'],
    }),

    geteventById: builder.query({
      query: (id) => ({
        url: '',
        method: 'GET',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_EVENTS_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_EVENTS_BY_ID(id),
        },
      }),
      transformResponse: (res) => res.data,
      providesTags: ['event'],
    }),

    addevent: builder.mutation({
      query: (newevent) => ({
        url: '',
        method: 'POST',
        body: newevent,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_EVENTS,
          organizerRoute: API_ROUTES.ORGANIZER_EVENTS,
        },
      }),
      invalidatesTags: ['event'],
    }),

    cloneevent: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'POST',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_EVENTS_BY_ID(id) + '/clone',
          organizerRoute: API_ROUTES.ORGANIZER_EVENTS_BY_ID(id) + '/clone',
        },
      }),
      invalidatesTags: ['event'],
    }),

    updateevent: builder.mutation({
      query: ({ id, scope, ...updatedevent }) => ({
        url: '',
        method: 'PUT',
        body: updatedevent,
        roleBasedRouting: {
          adminRoute: scope ? API_ROUTES.UPDATE_ADMIN_EVENTS_BY_ID_AND_SCOPE(id, scope) : API_ROUTES.ADMIN_EVENTS_BY_ID(id),
          organizerRoute: scope ? API_ROUTES.UPDATE_ORGANIZER_EVENTS_BY_ID_AND_SCOPE(id, scope) : API_ROUTES.ORGANIZER_EVENTS_BY_ID(id),
        },
      }),
      invalidatesTags: ['event'],
    }),

    deleteevent: builder.mutation({
      query: (payload) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.DELETE_ADMIN_EVENTS_BY_ID_AND_SCOPE(payload.id, payload.scope),
          organizerRoute: API_ROUTES.DELETE_ORGANIZER_EVENTS_BY_ID_AND_SCOPE(payload.id, payload.scope),
        },
      }),
      invalidatesTags: ['event'],
    }),

    geteventAnalyticsById: builder.query({
      query: (arg) => {
        const id = typeof arg === 'string' ? arg : arg?.id;
        const dateFilter = typeof arg === 'string' ? undefined : arg?.dateFilter ?? arg?.eventDateFilter;

        const params: Record<string, any> = {};
        if (id) params.event = id;
        if (dateFilter) params.dateFilter = dateFilter;

        return {
        url: '',
        method: 'GET',
        params,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_EVENTS_ANALYTICS,
          organizerRoute: API_ROUTES.ORGANIZER_EVENTS_ANALYTICS,
        },
      };
      },
      transformResponse: (res) => res.data,
    }),

    geteventTicketsAnalyticsById: builder.query({
      query: (id) => ({
        url: '',
        method: 'GET',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_EVENTS_TICKETS_ANALYTICS_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_EVENTS_TICKETS_ANALYTICS_BY_ID(id),
        },
      }),
      transformResponse: (res) => res.data,
    }),

    geteventNotificationsById: builder.query({
      query: ({ id, page, limit }) => ({
        url: '',
        method: 'GET',
        params: {
          page: page + 1,
          limit,
        },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_EVENTS_NOTIFICATIONS_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_EVENTS_NOTIFICATIONS_BY_ID(id),
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),

    geteventFeedbackById: builder.query({
      query: ({ id, search, page, limit }) => {
        const params: any = {
          keyword: search,
          page: page + 1,
          limit,
        };

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_EVENTS_FEEDBACK_BY_ID(id),
            organizerRoute: API_ROUTES.ORGANIZER_EVENTS_FEEDBACK_BY_ID(id),
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['event'],
    }),

    getEventsByCompanyOrganizer: builder.query({
      query: ({ companyOrganizer }) => ({
        url: '',
        method: 'GET',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_EVENTS_BY_COMPANY_ORGANIZER(companyOrganizer),
          organizerRoute: API_ROUTES.ORGANIZER_EVENTS_BY_COMPANY_ORGANIZER(companyOrganizer),
        },
      }),
      transformResponse: (res) => res.data,
    }),

    getEventsByOrganization: builder.query({
      query: ({ organization }) => ({
        url: '',
        method: 'GET',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_EVENTS_BY_ORGANIZATION(organization),
          organizerRoute: API_ROUTES.ORGANIZER_EVENTS_BY_ORGANIZATION(organization),
        },
      }),
      transformResponse: (res) => res.data,
      providesTags: ['event'],
    }),
  }),
});

export const {
  useGeteventsQuery,
  useGeteventByIdQuery,
  useAddeventMutation,
  useCloneeventMutation,
  useUpdateeventMutation,
  useDeleteeventMutation,
  //
  useGeteventAnalyticsByIdQuery,
  useGeteventTicketsAnalyticsByIdQuery,
  useGeteventNotificationsByIdQuery,
  useGeteventFeedbackByIdQuery,
  useGetEventsByCompanyOrganizerQuery,
  useGetEventsByOrganizationQuery,
} = eventApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const eventApi = createApi({
//   reducerPath: 'eventApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['event'],

//   endpoints: (builder) => ({
//     getevents: builder.query({
//       query: ({ search, page, status, startDate, endDate, limit, organization }) => {
//         const params: any = {
//           keyword: search,
//           status,
//           page: page + 1,
//           limit,
//         };
//         if (startDate) params.startDate = startDate;
//         if (endDate) params.endDate = endDate;
//         if (organization) params.organization = organization;
//         return {
//           url: API_ROUTES.ADMIN_EVENTS,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['event'],
//     }),

//     geteventById: builder.query({
//       query: (id) => ({
//         url: API_ROUTES.ADMIN_EVENTS_BY_ID(id),
//         method: 'GET',
//       }),
//       transformResponse: (res) => res.data,
//       providesTags: ['event'],
//     }),

//     addevent: builder.mutation({
//       query: (newevent) => ({
//         url: API_ROUTES.ADMIN_EVENTS,
//         method: 'POST',
//         body: newevent,
//       }),
//       invalidatesTags: ['event'],
//     }),

//     cloneevent: builder.mutation({
//       query: (id) => ({
//         url: API_ROUTES.ADMIN_EVENTS_BY_ID(id) + '/clone',
//         method: 'POST',
//       }),
//       invalidatesTags: ['event'],
//     }),

//     updateevent: builder.mutation({
//       query: ({ id, scope, ...updatedevent }) => ({
//         url: scope ? API_ROUTES.UPDATE_ADMIN_EVENTS_BY_ID_AND_SCOPE(id, scope) : API_ROUTES.ADMIN_EVENTS_BY_ID(id),
//         method: 'PUT',
//         body: updatedevent,
//       }),
//       invalidatesTags: ['event'],
//     }),

//     deleteevent: builder.mutation({
//       query: (payload) => ({
//         url: API_ROUTES.DELETE_ADMIN_EVENTS_BY_ID_AND_SCOPE(payload.id, payload.scope),
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['event'],
//     }),

//     geteventAnalyticsById: builder.query({
//       query: (id) => ({
//         url: API_ROUTES.ADMIN_EVENTS_ANALYTICS_BY_ID(id),
//         method: 'GET',
//       }),
//       transformResponse: (res) => res.data,
//     }),

//     geteventTicketsAnalyticsById: builder.query({
//       query: (id) => ({
//         url: API_ROUTES.ADMIN_EVENTS_TICKETS_ANALYTICS_BY_ID(id),
//         method: 'GET',
//       }),
//       transformResponse: (res) => res.data,
//     }),

//     geteventNotificationsById: builder.query({
//       query: ({ id, page, limit }) => ({
//         url: API_ROUTES.ADMIN_EVENTS_NOTIFICATIONS_BY_ID(id),
//         method: 'GET',
//         params: {
//           page: page + 1,
//           limit,
//         },
//       }),
//       // transformResponse: (res) => res.data,
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//     }),

//     geteventFeedbackById: builder.query({
//       query: ({ id, search, page, limit }) => {
//         const params: any = {
//           keyword: search,
//           page: page + 1,
//           limit,
//         };
//         return {
//           url: API_ROUTES.ADMIN_EVENTS_FEEDBACK_BY_ID(id),
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['event'],
//     }),

//     getEventsByCompanyOrganizer: builder.query({
//       query: ({ companyOrganizer }) => ({
//         url: API_ROUTES.ADMIN_EVENTS_BY_COMPANY_ORGANIZER(companyOrganizer),
//         method: 'GET',
//       }),
//       transformResponse: (res) => res.data,
//     }),

//     getEventsByOrganization: builder.query({
//       query: ({ organization }) => ({
//         url: API_ROUTES.ADMIN_EVENTS_BY_ORGANIZATION(organization),
//         method: 'GET',
//       }),
//       transformResponse: (res) => res.data,
//       providesTags: ['event'],
//     }),
//   }),
// });

// export const {
//   useGeteventsQuery,
//   useGeteventByIdQuery,
//   useAddeventMutation,
//   useCloneeventMutation,
//   useUpdateeventMutation,
//   useDeleteeventMutation,
//   //
//   useGeteventAnalyticsByIdQuery,
//   useGeteventTicketsAnalyticsByIdQuery,
//   useGeteventNotificationsByIdQuery,
//   useGeteventFeedbackByIdQuery,
//   useGetEventsByCompanyOrganizerQuery,
//   useGetEventsByOrganizationQuery,
// } = eventApi;
