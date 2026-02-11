import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const menuItemsApi = createApi({
  reducerPath: 'menuItemsApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['menu-item'],

  endpoints: (builder) => ({
    /* ─────────────────────────────────────────────
     * Role-based endpoints (Admin & Organizer)
     * ───────────────────────────────────────────── */

    getMenuItems: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };

        if (date) params.date = date;
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_MENU_ITEMS,
            organizerRoute: API_ROUTES.ORGANIZER_MENU_ITEMS,
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['menu-item'],
    }),

    addMenuItem: builder.mutation({
      query: (newMenuItem) => ({
        url: '',
        method: 'POST',
        body: newMenuItem,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_ITEMS,
          organizerRoute: API_ROUTES.ORGANIZER_MENU_ITEMS,
        },
      }),
      invalidatesTags: ['menu-item'],
    }),

    updateMenuItem: builder.mutation({
      query: ({ id, ...updatedMenuItem }) => ({
        url: '',
        method: 'PUT',
        body: updatedMenuItem,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_ITEMS_BY_ID(id),
          organizerRoute: `${API_ROUTES.ORGANIZER_MENU_ITEMS}/${id}`,
        },
      }),
      invalidatesTags: ['menu-item'],
    }),

    deleteMenuItem: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_ITEMS_BY_ID(id),
          organizerRoute: `${API_ROUTES.ORGANIZER_MENU_ITEMS}/${id}`,
        },
      }),
      invalidatesTags: ['menu-item'],
    }),

    /* ─────────────────────────────────────────────
     * Existing endpoints (unchanged)
     * ───────────────────────────────────────────── */

    getMenuMinifyData: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) params.date = date;
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;

        return {
          url: API_ROUTES.ADMIN_MENU_ITEMS_MINIFY_DATA,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),

    getMenuItemByMenuId: builder.query({
      query: ({ menuId }) => ({
        url: API_ROUTES.ADMIN_MENU_ITEMS_BY_MENU_ID(menuId),
        method: 'GET',
      }),
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),
  }),
});

export const {
  useGetMenuItemsQuery,
  useGetMenuMinifyDataQuery,
  useGetMenuItemByMenuIdQuery,
  useAddMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} = menuItemsApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const menuItemsApi = createApi({
//   reducerPath: 'menuItemsApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['menu-item'],

//   endpoints: (builder) => ({
//     getMenuItems: builder.query({
//       query: ({ search, page, status, date, limit, companyOrganizer }) => {
//         const params: any = {
//           keyword: search,
//           status,
//           page: page + 1,
//           limit,
//         };
//         if (date) (params as any).date = date;
//         if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
//         return {
//           url: API_ROUTES.ADMIN_MENU_ITEMS,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['menu-item'],
//     }),

//     getMenuMinifyData: builder.query({
//       query: ({ search, page, status, date, limit, companyOrganizer }) => {
//         const params: any = {
//           keyword: search,
//           status,
//           page: page + 1,
//           limit,
//         };
//         if (date) (params as any).date = date;
//         if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
//         return {
//           url: API_ROUTES.ADMIN_MENU_ITEMS_MINIFY_DATA,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       // providesTags: ['menu-item'],
//     }),

//     getMenuItemByMenuId: builder.query({
//       query: ({ menuId }) => {
//         return {
//           url: API_ROUTES.ADMIN_MENU_ITEMS_BY_MENU_ID(menuId),
//           method: 'GET',
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       // providesTags: ['menu-item'],
//     }),

//     addMenuItem: builder.mutation({
//       query: (newMenuItem) => ({
//         url: API_ROUTES.ADMIN_MENU_ITEMS,
//         method: 'POST',
//         body: newMenuItem,
//       }),
//       invalidatesTags: ['menu-item'],
//     }),

//     updateMenuItem: builder.mutation({
//       query: ({ id, ...updatedMenuItem }) => ({
//         url: API_ROUTES.ADMIN_MENU_ITEMS_BY_ID(id),
//         method: 'PUT',
//         body: updatedMenuItem,
//       }),
//       invalidatesTags: ['menu-item'],
//     }),

//     deleteMenuItem: builder.mutation({
//       query: (id) => ({
//         url: API_ROUTES.ADMIN_MENU_ITEMS_BY_ID(id),
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['menu-item'],
//     }),
//   }),
// });

// export const {
//   useGetMenuItemsQuery,
//   useGetMenuMinifyDataQuery,
//   useGetMenuItemByMenuIdQuery,
//   useAddMenuItemMutation,
//   useUpdateMenuItemMutation,
//   useDeleteMenuItemMutation,
// } = menuItemsApi;
