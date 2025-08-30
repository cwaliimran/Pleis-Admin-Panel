import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const userListApi = createApi({
  reducerPath: 'userListApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['userList'],

  endpoints: (builder) => ({
    getUserList: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.USER_LIST,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['userList'],
    }),

    getUserById: builder.query({
      query: ({ id }) => ({
        url: API_ROUTES.USER_LIST_BY_ID(id),
        method: 'GET',
      }),
      transformResponse: (res) => res.data,
    }),

    addUser: builder.mutation({
      query: (newUser) => ({
        url: API_ROUTES.USER_LIST,
        method: 'POST',
        body: newUser,
      }),
    }),

    updateUser: builder.mutation({
      query: ({ id, ...updatedUser }) => ({
        url: API_ROUTES.USER_LIST_BY_ID(id),
        method: 'PUT',
        body: updatedUser,
      }),
    }),
  }),
});

export const {
  useGetUserListQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
} = userListApi;
