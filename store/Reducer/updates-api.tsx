import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const updatesApi = createApi({
  reducerPath: 'updatesApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['update'],

  endpoints: (builder) => ({
    getUpdates: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer, organizations }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };

        if (date) params.date = date;
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;
        if (organizations) params.organizations = organizations;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_UPDATES,
            organizerRoute: API_ROUTES.UPDATES,
            adminOnlyParams: ['companyOrganizer'], // Only admins can use this param

          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['update'],
    }),

    addUpdate: builder.mutation({
      query: (newUpdate) => ({
        url: '',
        method: 'POST',
        body: newUpdate,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_UPDATES,
          organizerRoute: API_ROUTES.UPDATES,
        },
      }),
      invalidatesTags: ['update'],
    }),

    updateUpdate: builder.mutation({
      query: ({ id, ...updatedUpdate }) => ({
        url: '',
        method: 'PUT',
        body: updatedUpdate,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_UPDATES_BY_ID(id),
          organizerRoute: API_ROUTES.UPDATES_BY_ID(id),
        },
      }),
      invalidatesTags: ['update'],
    }),

    deleteUpdate: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_UPDATES_BY_ID(id),
          organizerRoute: API_ROUTES.UPDATES_BY_ID(id),
        },
      }),
      invalidatesTags: ['update'],
    }),
  }),
});

export const { useGetUpdatesQuery, useAddUpdateMutation, useUpdateUpdateMutation, useDeleteUpdateMutation } = updatesApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const updatesApi = createApi({
//   reducerPath: 'updatesApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['update'],

//   endpoints: (builder) => ({
//     getUpdates: builder.query({
//       query: ({ search, page, status, date, limit }) => {
//         const params: any = {
//           keyword: search,
//           status,
//           page: page + 1,
//           limit,
//         };
//         if (date) (params as any).date = date;
//         return {
//           url: API_ROUTES.UPDATES,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['update'],
//     }),

//     addUpdate: builder.mutation({
//       query: (newUpdate) => ({
//         url: API_ROUTES.UPDATES,
//         method: 'POST',
//         body: newUpdate,
//       }),
//       invalidatesTags: ['update'],
//     }),

//     updateUpdate: builder.mutation({
//       query: ({ id, ...updatedUpdate }) => ({
//         url: API_ROUTES.UPDATES_BY_ID(id),
//         method: 'PUT',
//         body: updatedUpdate,
//       }),
//       invalidatesTags: ['update'],
//     }),

//     deleteUpdate: builder.mutation({
//       query: (id) => ({
//         url: API_ROUTES.UPDATES_BY_ID(id),
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['update'],
//     }),
//   }),
// });

// export const { useGetUpdatesQuery, useAddUpdateMutation, useUpdateUpdateMutation, useDeleteUpdateMutation } = updatesApi;
