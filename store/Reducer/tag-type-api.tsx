import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const tagTypeApi = createApi({
  reducerPath: 'tagTypeApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['tag-type'],

  endpoints: (builder) => ({
    getTagType: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.ADMIN_TAG_TYPE,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['tag-type'],
    }),

    addTagType: builder.mutation({
      query: (newTagType) => ({
        url: API_ROUTES.ADMIN_TAG_TYPE,
        method: 'POST',
        body: newTagType,
      }),
      invalidatesTags: ['tag-type'],
    }),

    updateTagType: builder.mutation({
      query: ({ id, ...updatedTagType }) => ({
        url: API_ROUTES.ADMIN_TAG_TYPE_BY_ID(id),
        method: 'PUT',
        body: updatedTagType,
      }),
      invalidatesTags: ['tag-type'],
    }),

    deleteTagType: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_TAG_TYPE_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['tag-type'],
    }),
  }),
});

export const { useGetTagTypeQuery, useAddTagTypeMutation, useUpdateTagTypeMutation, useDeleteTagTypeMutation } = tagTypeApi;
