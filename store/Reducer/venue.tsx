import { createApi } from "@reduxjs/toolkit/query/react";

import { customFetchBaseQuery } from "../customFetchBaseQuery";


export const venueApi = createApi({
    reducerPath: 'venueApi',
    baseQuery: customFetchBaseQuery(),
    endpoints: (builder) => ({
        getVenues: builder.query({
            query: () => '/venues',
        }),
        addVenue: builder.mutation({
            query: (newVenue) => ({
                url: '/venues',
                method: 'POST',
                body: newVenue,
            }),
        }),
        updateVenue: builder.mutation({
            query: ({ id, ...updatedVenue }) => ({
                url: `/venues/${id}`,
                method: 'PUT',
                body: updatedVenue,
            }),
        }),
        deleteVenue: builder.mutation({
            query: (id) => ({
                url: `/venues/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetVenuesQuery,
    useAddVenueMutation,
    useUpdateVenueMutation,
    useDeleteVenueMutation,
} = venueApi;