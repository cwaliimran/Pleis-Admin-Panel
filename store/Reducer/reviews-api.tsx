import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['review'],

  endpoints: (builder) => ({
    getReviews: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;

        return {
          url: API_ROUTES.ADMIN_REVIEWS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['review'],
    }),

    updateReview: builder.mutation({
      query: ({ id, ...updatedReview }) => ({
        url: API_ROUTES.ADMIN_REVIEWS_BY_ID(id),
        method: 'PUT',
        body: updatedReview,
      }),
      invalidatesTags: ['review'],
    }),

    deleteReview: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_REVIEWS_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['review'],
    }),
  }),
});

export const { useGetReviewsQuery, useUpdateReviewMutation, useDeleteReviewMutation } = reviewsApi;
