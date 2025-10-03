import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const itemsCategoryApi = createApi({
  reducerPath: 'itemsCategoryApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['items-category'],

  endpoints: (builder) => ({
    getItemsCategory: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.MENU_CATEGORIES,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['items-category'],
    }),

    addItemsCategory: builder.mutation({
      query: (newItemsCategory) => ({
        url: API_ROUTES.MENU_CATEGORIES,
        method: 'POST',
        body: newItemsCategory,
      }),
      invalidatesTags: ['items-category'],
    }),

    updateItemsCategory: builder.mutation({
      query: ({ id, ...updatedItemsCategory }) => ({
        url: API_ROUTES.MENU_CATEGORIES_BY_ID(id),
        method: 'PUT',
        body: updatedItemsCategory,
      }),
      invalidatesTags: ['items-category'],
    }),

    deleteItemsCategory: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.MENU_CATEGORIES_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['items-category'],
    }),
  }),
});

export const {
  useGetItemsCategoryQuery,
  useAddItemsCategoryMutation,
  useUpdateItemsCategoryMutation,
  useDeleteItemsCategoryMutation,
} = itemsCategoryApi;
