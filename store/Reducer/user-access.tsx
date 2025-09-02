import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const userAccessApi = createApi({
  reducerPath: 'userAccessApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['userAccess'],

  endpoints: (builder) => ({
    getUserAccess: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.USER_ACCESS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['userAccess'],
    }),

    addUserAccess: builder.mutation({
      query: (newUserAccess) => ({
        url: API_ROUTES.USER_ACCESS,
        method: 'POST',
        body: newUserAccess,
      }),
    }),

    updateUserAccess: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: API_ROUTES.USER_ACCESS_BY_ID(id),
        method: 'PUT',
        body: updatedData,
      }),
    }),

    deleteUserAccess: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.USER_ACCESS_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['userAccess'],
    }),
  }),
});

export const {
  useGetUserAccessQuery,
  useAddUserAccessMutation,
  useUpdateUserAccessMutation,
  useDeleteUserAccessMutation,
} = userAccessApi;
