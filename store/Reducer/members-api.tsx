import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const membersApi = createApi({
  reducerPath: 'membersApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['member'],

  endpoints: (builder) => ({
    getMembers: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;
        return {
          url: API_ROUTES.ADMIN_LOYALTY_MEMBERS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['member'],
    }),

    addMember: builder.mutation({
      query: (newMember) => ({
        url: API_ROUTES.ADMIN_LOYALTY_MEMBERS_GIFT,
        method: 'POST',
        body: newMember,
      }),
      invalidatesTags: ['member'],
    }),
  }),
});

export const { useGetMembersQuery, useAddMemberMutation } = membersApi;
