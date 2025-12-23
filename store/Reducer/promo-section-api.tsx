import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const promoSectionApi = createApi({
  reducerPath: 'promoSectionApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['promo-section', 'quick-access', 'top-picks'],

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
          url: API_ROUTES.POPULAR_EVENTS,
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
        url: API_ROUTES.POPULAR_EVENTS,
        method: 'POST',
        body: newPromoSection,
      }),
      invalidatesTags: ['promo-section'],
    }),

    reorderPromoSection: builder.mutation({
      query: (newPromoSection) => ({
        url: API_ROUTES.POPULAR_EVENTS_REORDER,
        method: 'POST',
        body: newPromoSection,
      }),
      // invalidatesTags: ['promo-section'],
    }),

    updatePromoSection: builder.mutation({
      query: ({ id, ...updatedPromoSection }) => ({
        url: API_ROUTES.POPULAR_EVENTS_BY_ID(id),
        method: 'PUT',
        body: updatedPromoSection,
      }),
      invalidatesTags: ['promo-section'],
    }),

    deletePromoSection: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.POPULAR_EVENTS_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['promo-section'],
    }),

    // TOP PICKS ----------------------

    getTopPicksSection: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.TOP_PICKS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['top-picks'],
    }),

    addTopPicksSection: builder.mutation({
      query: (newTopPicksSection) => ({
        url: API_ROUTES.TOP_PICKS,
        method: 'POST',
        body: newTopPicksSection,
      }),
      invalidatesTags: ['top-picks'],
    }),

    reorderTopPicksSection: builder.mutation({
      query: (newTopPicksSection) => ({
        url: API_ROUTES.TOP_PICKS_REORDER,
        method: 'POST',
        body: newTopPicksSection,
      }),
      // invalidatesTags: ['promo-section'],
    }),

    updateTopPicksSection: builder.mutation({
      query: ({ id, ...updatedTopPicksSection }) => ({
        url: API_ROUTES.TOP_PICKS_BY_ID(id),
        method: 'PUT',
        body: updatedTopPicksSection,
      }),
      invalidatesTags: ['top-picks'],
    }),

    deleteTopPicksSection: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.TOP_PICKS_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['top-picks'],
    }),

    // QUICK ACCESS ----------------------
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
      providesTags: ['quick-access'],
    }),

    reorderQuickAccess: builder.mutation({
      query: (newQuickAccess) => ({
        url: API_ROUTES.QUICK_ACCESS_REORDER,
        method: 'POST',
        body: newQuickAccess,
      }),
      invalidatesTags: ['quick-access'],
    }),
  }),
});

export const {
  useGetPromoSectionQuery,
  useAddPromoSectionMutation,
  useReorderPromoSectionMutation,
  useUpdatePromoSectionMutation,
  useDeletePromoSectionMutation,

  useGetTopPicksSectionQuery,
  useAddTopPicksSectionMutation,
  useReorderTopPicksSectionMutation,
  useUpdateTopPicksSectionMutation,
  useDeleteTopPicksSectionMutation,

  useGetQuickAccessQuery,
  useReorderQuickAccessMutation,
} = promoSectionApi;
