import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const faqsApi = createApi({
  reducerPath: 'faqsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['faq'],

  endpoints: (builder) => ({
    getFaqs: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.ADMIN_FAQS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['faq'],
    }),

    addFaq: builder.mutation({
      query: (newFaq) => ({
        url: API_ROUTES.ADMIN_FAQS,
        method: 'POST',
        body: newFaq,
      }),
      invalidatesTags: ['faq'],
    }),

    updateFaq: builder.mutation({
      query: ({ id, ...updatedFaq }) => ({
        url: API_ROUTES.ADMIN_FAQS_BY_ID(id),
        method: 'PUT',
        body: updatedFaq,
      }),
      invalidatesTags: ['faq'],
    }),

    deleteFaq: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_FAQS_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['faq'],
    }),
  }),
});

export const { useGetFaqsQuery, useAddFaqMutation, useUpdateFaqMutation, useDeleteFaqMutation } = faqsApi;
