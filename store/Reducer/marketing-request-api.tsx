import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const marketingRequestApi = createApi({
  reducerPath: 'marketingRequestApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['marketing-request'],

  endpoints: (builder) => ({
    getMarketingRequest: builder.query({
      query: ({ search, page, status, date, limit, userType }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.MARKETING_REQUEST(userType),
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['marketing-request'],
    }),

    addMarketingRequest: builder.mutation({
      query: (newMarketingRequest) => ({
        url: API_ROUTES.CREATE_MARKETING_REQUEST,
        method: 'POST',
        body: newMarketingRequest,
      }),
      invalidatesTags: ['marketing-request'],
    }),

    updateMarketingRequest: builder.mutation({
      query: ({ id, status }) => ({
        url: API_ROUTES.MARKETING_REQUEST_BY_ID_UPDATE(id, status),
        method: 'PUT',
        // body: { status },
      }),
      invalidatesTags: ['marketing-request'],
    }),

    deleteMarketingRequest: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.MARKETING_REQUEST_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['marketing-request'],
    }),
  }),
});

export const { useGetMarketingRequestQuery, useAddMarketingRequestMutation, useUpdateMarketingRequestMutation, useDeleteMarketingRequestMutation } =
  marketingRequestApi;
