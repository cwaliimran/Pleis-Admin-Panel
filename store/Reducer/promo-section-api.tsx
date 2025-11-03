import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const promoSectionApi = createApi({
  reducerPath: 'promoSectionApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['promo-section'],

  endpoints: (builder) => ({
    getPromoSection: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.PROMO_SECTION,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['promo-section'],
    }),

    addPromoSection: builder.mutation({
      query: (newPromoSection) => ({
        url: API_ROUTES.PROMO_SECTION,
        method: 'POST',
        body: newPromoSection,
      }),
      invalidatesTags: ['promo-section'],
    }),

    reorderPromoSection: builder.mutation({
      query: (newPromoSection) => ({
        url: API_ROUTES.PROMO_SECTION_REORDER,
        method: 'POST',
        body: newPromoSection,
      }),
      // invalidatesTags: ['promo-section'],
    }),

    updatePromoSection: builder.mutation({
      query: ({ id, ...updatedPromoSection }) => ({
        url: API_ROUTES.PROMO_SECTION_BY_ID(id),
        method: 'PUT',
        body: updatedPromoSection,
      }),
      invalidatesTags: ['promo-section'],
    }),

    deletePromoSection: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.PROMO_SECTION_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['promo-section'],
    }),

    // Get quick access
    getQuickAccess: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.QUICK_ACCESS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['promo-section'],
    }),

    reorderQuickAccess: builder.mutation({
      query: (newQuickAccess) => ({
        url: API_ROUTES.QUICK_ACCESS_REORDER,
        method: 'POST',
        body: newQuickAccess,
      }),
    }),
  }),
});

export const {
  useGetPromoSectionQuery,
  useAddPromoSectionMutation,
  useReorderPromoSectionMutation,
  useUpdatePromoSectionMutation,
  useDeletePromoSectionMutation,

  useGetQuickAccessQuery,
  useReorderQuickAccessMutation,
} = promoSectionApi;
