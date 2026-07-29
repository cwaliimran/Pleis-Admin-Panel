import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const discountsApi = createApi({
  reducerPath: 'discountsApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['discounts'],

  endpoints: (builder) => ({
    getDiscounts: builder.query({
      query: ({ search, page, status, type, startDate, endDate, limit, companyOrganizer, sortBy, sortOrder }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (type) params.type = type;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_MENU_DISCOUNTS,
            organizerRoute: API_ROUTES.ORGANIZER_MENU_DISCOUNTS,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['discounts'],
    }),

    addDiscount: builder.mutation({
      query: (newDiscount) => ({
        url: '',
        method: 'POST',
        body: newDiscount,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_DISCOUNTS,
          organizerRoute: API_ROUTES.ORGANIZER_MENU_DISCOUNTS,
        },
      }),
      invalidatesTags: ['discounts'],
    }),

    updateDiscount: builder.mutation({
      query: ({ id, ...updatedDiscount }) => ({
        url: '',
        method: 'PUT',
        body: updatedDiscount,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_DISCOUNTS_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_MENU_DISCOUNTS_BY_ID(id),
        },
      }),
      invalidatesTags: ['discounts'],
    }),

    deleteDiscount: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_DISCOUNTS_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_MENU_DISCOUNTS_BY_ID(id),
        },
      }),
      invalidatesTags: ['discounts'],
    }),
  }),
});

export const { useGetDiscountsQuery, useAddDiscountMutation, useUpdateDiscountMutation, useDeleteDiscountMutation } = discountsApi;
