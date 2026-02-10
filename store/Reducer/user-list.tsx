import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

const ADMIN_ACCESS_TOKEN = process.env.NEXT_PUBLIC_ADMIN_ACCESS_TOKEN;

export const userListApi = createApi({
  reducerPath: 'userListApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['userList', 'companyList'],

  endpoints: (builder) => ({
    /* ─────────────────────────────────────────────
     * User List (admin & organizer)
     * ───────────────────────────────────────────── */
    getUserList: builder.query({
      query: ({ search, page, status, date, limit, userType }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };

        if (date) params.date = date;
        if (userType) params.userType = userType;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_USER_LIST,
            organizerRoute: API_ROUTES.ORGANIZER_USER_LIST,
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['userList'],
    }),

    getUserById: builder.query({
      query: ({ id }) => ({
        url: '',
        method: 'GET',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_USER_LIST_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_USER_LIST_BY_ID(id),
        },
      }),
      transformResponse: (res) => res.data,
    }),

    addUser: builder.mutation({
      query: (newUser) => ({
        url: '',
        method: 'POST',
        body: newUser,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_USER_LIST,
          organizerRoute: API_ROUTES.ORGANIZER_USER_LIST,
        },
      }),
      invalidatesTags: ['userList'],
    }),

    addUserSuperAdminAndGuest: builder.mutation({
      query: (newUser) => ({
        url: '',
        method: 'POST',
        body: newUser,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_USER_LIST,
        },
      }),
      invalidatesTags: ['userList'],
    }),

    updateUserSuperAdminAndGuest: builder.mutation({
      query: (updateUser) => ({
        url: '',
        method: 'PUT',
        body: updateUser,
        headers: {
          'x-admin-access-token': ADMIN_ACCESS_TOKEN,
        },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_USER_LIST_BY_ID(updateUser.id),
        },
      }),
      invalidatesTags: ['userList'],
    }),

    updateUserForUserList: builder.mutation({
      query: (updateUser) => ({
        url: '',
        method: 'PUT',
        body: updateUser,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_PENDING_USER_LIST_BY_ID(updateUser.id),
          organizerRoute: API_ROUTES.ORGANIZER_PENDING_USER_LIST_BY_ID(updateUser.id),
        },
      }),
      invalidatesTags: ['userList'],
    }),

    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: '',
        method: 'PUT',
        body,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_PENDING_USER_LIST_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_PENDING_USER_LIST_BY_ID(id),
        },
      }),
      invalidatesTags: ['userList', 'companyList'],
    }),

    // OTHER ENDPOINTS RELATED TO USERS
    updateUserTerms: builder.mutation({
      query: ({ id, body }) => ({
        url: API_ROUTES.UPDATE_TERMS(id),
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['userList', 'companyList'],
    }),

    getCompanyList: builder.query({
      query: () => ({
        url: API_ROUTES.LOYALTY_LISTINGS,
        method: 'GET',
      }),
      transformResponse: (res) => res.data,
      providesTags: ['companyList'],
    }),

    getLoyaltyClubsList: builder.query({
      query: ({ search, page, limit }) => {
        const params: any = {
          keyword: search,
          page: page + 1,
          limit,
        };
        return {
          url: API_ROUTES.LOYALTY_LISTINGS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => res.data,
    }),

    updatePendingUser: builder.mutation({
      query: ({ id, status }) => ({
        url: API_ROUTES.ADMIN_PENDING_USER_LIST_BY_ID(id),
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['userList'],
    }),

    updatePassword: builder.mutation({
      query: (body) => ({
        url: API_ROUTES.CHANGE_PASSWORD,
        method: 'POST',
        body: body,
      }),
    }),
  }),
});

export const {
  useGetUserListQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useAddUserSuperAdminAndGuestMutation,
  useUpdateUserMutation,
  useUpdateUserTermsMutation,
  useGetCompanyListQuery,
  useGetLoyaltyClubsListQuery,
  useUpdateUserForUserListMutation,
  useUpdateUserSuperAdminAndGuestMutation,
  useUpdatePendingUserMutation,
  useUpdatePasswordMutation,
} = userListApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// const ADMIN_ACCESS_TOKEN = process.env.NEXT_PUBLIC_ADMIN_ACCESS_TOKEN;

// export const userListApi = createApi({
//   reducerPath: 'userListApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['userList', 'companyList'],

//   endpoints: (builder) => ({
//     getUserList: builder.query({
//       query: ({ search, page, status, date, limit, userType }) => {
//         const params: any = {
//           keyword: search,
//           status,
//           page: page + 1,
//           limit,
//         };
//         if (date) params.date = date;
//         if (userType) params.userType = userType;
//         return {
//           url: API_ROUTES.ADMIN_USER_LIST,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['userList'],
//     }),

//     getUserById: builder.query({
//       query: ({ id }) => ({
//         url: API_ROUTES.ADMIN_USER_LIST_BY_ID(id),
//         method: 'GET',
//       }),
//       transformResponse: (res) => res.data,
//     }),

//     addUser: builder.mutation({
//       query: (newUser) => ({
//         url: API_ROUTES.ADMIN_USER_LIST,
//         method: 'POST',
//         body: newUser,
//       }),
//       invalidatesTags: ['userList'],
//     }),

//     addUserSuperAdminAndGuest: builder.mutation({
//       query: (newUser) => ({
//         url: API_ROUTES.ADMIN_USER_LIST,
//         method: 'POST',
//         body: newUser,
//         headers: {
//           'x-admin-access-token': ADMIN_ACCESS_TOKEN,
//         },
//       }),
//       invalidatesTags: ['userList'],
//     }),

//     updateUserSuperAdminAndGuest: builder.mutation({
//       query: (updateUser) => ({
//         url: API_ROUTES.ADMIN_USER_LIST_BY_ID(updateUser.id),
//         method: 'PUT',
//         body: updateUser,
//         headers: {
//           'x-admin-access-token': ADMIN_ACCESS_TOKEN,
//         },
//       }),
//       invalidatesTags: ['userList'],
//     }),

//     updateUserForUserList: builder.mutation({
//       query: (updateUser) => ({
//         url: API_ROUTES.ADMIN_PENDING_USER_LIST_BY_ID(updateUser.id),
//         method: 'PUT',
//         body: updateUser,
//       }),
//       invalidatesTags: ['userList'],
//     }),

//     updateUser: builder.mutation({
//       query: ({ id, body }) => ({
//         url: API_ROUTES.ADMIN_PENDING_USER_LIST_BY_ID(id),
//         method: 'PUT',
//         body: body,
//       }),
//       invalidatesTags: ['userList', 'companyList'],
//     }),

//     // OTHER ENDPOINTS RELATED TO USERS
//     updateUserTerms: builder.mutation({
//       query: ({ id, body }) => ({
//         url: API_ROUTES.UPDATE_TERMS(id),
//         method: 'PUT',
//         body: body,
//       }),
//       invalidatesTags: ['userList', 'companyList'],
//     }),

//     getCompanyList: builder.query({
//       query: () => ({
//         url: API_ROUTES.LOYALTY_LISTINGS,
//         method: 'GET',
//       }),
//       transformResponse: (res) => res.data,
//       providesTags: ['companyList'],
//     }),

//     getLoyaltyClubsList: builder.query({
//       query: ({ search, page, limit }) => {
//         const params: any = {
//           keyword: search,
//           page: page + 1,
//           limit,
//         };
//         return {
//           url: API_ROUTES.LOYALTY_LISTINGS,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => res.data,
//     }),

//     updatePendingUser: builder.mutation({
//       query: ({ id, status }) => ({
//         url: API_ROUTES.ADMIN_PENDING_USER_LIST_BY_ID(id),
//         method: 'PUT',
//         body: { status },
//       }),
//       invalidatesTags: ['userList'],
//     }),

//     updatePassword: builder.mutation({
//       query: (body) => ({
//         url: API_ROUTES.CHANGE_PASSWORD,
//         method: 'POST',
//         body: body,
//       }),
//     }),
//   }),
// });

// export const {
//   useGetUserListQuery,
//   useGetUserByIdQuery,
//   useAddUserMutation,
//   useAddUserSuperAdminAndGuestMutation,
//   useUpdateUserMutation,
//   useUpdateUserTermsMutation,
//   useGetCompanyListQuery,
//   useGetLoyaltyClubsListQuery,
//   useUpdateUserForUserListMutation,
//   useUpdateUserSuperAdminAndGuestMutation,
//   useUpdatePendingUserMutation,
//   useUpdatePasswordMutation,
// } = userListApi;
