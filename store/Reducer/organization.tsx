import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const organizationApi = createApi({
  reducerPath: 'organizationApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['organization'],

  endpoints: (builder) => ({
    getOrganization: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
        return {
          url: API_ROUTES.ADMIN_ORGANIZATION,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['organization'],
    }),

    addOrganization: builder.mutation({
      query: (newOrganization) => ({
        url: API_ROUTES.ADMIN_ORGANIZATION,
        method: 'POST',
        body: newOrganization,
      }),
      invalidatesTags: ['organization'],
    }),

    getOrganizationById: builder.query({
      query: ({ id }) => ({
        url: API_ROUTES.ADMIN_ORGANIZATION_BY_ID(id),
        method: 'GET',
      }),
      transformResponse: (res) => ({
        data: res.data,
      }),
      providesTags: ['organization'],
    }),

    updateOrganization: builder.mutation({
      query: ({ id, ...updatedOrganization }) => ({
        url: API_ROUTES.ADMIN_ORGANIZATION_BY_ID(id),
        method: 'PUT',
        body: updatedOrganization,
      }),
      invalidatesTags: ['organization'],
    }),

    deleteOrganization: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_ORGANIZATION_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['organization'],
    }),
  }),
});

export const {
  useGetOrganizationQuery,
  useAddOrganizationMutation,
  useGetOrganizationByIdQuery,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} = organizationApi;
