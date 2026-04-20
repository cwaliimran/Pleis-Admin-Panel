import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const tagsApi = createApi({
  reducerPath: 'tagsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['tag'],

  endpoints: (builder) => ({
    getTags: builder.query({
      query: ({ search, page, status, date, limit,tagType }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        if (tagType) (params as any).tagType = tagType;
        return {
          url: API_ROUTES.TAGS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['tag'],
    }),

    addTag: builder.mutation({
      query: (newTag) => ({
        url: API_ROUTES.TAGS,
        method: 'POST',
        body: newTag,
      }),
      invalidatesTags: ['tag'],
    }),

    updateTag: builder.mutation({
      query: ({ id, ...updatedTag }) => ({
        url: API_ROUTES.TAGS_BY_ID(id),
        method: 'PUT',
        body: updatedTag,
      }),
      invalidatesTags: ['tag'],
    }),

    deleteTag: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.TAGS_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['tag'],
    }),
  }),
});

export const { useGetTagsQuery, useAddTagMutation, useUpdateTagMutation, useDeleteTagMutation } = tagsApi;
