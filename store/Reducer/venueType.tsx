import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from "../customFetchBaseQuery";

export const venueTypeApi = createApi({
    reducerPath: 'venueTypeApi',
    baseQuery: customFetchBaseQuery(),
    endpoints: (builder) => ({
        getVenueTypes: builder.query({
            query: () => '/venue-types',
        }),
        addVenueType: builder.mutation({
            query: (newVenueType) => ({
                url: '/venue-types',
                method: 'POST',
                body: newVenueType,
            }),
        }),
        updateVenueType: builder.mutation({
            query: ({ id, ...updatedVenueType }) => ({
                url: `/venue-types/${id}`,
                method: 'PUT',
                body: updatedVenueType,
            }),
        }),
        deleteVenueType: builder.mutation({
            query: (id) => ({
                url: `/venue-types/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});


export const {
    useGetVenueTypesQuery,
    useAddVenueTypeMutation,
    useUpdateVenueTypeMutation,
    useDeleteVenueTypeMutation,
} = venueTypeApi;