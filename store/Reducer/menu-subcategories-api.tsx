import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const menuSubcategoriesApi = createApi({
  reducerPath: 'menuSubcategoriesApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['menuSubcategories'],

  endpoints: (builder) => ({
    getMenuSubcategories: builder.query({
      query: ({ search, page, status, date, limit, category, sortBy, sortOrder }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) params.date = date;
        if (category) params.category = category;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;
        return {
          url: API_ROUTES.ADMIN_MENU_SUB_CATEGORIES,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['menuSubcategories'],
    }),

    addMenuSubcategory: builder.mutation({
      query: (newSubcategory) => ({
        url: API_ROUTES.ADMIN_MENU_SUB_CATEGORIES,
        method: 'POST',
        body: newSubcategory,
      }),
      invalidatesTags: ['menuSubcategories'],
    }),

    updateMenuSubcategory: builder.mutation({
      query: ({ id, ...updatedSubcategory }) => ({
        url: API_ROUTES.ADMIN_MENU_SUB_CATEGORIES_BY_ID(id),
        method: 'PUT',
        body: updatedSubcategory,
      }),
      invalidatesTags: ['menuSubcategories'],
    }),

    updateMenuSubcategoryOrder: builder.mutation({
      query: ({ id, newOrder }) => ({
        url: API_ROUTES.ADMIN_MENU_SUB_CATEGORIES_ORDER_BY_ID(id),
        method: 'PUT',
        body: { newOrder },
      }),
      invalidatesTags: ['menuSubcategories'],
    }),

    deleteMenuSubcategory: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_MENU_SUB_CATEGORIES_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['menuSubcategories'],
    }),
  }),
});

export const {
  useGetMenuSubcategoriesQuery,
  useAddMenuSubcategoryMutation,
  useUpdateMenuSubcategoryMutation,
  useUpdateMenuSubcategoryOrderMutation,
  useDeleteMenuSubcategoryMutation,
} = menuSubcategoriesApi;
