import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const combosApi = createApi({
  reducerPath: 'combosApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['combos'],

  endpoints: (builder) => ({
    getCombos: builder.query({
      query: ({ search, page, status, limit, companyOrganizer, subCategory, sortBy, sortOrder }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;
        if (subCategory) params.subCategory = subCategory;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_MENU_COMBOS,
            organizerRoute: API_ROUTES.ORGANIZER_MENU_COMBOS,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['combos'],
    }),

    addCombo: builder.mutation({
      query: (newCombo) => ({
        url: '',
        method: 'POST',
        body: newCombo,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_COMBOS,
          organizerRoute: API_ROUTES.ORGANIZER_MENU_COMBOS,
        },
      }),
      invalidatesTags: ['combos'],
    }),

    updateCombo: builder.mutation({
      query: ({ id, ...updatedCombo }) => ({
        url: '',
        method: 'PUT',
        body: updatedCombo,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_COMBOS_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_MENU_COMBOS_BY_ID(id),
        },
      }),
      invalidatesTags: ['combos'],
    }),

    deleteCombo: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_COMBOS_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_MENU_COMBOS_BY_ID(id),
        },
      }),
      invalidatesTags: ['combos'],
    }),
  }),
});

export const { useGetCombosQuery, useAddComboMutation, useUpdateComboMutation, useDeleteComboMutation } = combosApi;
