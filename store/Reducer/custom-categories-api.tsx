import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const customCategoriesApi = createApi({
  reducerPath: 'customCategoriesApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['custom-category'],

  endpoints: (builder) => ({
    getCustomCategories: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.CUSTOM_CATEGORIES,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['custom-category'],
    }),

    addCustomCategory: builder.mutation({
      query: (newCustomCategory) => ({
        url: API_ROUTES.CUSTOM_CATEGORIES,
        method: 'POST',
        body: newCustomCategory,
      }),
      invalidatesTags: ['custom-category'],
    }),

    updateCustomCategory: builder.mutation({
      query: ({ id, ...updatedCustomCategory }) => ({
        url: API_ROUTES.CUSTOM_CATEGORIES_BY_ID(id),
        method: 'PUT',
        body: updatedCustomCategory,
      }),
      invalidatesTags: ['custom-category'],
    }),

    deleteCustomCategory: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.CUSTOM_CATEGORIES_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['custom-category'],
    }),
    reorderCustomCategory: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.CUSTOM_CATEGORIES_REORDER,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['custom-category'],
    }),
  }),

});

export const {
  useGetCustomCategoriesQuery,
  useAddCustomCategoryMutation,
  useUpdateCustomCategoryMutation,
  useDeleteCustomCategoryMutation,
  useReorderCustomCategoryMutation,
} = customCategoriesApi;
