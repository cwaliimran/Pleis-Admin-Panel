import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const presetMenuApi = createApi({
  reducerPath: 'presetMenuApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['preset-menu'],

  endpoints: (builder) => ({
    getPresetMenu: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.ADMIN_PRESET,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['preset-menu'],
    }),

    addPresetMenu: builder.mutation({
      query: (newPresetMenu) => ({
        url: API_ROUTES.ADMIN_PRESET,
        method: 'POST',
        body: newPresetMenu,
      }),
      invalidatesTags: ['preset-menu'],
    }),

    updatePresetMenu: builder.mutation({
      query: ({ id, ...updatedPresetMenu }) => ({
        url: API_ROUTES.ADMIN_PRESET_BY_ID(id),
        method: 'PUT',
        body: updatedPresetMenu,
      }),
      invalidatesTags: ['preset-menu'],
    }),

    deletePresetMenu: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_PRESET_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['preset-menu'],
    }),
  }),
});

export const { useGetPresetMenuQuery, useAddPresetMenuMutation, useUpdatePresetMenuMutation, useDeletePresetMenuMutation } = presetMenuApi;
