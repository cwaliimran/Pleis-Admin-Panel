import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const promotionApi = createApi({
  reducerPath: 'promotionApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['promotion', 'globalPromotion'],

  endpoints: (builder) => ({
    getPromotion: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer, isGlobal = false }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        // if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
        if (!isGlobal && companyOrganizer) params.companyOrganizer = companyOrganizer;
        return {
          // url: API_ROUTES.ADMIN_LOYALTY_PROMOTION,
          url: API_ROUTES.ADMIN_LOYALTY_PROMOTION(isGlobal),
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      // providesTags: ['promotion'],
      providesTags: (result, error, arg) => (arg.isGlobal ? ['globalPromotion'] : ['promotion']),
    }),

    addPromotion: builder.mutation({
      query: ({ isGlobal = false, ...newPromotion }) => ({
        url: API_ROUTES.ADMIN_LOYALTY_PROMOTION(isGlobal),
        method: 'POST',
        body: newPromotion,
      }),
      // invalidatesTags: ['promotion'],
      invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalPromotion'] : ['promotion']),
    }),

    updatePromotion: builder.mutation({
      query: ({ id, isGlobal = false, scope, ...updatedPromotion }) => ({
        url: API_ROUTES.ADMIN_LOYALTY_PROMOTION_BY_ID(id, isGlobal, scope),
        method: 'PUT',
        body: updatedPromotion,
      }),
      // invalidatesTags: ['promotion'],
      invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalPromotion'] : ['promotion']),
    }),

    deletePromotion: builder.mutation({
      query: ({ id, isGlobal = false, scope }) => ({
        url: API_ROUTES.ADMIN_LOYALTY_PROMOTION_BY_ID(id, isGlobal, scope),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalPromotion'] : ['promotion']),
    }),
  }),
});

export const { useGetPromotionQuery, useAddPromotionMutation, useUpdatePromotionMutation, useDeletePromotionMutation } = promotionApi;
