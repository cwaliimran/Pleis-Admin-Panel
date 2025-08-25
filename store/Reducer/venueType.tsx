import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const venueTypeApi = createApi({
  reducerPath: 'venueTypeApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['venueType'],

  endpoints: (builder) => ({
    getVenueTypes: builder.query({
      query: ({ search, pageno, type, status }) => ({
        url: API_ROUTES.VENUES_TYPES,
        method: 'GET',
        params: {
          keyword: search,
          type,
          status,
          page: pageno + 1,
        },
      }),
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
    }),

    updateVenueType: builder.mutation({
      query: ({ id, ...updatedVenueType }) => ({
        url: API_ROUTES.VENUES_TYPE_By_ID(id),
        method: 'PUT',
        body: updatedVenueType,
      }),
      invalidatesTags: ['venueType'],
    }),

    deleteVenueType: builder.mutation({
      query: (id) => (
        console.log('id', id),
        {
          url: API_ROUTES.VENUES_TYPE_By_ID(id),
          method: 'DELETE',
        }
      ),
    }),
  }),
});

export const {
  useGetVenueTypesQuery,
  useAddVenueTypeMutation,
  useUpdateVenueTypeMutation,
  useDeleteVenueTypeMutation,
} = venueTypeApi;
