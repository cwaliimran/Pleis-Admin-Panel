import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const itemsCategoryApi = createApi({
  reducerPath: 'itemsCategoryApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['items-category'],

  endpoints: (builder) => ({
    getItemsCategory: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };

        if (date) params.date = date;
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_MENU_CATEGORIES,
            organizerRoute: API_ROUTES.ORGANIZER_MENU_CATEGORIES,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['items-category'],
    }),

    addItemsCategory: builder.mutation({
      query: (newItemsCategory) => ({
        url: '',
        method: 'POST',
        body: newItemsCategory,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_CATEGORIES,
          organizerRoute: API_ROUTES.ORGANIZER_MENU_CATEGORIES,
        },
      }),
      invalidatesTags: ['items-category'],
    }),

    updateItemsCategory: builder.mutation({
      query: ({ id, ...updatedItemsCategory }) => ({
        url: '',
        method: 'PUT',
        body: updatedItemsCategory,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_CATEGORIES_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_MENU_CATEGORIES_BY_ID(id),
        },
      }),
      invalidatesTags: ['items-category'],
    }),

    deleteItemsCategory: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_CATEGORIES_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_MENU_CATEGORIES_BY_ID(id),
        },
      }),
      invalidatesTags: ['items-category'],
    }),
  }),
});

export const { useGetItemsCategoryQuery, useAddItemsCategoryMutation, useUpdateItemsCategoryMutation, useDeleteItemsCategoryMutation } =
  itemsCategoryApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const itemsCategoryApi = createApi({
//   reducerPath: 'itemsCategoryApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['items-category'],

//   endpoints: (builder) => ({
//     getItemsCategory: builder.query({
//       query: ({ search, page, status, date, limit, companyOrganizer }) => {
//         const params: any = {
//           keyword: search,
//           status,
//           page: page + 1,
//           limit,
//         };
//         if (date) (params as any).date = date;
//         if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
//         return {
//           url: API_ROUTES.ADMIN_MENU_CATEGORIES,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['items-category'],
//     }),

//     addItemsCategory: builder.mutation({
//       query: (newItemsCategory) => ({
//         url: API_ROUTES.ADMIN_MENU_CATEGORIES,
//         method: 'POST',
//         body: newItemsCategory,
//       }),
//       invalidatesTags: ['items-category'],
//     }),

//     updateItemsCategory: builder.mutation({
//       query: ({ id, ...updatedItemsCategory }) => ({
//         url: API_ROUTES.ADMIN_MENU_CATEGORIES_BY_ID(id),
//         method: 'PUT',
//         body: updatedItemsCategory,
//       }),
//       invalidatesTags: ['items-category'],
//     }),

//     deleteItemsCategory: builder.mutation({
//       query: (id) => ({
//         url: API_ROUTES.ADMIN_MENU_CATEGORIES_BY_ID(id),
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['items-category'],
//     }),
//   }),
// });

// export const { useGetItemsCategoryQuery, useAddItemsCategoryMutation, useUpdateItemsCategoryMutation, useDeleteItemsCategoryMutation } =
//   itemsCategoryApi;
