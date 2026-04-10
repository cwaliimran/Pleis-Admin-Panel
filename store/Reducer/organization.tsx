import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const organizationApi = createApi({
  reducerPath: 'organizationApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['organization'],

  endpoints: (builder) => ({
    getOrganization: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };

        if (date) (params as any).date = date;
        if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_ORGANIZATION,
            organizerRoute: API_ROUTES.ORGANIZATION,
            adminOnlyParams: ['companyOrganizer'], // Only admins can use this param
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['organization'],
    }),

    getOrganizationByCompany: builder.query({
      query: ({ companyOrganizer }) => {
        return {
          url: API_ROUTES.ADMIN_ORGANIZATION_BY_COMPANY_ORGANIZER(companyOrganizer),
          method: 'GET',
          roleBasedRouting: {
            adminOnly: true, // Only admins can access this endpoint
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['organization'],
    }),

    getOrganizationsOnOrganizerSide: builder.query({
      query: ({}) => {
        return {
          url: API_ROUTES.ORGANIZATION_ALL,
          method: 'GET',
          roleBasedRouting: {
            adminOnly: false, // Only organizer can access this endpoint
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['organization'],
    }),

    addOrganization: builder.mutation({
      query: (newOrganization) => ({
        url: '',
        method: 'POST',
        body: newOrganization,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_ORGANIZATION,
          organizerRoute: API_ROUTES.ORGANIZATION,
        },
      }),
      invalidatesTags: ['organization'],
    }),

    getOrganizationById: builder.query({
      query: ({ id }) => ({
        url: '',
        method: 'GET',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_ORGANIZATION_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZATION_BY_ID(id),
        },
      }),
      transformResponse: (res) => ({
        data: res.data,
      }),
      providesTags: ['organization'],
    }),

    updateOrganization: builder.mutation({
      query: ({ id, ...updatedOrganization }) => ({
        url: '',
        method: 'PUT',
        body: updatedOrganization,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_ORGANIZATION_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZATION_BY_ID(id),
        },
      }),
      invalidatesTags: ['organization'],
    }),

    deleteOrganization: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_ORGANIZATION_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZATION_BY_ID(id),
        },
      }),
      invalidatesTags: ['organization'],
    }),

    // getOrgNotificationsById: builder.query({
    //   query: ({ id, page, limit }) => ({
    //     url: API_ROUTES.ADMIN_ORGANIZATION_NOTIFICATIONS_BY_ID(id),
    //     method: 'GET',
    //     params: {
    //       page: page + 1,
    //       limit,
    //     },
    //   }),
    //   // transformResponse: (res) => res.data,
    //   transformResponse: (res) => ({
    //     data: res.data,
    //     meta: res.meta,
    //   }),
    // }),

    getOrgNotificationsById: builder.query({
      query: ({ id, page, limit }) => ({
        url: '',
        method: 'GET',
        params: {
          page: page + 1,
          limit,
        },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_ORGANIZATION_NOTIFICATIONS_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_ORGANIZATION_NOTIFICATIONS_BY_ID(id),
        },
      }),
      // transformResponse: (res) => res.data,
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
    }),

    getOrganizationAnalytics: builder.query({
      query: ({ organizationId, dateFilter }: { organizationId: string; dateFilter?: string }) => {
        const params: any = { organization: organizationId };
        if (dateFilter) params.dateFilter = dateFilter;
        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_ORGANIZATION_ANALYTICS,
            organizerRoute: API_ROUTES.ORGANIZER_ORGANIZATION_ANALYTICS,
          },
        };
      },
      transformResponse: (res: any) => res?.data ?? {},
    }),
  }),
});

export const {
  useGetOrganizationQuery,
  useGetOrganizationByCompanyQuery,
  useGetOrganizationsOnOrganizerSideQuery,
  useAddOrganizationMutation,
  useGetOrganizationByIdQuery,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useGetOrgNotificationsByIdQuery,
  useGetOrganizationAnalyticsQuery,
} = organizationApi;
