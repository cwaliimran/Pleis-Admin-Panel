import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const menuListApi = createApi({
  reducerPath: 'menuListApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['menu-list'],

  endpoints: (builder) => ({
    getMenuList: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.MENU,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['menu-list'],
    }),

    addMenuList: builder.mutation({
      query: (newMenuList) => ({
        url: API_ROUTES.MENU,
        method: 'POST',
        body: newMenuList,
      }),
      invalidatesTags: ['menu-list'],
    }),

    updateMenuList: builder.mutation({
      query: ({ id, ...updatedMenuList }) => ({
        url: API_ROUTES.MENU_BY_ID(id),
        method: 'PUT',
        body: updatedMenuList,
      }),
      invalidatesTags: ['menu-list'],
    }),

    deleteMenuList: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.MENU_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['menu-list'],
    }),
  }),
});

export const {
  useGetMenuListQuery,
  useAddMenuListMutation,
  useUpdateMenuListMutation,
  useDeleteMenuListMutation,
} = menuListApi;
