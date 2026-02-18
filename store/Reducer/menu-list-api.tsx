import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const menuListApi = createApi({
  reducerPath: 'menuListApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['menu-list'],

  endpoints: (builder) => ({
    getMenuList: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer, organizations }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) params.date = date;
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;
        if (organizations) params.organization = organizations;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_MENU,
            organizerRoute: API_ROUTES.ORGANIZER_MENU,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['menu-list'],
    }),

    getMenuByCompany: builder.query({
      query: ({ companyOrganizer }) => ({
        url: API_ROUTES.ADMIN_MENU_BY_COMPANY_ORGANIZER(companyOrganizer),
        method: 'GET',
        // roleBasedRouting: {
        //   adminOnly: true,
        // },
      }),
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['menu-list'],
    }),

    addMenuList: builder.mutation({
      query: (newMenuList) => ({
        url: '',
        method: 'POST',
        body: newMenuList,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU,
          organizerRoute: API_ROUTES.ORGANIZER_MENU,
        },
      }),
      invalidatesTags: ['menu-list'],
    }),

    duplicateMenu: builder.mutation({
      query: ({ id, ...updatedMenuList }) => ({
        url: '',
        method: 'POST',
        body: updatedMenuList,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_DUPLICATE_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_MENU_DUPLICATE_BY_ID(id),
        },
      }),
      invalidatesTags: ['menu-list'],
    }),

    updateMenuList: builder.mutation({
      query: ({ id, ...updatedMenuList }) => ({
        url: '',
        method: 'PUT',
        body: updatedMenuList,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_MENU_BY_ID(id),
        },
      }),
      invalidatesTags: ['menu-list'],
    }),

    deleteMenuList: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_MENU_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_MENU_BY_ID(id),
        },
      }),
      invalidatesTags: ['menu-list'],
    }),
  }),
});

export const {
  useGetMenuListQuery,
  useGetMenuByCompanyQuery,
  useAddMenuListMutation,
  useDuplicateMenuMutation,
  useUpdateMenuListMutation,
  useDeleteMenuListMutation,
} = menuListApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const menuListApi = createApi({
//   reducerPath: 'menuListApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['menu-list'],

//   endpoints: (builder) => ({
//     getMenuList: builder.query({
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
//           url: API_ROUTES.ADMIN_MENU,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['menu-list'],
//     }),

//     getMenuByCompany: builder.query({
//       query: ({ companyOrganizer }) => {
//         return {
//           url: API_ROUTES.ADMIN_MENU_BY_COMPANY_ORGANIZER(companyOrganizer),
//           method: 'GET',
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['menu-list'],
//     }),

//     addMenuList: builder.mutation({
//       query: (newMenuList) => ({
//         url: API_ROUTES.ADMIN_MENU,
//         method: 'POST',
//         body: newMenuList,
//       }),
//       invalidatesTags: ['menu-list'],
//     }),

//     duplicateMenu: builder.mutation({
//       query: ({ id, ...updatedMenuList }) => ({
//         url: API_ROUTES.ADMIN_MENU_DUPLICATE_BY_ID(id),
//         method: 'POST',
//         body: updatedMenuList,
//       }),
//       invalidatesTags: ['menu-list'],
//     }),

//     updateMenuList: builder.mutation({
//       query: ({ id, ...updatedMenuList }) => ({
//         url: API_ROUTES.ADMIN_MENU_BY_ID(id),
//         method: 'PUT',
//         body: updatedMenuList,
//       }),
//       invalidatesTags: ['menu-list'],
//     }),

//     deleteMenuList: builder.mutation({
//       query: (id) => ({
//         url: API_ROUTES.ADMIN_MENU_BY_ID(id),
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['menu-list'],
//     }),
//   }),
// });

// export const {
//   useGetMenuListQuery,
//   useGetMenuByCompanyQuery,
//   useAddMenuListMutation,
//   useDuplicateMenuMutation,
//   useUpdateMenuListMutation,
//   useDeleteMenuListMutation,
// } = menuListApi;
