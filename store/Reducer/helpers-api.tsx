import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const helpersApi = createApi({
  reducerPath: 'helpersApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['helper'],

  endpoints: (builder) => ({
    getEventByMultipleOrganization: builder.query({
      query: ({ search, page, status, date, limit, organizations }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };

        if (date) (params as any).date = date;
        if (organizations) (params as any).organizations = organizations;

        return {
          url: API_ROUTES.GET_EVENT_BY_MULTIPLE_ORGANIZATION,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['helper'],
    }),

    getAllByOrganization: builder.query({
      // query: ({ organization }) => ({
      query: ({}) => ({
        url: API_ROUTES.ORGANIZER_GENERAL_ORGANIZATIONS,
        method: 'GET',
      }),
      // transformResponse: (res) => res.data,
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      // providesTags: ['event'],
    }),
  }),
});

export const { useGetEventByMultipleOrganizationQuery, useGetAllByOrganizationQuery } = helpersApi;
