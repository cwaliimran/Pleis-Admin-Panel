import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const menuManagementApi = createApi({
  reducerPath: 'menuManagementApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['menu-management'],

  endpoints: (builder) => ({
    getMenuManagement: builder.query({
      query: ({ search, page, status, date, limit, organizer }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        if (organizer) (params as any).organizer = organizer;
        return {
          url: API_ROUTES.ADMIN_MENU_MANAGEMENT_GET,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['menu-management'],
    }),

    addMenuManagementSale: builder.mutation({
      query: (newMenuManagement) => ({
        url: API_ROUTES.ADMIN_MENU_MANAGEMENT_CREATE_SALE,
        method: 'POST',
        body: newMenuManagement,
      }),
      invalidatesTags: ['menu-management'],
    }),

    // updateLimitedTimeMenu: builder.mutation({
    //   query: ({ id, ...updatedMenuManagement }) => ({
    //     url: API_ROUTES.ADMIN_MENU_MANAGEMENT_UPDATE(id),
    //     method: 'PUT',
    //     body: updatedMenuManagement,
    //   }),
    //   invalidatesTags: ['menu-management'],
    // }),

    // deleteMenuManagement: builder.mutation({
    //   query: (id) => ({
    //     url: API_ROUTES.MENU_MANAGEMENT_BY_ID(id),
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['menu-management'],
    // }),
  }),
});

export const { useGetMenuManagementQuery, useAddMenuManagementSaleMutation } = menuManagementApi;
