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

    // Menu items assigned to one subcategory. Called with `limit: 1` purely as an existence check
    // before a delete, and with a real limit to list them in the transfer modal.
    getMenuItemSubcategoryItems: builder.query({
      query: ({ subCategory, page = 0, limit = 10 }) => ({
        url: '',
        method: 'GET',
        params: { subCategory, page: page + 1, limit },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_ITEM_SUBCATEGORY_ITEMS,
          organizerRoute: API_ROUTES.ORGANIZER_MENU_ITEM_SUBCATEGORY_ITEMS,
        },
      }),
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['menu-item-subcategory'],
    }),

    // Reassigns every menu item from one subcategory to another in a single call.
    bulkUpdateMenuItemSubcategory: builder.mutation({
      query: ({ oldSubCategory, newSubCategory }) => ({
        url: '',
        method: 'PUT',
        body: { oldSubCategory, newSubCategory },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_ITEMS_BULK,
          organizerRoute: API_ROUTES.ORGANIZER_MENU_ITEMS_BULK,
        },
      }),
      invalidatesTags: ['menu-item-subcategory'],
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

    updateMenuItemSubcategoryOrder: builder.mutation({
      query: ({ id, newOrder }) => ({
        url: '',
        method: 'PUT',
        body: { newOrder },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_ITEM_SUBCATEGORIES_ORDER_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_MENU_ITEM_SUBCATEGORIES_ORDER_BY_ID(id),
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
  useLazyGetMenuItemSubcategoriesQuery,
  useGetMenuItemSubcategoryItemsQuery,
  useLazyGetMenuItemSubcategoryItemsQuery,
  useBulkUpdateMenuItemSubcategoryMutation,
  useAddMenuItemSubcategoryMutation,
  useUpdateMenuItemSubcategoryMutation,
  useUpdateMenuItemSubcategoryOrderMutation,
  useDeleteMenuItemSubcategoryMutation,
} = menuItemSubcategoriesApi;
