import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const menuItemsApi = createApi({
  reducerPath: 'menuItemsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['menu-item'],

  endpoints: (builder) => ({
    getMenuItems: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
        return {
          url: API_ROUTES.ADMIN_MENU_ITEMS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['menu-item'],
    }),

    getMenuMinifyData: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
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
      // providesTags: ['menu-item'],
    }),

    getMenuItemByMenuId: builder.query({
      query: ({ menuId }) => {
        return {
          url: API_ROUTES.ADMIN_MENU_ITEMS_BY_MENU_ID(menuId),
          method: 'GET',
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      // providesTags: ['menu-item'],
    }),

    addMenuItem: builder.mutation({
      query: (newMenuItem) => ({
        url: API_ROUTES.ADMIN_MENU_ITEMS,
        method: 'POST',
        body: newMenuItem,
      }),
      invalidatesTags: ['menu-item'],
    }),

    updateMenuItem: builder.mutation({
      query: ({ id, ...updatedMenuItem }) => ({
        url: API_ROUTES.ADMIN_MENU_ITEMS_BY_ID(id),
        method: 'PUT',
        body: updatedMenuItem,
      }),
      invalidatesTags: ['menu-item'],
    }),

    deleteMenuItem: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_MENU_ITEMS_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['menu-item'],
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
