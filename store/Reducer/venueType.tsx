import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const venueTypeApi = createApi({
  reducerPath: 'venueTypeApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['venueType'],

  endpoints: (builder) => ({
    getVenueTypes: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.VENUES_TYPES,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['venueType'],
    }),

    addVenueType: builder.mutation({
      query: (newVenueType) => ({
        url: API_ROUTES.VENUES_TYPES,
        method: 'POST',
        body: newVenueType,
      }),
      invalidatesTags: ['venueType'],
    }),

    updateVenueType: builder.mutation({
      query: ({ id, ...updatedVenueType }) => ({
        url: API_ROUTES.VENUES_TYPE_By_ID(id),
        method: 'PUT',
        body: updatedVenueType,
      }),
    }),

    deleteVenueType: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.VENUES_TYPE_By_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['venueType'],
    }),
  }),
});

export const {
  useGetVenueTypesQuery,
  useAddVenueTypeMutation,
  useUpdateVenueTypeMutation,
  useDeleteVenueTypeMutation,
} = venueTypeApi;
