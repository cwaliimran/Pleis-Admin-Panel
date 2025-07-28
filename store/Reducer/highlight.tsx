import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from "../customFetchBaseQuery";


export const highlightApi = createApi({
    reducerPath: 'highlightApi',
    baseQuery: customFetchBaseQuery(),
    endpoints: (builder) => ({
        getHighlights: builder.query({
            query: () => '/highlights',
        }),
        addHighlight: builder.mutation({
            query: (newHighlight) => ({
                url: '/highlights',
                method: 'POST',
                body: newHighlight,
            }),
        }),
        updateHighlight: builder.mutation({
            query: ({ id, ...updatedHighlight }) => ({
                url: `/highlights/${id}`,
                method: 'PUT',
                body: updatedHighlight,
            }),
        }),
        deleteHighlight: builder.mutation({
            query: (id) => ({
                url: `/highlights/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetHighlightsQuery,
    useAddHighlightMutation,
    useUpdateHighlightMutation,
    useDeleteHighlightMutation,
} = highlightApi;