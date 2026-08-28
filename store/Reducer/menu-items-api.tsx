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
      query: ({
        search,
        page,
        status,
        date,
        limit,
        companyOrganizer,
        organization,
        organizations,
        menu,
        category,
        subCategory,
        sortBy,
        sortOrder,
      }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };

        if (date) params.date = date;
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;
        if (organization) params.organization = organization;
        // Organizer header multi-select — mirrors the `organizations` param the menu list takes.
        if (organizations?.length) params.organizations = organizations;
        if (menu) params.menu = menu;
        if (category) params.category = category;
        if (subCategory) params.subCategory = subCategory;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_MENU_ITEMS,
            organizerRoute: API_ROUTES.ORGANIZER_MENU_ITEMS,
            organizerOnlyParams: ['organization', 'organizations'],
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

    importPresetMenuItems: builder.mutation({
      query: (payload) => ({
        url: '',
        method: 'POST',
        body: payload,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_IMPORT_PRESET_MENU_ITEMS,
          organizerRoute: API_ROUTES.ORGANIZER_IMPORT_PRESET_MENU_ITEMS,
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

    // Read-only preview of what deleting one menu item would cascade into. Deliberately NOT tagged
    // with 'menu-item': it is fetched on demand right before a delete, and a cached result would go
    // stale the moment anything else started referencing the item.
    getMenuItemDeleteImpact: builder.query({
      query: (id) => ({
        url: '',
        method: 'GET',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_ITEM_DELETE_IMPACT(id),
          organizerRoute: API_ROUTES.ORGANIZER_MENU_ITEM_DELETE_IMPACT(id),
        },
      }),
      transformResponse: (res: any) => res.data,
      keepUnusedDataFor: 0,
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
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_MENU_ITEMS_MINIFY_DATA,
            organizerRoute: API_ROUTES.ORGANIZER_MENU_ITEMS_MINIFY_DATA,
            // organizerOnlyParams: ['organization'],
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),

    /* ─────────────────────────────────────────────
     * Existing endpoints (unchanged)
     * ───────────────────────────────────────────── */
    getMenuItemByMenuId: builder.query({
      query: ({ menuId }) => ({
        url: '',
        method: 'GET',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_ITEMS_BY_MENU_ID(menuId),
          organizerRoute: API_ROUTES.ORGANIZER_MENU_ITEMS_BY_MENU_ID(menuId),
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
  useGetMenuItemsQuery,
  useGetMenuItemDeleteImpactQuery,
  useLazyGetMenuItemDeleteImpactQuery,
  useGetMenuMinifyDataQuery,
  useGetMenuItemByMenuIdQuery,
  useAddMenuItemMutation,
  useImportPresetMenuItemsMutation,
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
