import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const bannerControlApi = createApi({
  reducerPath: 'bannerControlApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['banner-control'],

  endpoints: (builder) => ({
    getBannerControl: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.BANNER_CONTROL,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['banner-control'],
    }),

    addBannerControl: builder.mutation({
      query: (newBannerControl) => ({
        url: API_ROUTES.BANNER_CONTROL,
        method: 'POST',
        body: newBannerControl,
      }),
      invalidatesTags: ['banner-control'],
    }),

    updateBannerControl: builder.mutation({
      query: ({ id, ...updatedBannerControl }) => ({
        url: API_ROUTES.BANNER_CONTROL_BY_ID(id),
        method: 'PUT',
        body: updatedBannerControl,
      }),
      invalidatesTags: ['banner-control'],
    }),

    deleteBannerControl: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.BANNER_CONTROL_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['banner-control'],
    }),
  }),
});

export const {
  useGetBannerControlQuery,
  useAddBannerControlMutation,
  useUpdateBannerControlMutation,
  useDeleteBannerControlMutation,
} = bannerControlApi;
