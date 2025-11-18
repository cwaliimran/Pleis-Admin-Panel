import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const promoCodesApi = createApi({
  reducerPath: 'promoCodesApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['promo-code'],

  endpoints: (builder) => ({
    getPromoCodes: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.PROMO_CODES,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['promo-code'],
    }),

    addPromoCode: builder.mutation({
      query: (newPromoCode) => ({
        url: API_ROUTES.PROMO_CODES,
        method: 'POST',
        body: newPromoCode,
      }),
      invalidatesTags: ['promo-code'],
    }),

    updatePromoCode: builder.mutation({
      query: ({ id, ...updatedPromoCode }) => ({
        url: API_ROUTES.PROMO_CODES_BY_ID(id),
        method: 'PUT',
        body: updatedPromoCode,
      }),
      invalidatesTags: ['promo-code'],
    }),

    deletePromoCode: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.PROMO_CODES_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['promo-code'],
    }),
  }),
});

export const { useGetPromoCodesQuery, useAddPromoCodeMutation, useUpdatePromoCodeMutation, useDeletePromoCodeMutation } = promoCodesApi;
