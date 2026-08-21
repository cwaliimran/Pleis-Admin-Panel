import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

// ============================================================
// In-app ordering settings held on the organization document
//
// Tips and the session timer live under `inAppOrderingSettings` on the
// organization itself, not on the `/in-app-ordering/settings` record. They
// are read with `getOrganizationById` and written with `updateOrganizationV2`.
// ============================================================

export type ApiTipType = 'fixed' | 'percentage';

export interface ApiTipPreset {
  /** Assigned by the backend; absent on presets the UI has just added. */
  _id?: string;
  tipType: ApiTipType;
  value: number;
}

export interface ApiOrganizationTips {
  enableCustomerTipping?: boolean;
  allowCustomTips?: boolean;
  tipPresets?: ApiTipPreset[];
}

export interface ApiInAppOrderingSettings {
  tips?: ApiOrganizationTips | null;
  /** Minutes. Not restricted to the presets the UI suggests. */
  sessionTimerLength?: number;
}

export interface UpdateOrganizationV2Args {
  /** The organization `_id`. */
  id: string;
  inAppOrderingSettings: ApiInAppOrderingSettings;
}

// ============================================================
// Operating hours held on the organization document
//
// One entry per weekday, keyed by the lowercase English day name. Read with
// `getOrganizationById`; written by the organization "other details" modal.
//
// A closed day still carries `from`/`to` — they are `"00:00"` placeholders,
// so `isOpen` is the only reliable signal. `to` earlier than or equal to
// `from` on an open day means the venue closes after midnight.
// ============================================================

export type ApiWeekdayKey = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export interface ApiOperatingHoursBreak {
  from: string | null;
  to: string | null;
}

export interface ApiOperatingHoursDay {
  /** 24h `HH:mm`. */
  from?: string;
  to?: string;
  break?: ApiOperatingHoursBreak | null;
  isOpen?: boolean;
}

export type ApiOperatingHours = Partial<Record<ApiWeekdayKey, ApiOperatingHoursDay | null>>;

export const organizationApi = createApi({
  reducerPath: 'organizationApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['organization'],

  endpoints: (builder) => ({
    getOrganization: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer, sortBy, sortOrder, subType, organization }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };

        if (date) params.date = date;
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;
        if (subType) params.subType = subType;
        if (organization) params.organization = organization;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_ORGANIZATION,
            organizerRoute: API_ROUTES.ORGANIZATION,
            adminOnlyParams: ['companyOrganizer', 'organization'],
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['organization'],
    }),

    getAllOrganizationsAdmin: builder.query({
      query: () => ({
        url: API_ROUTES.ADMIN_ORGANIZATION_ALL,
        method: 'GET',
      }),
      transformResponse: (res) => ({
        data: res.data,
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

    /**
     * Partial update against the v2 route. Only the keys sent are changed,
     * so the caller passes just the `inAppOrderingSettings` subtree.
     */
    updateOrganizationV2: builder.mutation<{ message?: string; data?: unknown }, UpdateOrganizationV2Args>({
      query: ({ id, inAppOrderingSettings }) => ({
        url: '',
        method: 'PUT',
        body: { inAppOrderingSettings },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_ORGANIZATION_V2_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_ORGANIZATION_V2_BY_ID(id),
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
  useGetAllOrganizationsAdminQuery,
  useGetOrganizationByCompanyQuery,
  useGetOrganizationsOnOrganizerSideQuery,
  useAddOrganizationMutation,
  useGetOrganizationByIdQuery,
  useUpdateOrganizationMutation,
  useUpdateOrganizationV2Mutation,
  useDeleteOrganizationMutation,
  useGetOrgNotificationsByIdQuery,
  useGetOrganizationAnalyticsQuery,
} = organizationApi;
