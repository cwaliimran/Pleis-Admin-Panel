import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

const ADMIN_ACCESS_TOKEN = process.env.NEXT_PUBLIC_ADMIN_ACCESS_TOKEN;

export const userListApi = createApi({
  reducerPath: 'userListApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['userList'],

  endpoints: (builder) => ({
    getUserList: builder.query({
      query: ({ search, page, status, date, limit, userType }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
          userType,
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

    addUserSuperAdminAndGuest: builder.mutation({
      query: (newUser) => ({
        url: API_ROUTES.USER_LIST,
        method: 'POST',
        body: newUser,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
      }),
      invalidatesTags: ['userList'],
    }),

    addUser: builder.mutation({
      query: (newUser) => ({
        url: API_ROUTES.USER_LIST,
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['userList'],
    }),

    updatePendingUser: builder.mutation({
      query: ({ id, status }) => ({
        url: API_ROUTES.PENDING_USER_LIST_BY_ID(id),
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['userList'],
    }),

    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: API_ROUTES.PENDING_USER_LIST_BY_ID(id),
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['userList'],
    }),

    updatePassword: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.CHANGE_PASSWORD,
        method: 'POST',
        body: body,
      }),
    }),
  }),
});

export const {
  useGetUserListQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useAddUserSuperAdminAndGuestMutation,
  useUpdatePendingUserMutation,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
} = userListApi;
