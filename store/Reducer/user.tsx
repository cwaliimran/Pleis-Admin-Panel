import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';
import {
    AddUserRequest,
    DeleteUserResponse,
    UpdateUserRequest,
    User,
    UserListResponse,
} from '../types/userTypes';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: customFetchBaseQuery(),
  endpoints: (builder) => ({
    getUsers: builder.query<UserListResponse, void>({
      query: () => API_ROUTES.USERS,
    }),
    addUser: builder.mutation<User, AddUserRequest>({
      query: (newUser) => ({
        url: API_ROUTES.USERS,
        method: 'POST',
        body: newUser,
      }),
    }),
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({ id, ...updatedUser }) => ({
        url: API_ROUTES.USER_BY_ID(id),
        method: 'PUT',
        body: updatedUser,
      }),
    }),
    deleteUser: builder.mutation<DeleteUserResponse, string>({
      query: (id) => ({
        url: API_ROUTES.USER_BY_ID(id),
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
