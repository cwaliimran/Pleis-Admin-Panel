import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const dietTagsApi = createApi({
  reducerPath: 'dietTagsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['dietTags'],

  endpoints: (builder) => ({
    getDietTags: builder.query({
      query: ({ search, page, status, date, limit, summary, sortBy, sortOrder }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) params.date = date;
        if (summary) params.summary = summary;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;
        return {
          url: API_ROUTES.ADMIN_PRESET_MENU_DIET_TAG,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['dietTags'],
    }),

    getDietTagCode: builder.query({
      query: () => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_DIET_TAG_CODE,
        method: 'GET',
      }),
      transformResponse: (res: any) => res.data,
      providesTags: ['dietTags'],
    }),

    addDietTag: builder.mutation({
      query: (newDietTag) => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_DIET_TAG,
        method: 'POST',
        body: newDietTag,
      }),
      invalidatesTags: ['dietTags'],
    }),

    updateDietTag: builder.mutation({
      query: ({ id, ...updatedDietTag }) => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_DIET_TAG_BY_ID(id),
        method: 'PUT',
        body: updatedDietTag,
      }),
      invalidatesTags: ['dietTags'],
    }),

    deleteDietTag: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_DIET_TAG_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['dietTags'],
    }),
  }),
});

export const { useGetDietTagsQuery, useGetDietTagCodeQuery, useAddDietTagMutation, useUpdateDietTagMutation, useDeleteDietTagMutation } =
  dietTagsApi;
