import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const menuItemSubcategoriesApi = createApi({
  reducerPath: 'menuItemSubcategoriesApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['menu-item-subcategory'],

  endpoints: (builder) => ({
    getMenuItemSubcategories: builder.query({
      query: ({ search, page, limit, status, companyOrganizer, sortBy, sortOrder, isNullAllowed = false }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
          // Excludes subcategories not bound to a company; callers can opt back in explicitly.
          isNullAllowed,
        };

        if (companyOrganizer) params.companyOrganizer = companyOrganizer;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_MENU_ITEM_SUBCATEGORIES,
            organizerRoute: API_ROUTES.ORGANIZER_MENU_ITEM_SUBCATEGORIES,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['menu-item-subcategory'],
    }),

    // `companyOrganizer` rides in the body on writes, where `adminOnlyParams` (params-only) can't
    // reach it — callers add it for super-admin and omit it for organizers, who are scoped by token.
    addMenuItemSubcategory: builder.mutation({
      query: (newSubcategory) => ({
        url: '',
        method: 'POST',
        body: newSubcategory,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_ITEM_SUBCATEGORIES,
          organizerRoute: API_ROUTES.ORGANIZER_MENU_ITEM_SUBCATEGORIES,
        },
      }),
      invalidatesTags: ['menu-item-subcategory'],
    }),

    updateMenuItemSubcategory: builder.mutation({
      query: ({ id, ...updatedSubcategory }) => ({
        url: '',
        method: 'PUT',
        body: updatedSubcategory,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_ITEM_SUBCATEGORIES_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_MENU_ITEM_SUBCATEGORIES_BY_ID(id),
        },
      }),
      invalidatesTags: ['menu-item-subcategory'],
    }),

    deleteMenuItemSubcategory: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_ITEM_SUBCATEGORIES_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_MENU_ITEM_SUBCATEGORIES_BY_ID(id),
        },
      }),
      invalidatesTags: ['menu-item-subcategory'],
    }),
  }),
});

export const {
  useGetMenuItemSubcategoriesQuery,
  useAddMenuItemSubcategoryMutation,
  useUpdateMenuItemSubcategoryMutation,
  useDeleteMenuItemSubcategoryMutation,
} = menuItemSubcategoriesApi;
