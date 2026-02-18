import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const menuManagementApi = createApi({
  reducerPath: 'menuManagementApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['menu-management'],

  endpoints: (builder) => ({
    getMenuManagement: builder.query({
      query: ({ search, page, filter, sortBy, categoryId, limit, organizer }) => {
        const params: any = {
          page: page + 1,
          limit: limit || 18,
        };
        if (search) params.keyword = search;
        if (filter) params.filter = filter;
        if (sortBy) params.sortBy = sortBy;
        if (categoryId) params.categoryId = categoryId;
        if (organizer) params.organization = organizer;
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

    getCategoriesForMenu: builder.query({
      query: ({ search, page, limit }) => {
        const params: any = {
          page: page + 1,
          limit: limit || 100,
        };
        if (search) params.keyword = search;
        return {
          url: API_ROUTES.ADMIN_MENU_MANAGEMENT_CATEGORIES,
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

    getMenuItemByOrganizer: builder.query({
      query: ({ search, page, limit, organizationId }) => {
        const params: any = {
          page: page + 1,
          limit: limit || 100,
        };
        if (search) params.keyword = search;
        if (organizationId) params.organization = organizationId;
        return {
          url: API_ROUTES.ADMIN_GET_MENU_ITEMS_BY_ORG,
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

    addLimitedTimeItems: builder.mutation({
      query: (data) => ({
        url: API_ROUTES.ADMIN_ADD_LIMITED_TIME_ITEMS,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['menu-management'],
    }),

    // SALE ITEM ENDPOINTS -------------------------------
    
    getSaleItems: builder.query({
      query: ({ search, page, filter, limit, organizer }) => {
        const params: any = {
          page: page + 1,
          limit: limit || 18,
        };
        if (search) params.keyword = search;
        if (filter) params.filter = filter;
        if (organizer) params.organization = organizer;
        return {
          url: API_ROUTES.ADMIN_GET_SALE_ITEMS,
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

    updateSaleItem: builder.mutation({
      query: ({ id, ...updatedSaleItem }) => ({
        url: API_ROUTES.ADMIN_DELETE_SALE_ITEM_BY_ID(id),
        method: 'PUT',
        body: updatedSaleItem,
      }),
      invalidatesTags: ['menu-management'],
    }),

    deleteSaleItem: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_DELETE_SALE_ITEM_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['menu-management'],
    }),
  }),
});

export const {
  useGetMenuManagementQuery,
  useGetSaleItemsQuery,
  useUpdateSaleItemMutation,
  useDeleteSaleItemMutation,
  useAddMenuManagementSaleMutation,
  useGetMenuItemByOrganizerQuery,
  useGetCategoriesForMenuQuery,
  useAddLimitedTimeItemsMutation,
} = menuManagementApi;
