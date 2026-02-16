import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const helpersApi = createApi({
  reducerPath: 'helpersApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['helper'],

  endpoints: (builder) => ({
    // GET EVENTS BY MULTIPLE ORGANIZATIONS -------------------------
    getEventByMultipleOrganization: builder.query({
      query: ({ search, page, status, date, limit, organizations }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };

        if (date) params.date = date;
        if (organizations) params.organizations = organizations;

        return {
          url: API_ROUTES.GET_EVENT_BY_MULTIPLE_ORGANIZATION,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['helper'],
    }),

    // GET ALL ORGANIZATIONS -------------------------
    getAllByOrganization: builder.query({
      query: ({ search, page, limit }) => ({
        url: API_ROUTES.ORGANIZER_GENERAL_ORGANIZATIONS,
        method: 'GET',
        params: {
          keyword: search,
          page: page + 1,
          limit,
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),

    // GET ALL EVENTS -------------------------
    getAllEvents: builder.query({
      query: ({ search, page, limit, organization }) => ({
        url: API_ROUTES.ORGANIZER_GENERAL_EVENTS,
        method: 'GET',
        params: {
          keyword: search,
          page: page + 1,
          limit,
          organization,
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),

    // GET ALL ORGANIZER TICKETS -------------------------
    getAllOrganizerTicket: builder.query({
      query: ({ search, page, limit, event }) => ({
        url: API_ROUTES.ORGANIZER_GENERAL_TICKETS,
        method: 'GET',
        params: {
          keyword: search,
          page: page + 1,
          limit,
          event,
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),

    // GET ALL ORGANIZER CATEGORIES -------------------------
    getAllOrganizerCategories: builder.query({
      query: ({ search, page, limit }) => ({
        url: API_ROUTES.ORGANIZER_GENERAL_CATEGORIES,
        method: 'GET',
        params: {
          keyword: search,
          page: page + 1,
          limit,
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),

    // GET ALL ORGANIZER TIERS -------------------------
    getAllOrganizerTiers: builder.query({
      query: ({ search, page, limit }) => ({
        url: API_ROUTES.ORGANIZER_GENERAL_TIERS,
        method: 'GET',
        params: {
          keyword: search,
          page: page + 1,
          limit,
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),

    // GET ALL ORGANIZER MENUS -------------------------
    getAllOrganizerMenu: builder.query({
      query: ({ search, page, limit }) => ({
        url: API_ROUTES.ORGANIZER_GENERAL_MENU,
        method: 'GET',
        params: {
          keyword: search,
          page: page + 1,
          limit,
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),

    // GET ALL ORGANIZER MENU ITEMS -------------------------
    getAllOrganizerMenuItem: builder.query({
      query: ({ search, page, limit, menu }) => ({
        url: API_ROUTES.ORGANIZER_GENERAL_MENU_ITEM,
        method: 'GET',
        params: {
          keyword: search,
          page: page + 1,
          limit,
          menu,
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),

    // GET ALL REWARDS -------------------------
    getAllCompanyRewards: builder.query({
      query: ({ search, page, limit }) => ({
        url: API_ROUTES.ORGANIZER_GENERAL_REWARDS,
        method: 'GET',
        params: {
          keyword: search,
          page: page + 1,
          limit,
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),

    // GET ALL PRESET -------------------------
    getAllCompanyPresets: builder.query({
      query: ({ search, page, limit }) => ({
        url: API_ROUTES.ORGANIZER_GENERAL_PRESETS,
        method: 'GET',
        params: {
          keyword: search,
          page: page + 1,
          limit,
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),
  }),
});

export const {
  useGetEventByMultipleOrganizationQuery,
  useGetAllByOrganizationQuery,
  useGetAllEventsQuery,
  useGetAllOrganizerTicketQuery,
  useGetAllOrganizerCategoriesQuery,
  useGetAllOrganizerTiersQuery,
  useGetAllOrganizerMenuQuery,
  useGetAllOrganizerMenuItemQuery,
  useGetAllCompanyRewardsQuery,
  useGetAllCompanyPresetsQuery,
} = helpersApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const helpersApi = createApi({
//   reducerPath: 'helpersApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['helper'],

//   endpoints: (builder) => ({
//     getEventByMultipleOrganization: builder.query({
//       query: ({ search, page, status, date, limit, organizations }) => {
//         const params: any = {
//           keyword: search,
//           status,
//           page: page + 1,
//           limit,
//         };

//         if (date) (params as any).date = date;
//         if (organizations) (params as any).organizations = organizations;

//         return {
//           url: API_ROUTES.GET_EVENT_BY_MULTIPLE_ORGANIZATION,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['helper'],
//     }),

//     // GET ALL ORGANIZATION -------------------------
//     getAllByOrganization: builder.query({
//       // query: ({ organization }) => ({
//       query: ({}) => ({
//         url: API_ROUTES.ORGANIZER_GENERAL_ORGANIZATIONS,
//         method: 'GET',
//       }),
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//     }),

//     getAllEvents: builder.query({
//       // query: ({ organization }) => ({
//       query: ({}) => ({
//         url: API_ROUTES.ORGANIZER_GENERAL_EVENTS,
//         method: 'GET',
//       }),
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//     }),

//     getAllOrganizerTicket: builder.query({
//       query: ({ search, page, limit, menu }) => ({
//         url: API_ROUTES.ORGANIZER_GENERAL_TICKETS,
//         method: 'GET',
//         params: {
//           keyword: search,
//           page: page + 1,
//           limit,
//           menu,
//         },
//       }),
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//     }),

//     getAllOrganizerCategories: builder.query({
//       query: ({ search, page, limit }) => ({
//         url: API_ROUTES.ORGANIZER_GENERAL_CATEGORIES,
//         method: 'GET',
//         params: {
//           keyword: search,
//           page: page + 1,
//           limit,
//         },
//       }),
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//     }),

//     getAllOrganizerTiers: builder.query({
//       query: ({ search, page, limit }) => ({
//         url: API_ROUTES.ORGANIZER_GENERAL_TIERS,
//         method: 'GET',
//         params: {
//           keyword: search,
//           page: page + 1,
//           limit,
//         },
//       }),
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//     }),

//     getAllOrganizerMenu: builder.query({
//       query: ({ search, page, limit }) => ({
//         url: API_ROUTES.ORGANIZER_GENERAL_MENU,
//         method: 'GET',
//         params: {
//           keyword: search,
//           page: page + 1,
//           limit,
//         },
//       }),
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//     }),

//     getAllOrganizerMenuItem: builder.query({
//       query: ({ search, page, limit, menu }) => ({
//         url: API_ROUTES.ORGANIZER_GENERAL_MENU_ITEM,
//         method: 'GET',
//         params: {
//           keyword: search,
//           page: page + 1,
//           limit,
//           menu,
//         },
//       }),
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//     }),
//   }),
// });

// export const {
//   useGetEventByMultipleOrganizationQuery,
//   useGetAllByOrganizationQuery,
//   useGetAllEventsQuery,
//   useGetAllOrganizerTicketQuery,
//   useGetAllOrganizerCategoriesQuery,
//   useGetAllOrganizerTiersQuery,
//   useGetAllOrganizerMenuQuery,
//   useGetAllOrganizerMenuItemQuery,
// } = helpersApi;
