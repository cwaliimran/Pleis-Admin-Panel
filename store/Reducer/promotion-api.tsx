import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const promotionApi = createApi({
  reducerPath: 'promotionApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['promotion'],

  endpoints: (builder) => ({
    getPromotion: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
        return {
          url: API_ROUTES.ADMIN_LOYALTY_PROMOTION,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['promotion'],
    }),

    addPromotion: builder.mutation({
      query: (newPromotion) => ({
        url: API_ROUTES.ADMIN_LOYALTY_PROMOTION,
        method: 'POST',
        body: newPromotion,
      }),
      invalidatesTags: ['promotion'],
    }),

    updatePromotion: builder.mutation({
      query: ({ id, ...updatedPromotion }) => ({
        url: API_ROUTES.ADMIN_LOYALTY_PROMOTION_BY_ID(id),
        method: 'PUT',
        body: updatedPromotion,
      }),
      invalidatesTags: ['promotion'],
    }),

    deletePromotion: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_LOYALTY_PROMOTION_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['promotion'],
    }),
  }),
});

export const { useGetPromotionQuery, useAddPromotionMutation, useUpdatePromotionMutation, useDeletePromotionMutation } = promotionApi;
