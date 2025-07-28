
import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from "../customFetchBaseQuery";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: customFetchBaseQuery(),
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => '/users',
        }),
        addUser: builder.mutation({
            query: (newUser) => ({
                url: '/users',
                method: 'POST',
                body: newUser,
            }),
        }),
        updateUser: builder.mutation({
            query: ({ id, ...updatedUser }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: updatedUser,
            }),
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetUsersQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApi;