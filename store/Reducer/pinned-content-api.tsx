import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const pinnedContentApi = createApi({
  reducerPath: 'pinnedContentApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['pinned-content'],

  endpoints: (builder) => ({
    getPinnedContent: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.PINNED_CONTENT,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['pinned-content'],
    }),

    addPinnedContent: builder.mutation({
      query: (newPinnedContent) => ({
        url: API_ROUTES.PINNED_CONTENT,
        method: 'POST',
        body: newPinnedContent,
      }),
      invalidatesTags: ['pinned-content'],
    }),

    updatePinnedContent: builder.mutation({
      query: ({ id, ...updatedPinnedContent }) => ({
        url: API_ROUTES.PINNED_CONTENT_BY_ID(id),
        method: 'PUT',
        body: updatedPinnedContent,
      }),
      invalidatesTags: ['pinned-content'],
    }),

    deletePinnedContent: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.PINNED_CONTENT_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['pinned-content'],
    }),
    getEventBaseVenuType: builder.query({
      query: ({ id }) => {

        return {
          url: API_ROUTES.EVENTS_BASE_VENU_TYPE(id),
          method: 'GET',
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),
    getOrganizationsBaseVenueType: builder.query({
      query: ({ id }) => {

        return {
          url: API_ROUTES.ORGANIZATIONS_BASE_VENU_TYPE(id),
          method: 'GET',
        };
      },
      transformResponse: (res) => ({

        data: res.data,
        meta: res.meta,
      }),
    }),
    reorderPinnedContent: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.PINNED_CONTENT_REORDER,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['pinned-content'],
  }),
}),
});

export const {
  useGetPinnedContentQuery,
  useAddPinnedContentMutation,
  useUpdatePinnedContentMutation,
  useDeletePinnedContentMutation,
  useGetEventBaseVenuTypeQuery,
  useGetOrganizationsBaseVenueTypeQuery,
  useReorderPinnedContentMutation
} = pinnedContentApi;
