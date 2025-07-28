import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from '../customFetchBaseQuery';


export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: customFetchBaseQuery(),
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => '/categories',
        }),
        addCategory: builder.mutation({
            query: (newCategory) => ({
                url: '/categories',
                method: 'POST',
                body: newCategory,
            }),
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...updatedCategory }) => ({
                url: `/categories/${id}`,
                method: 'PUT',
                body: updatedCategory,
            }),
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;