import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const venueApi = createApi({
  reducerPath: 'venueApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['venue'],

  endpoints: (builder) => ({
    getVenues: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.VENUES,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['venue'],
    }),

    addVenue: builder.mutation({
      query: (newVenue) => ({
        url: API_ROUTES.VENUES,
        method: 'POST',
        body: newVenue,
      }),
    }),

    updateVenue: builder.mutation({
      query: ({ id, ...updatedVenue }) => ({
        url: API_ROUTES.VENUES_BY_ID(id),
        method: 'PUT',
        body: updatedVenue,
      }),
    }),

    deleteVenue: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.VENUES_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['venue'],
    }),
  }),
});

export const {
  useGetVenuesQuery,
  useAddVenueMutation,
  useUpdateVenueMutation,
  useDeleteVenueMutation,
} = venueApi;
