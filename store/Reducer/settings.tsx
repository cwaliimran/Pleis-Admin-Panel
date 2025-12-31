// store/Reducer/settings.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';
import { TermsApiResponse, CreateSettingsPayload, UpdateSettingsPayload } from '@/sections/terms/types';

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['organizerTerms', 'customerTerms', 'privacyPolicy'],

  endpoints: (builder) => ({
    // GET Organizer Terms & Conditions
    getOrganizerTerms: builder.query<TermsApiResponse, void>({
      query: () => ({
        url: API_ROUTES.TERMSANDCONDITION,
        method: 'GET',
      }),
      providesTags: ['organizerTerms'],
    }),

    // GET Customer Terms & Conditions
    getCustomerTerms: builder.query<TermsApiResponse, void>({
      query: () => ({
        url: API_ROUTES.TERMSANDCONDITION_CUSTOMER,
        method: 'GET',
      }),
      providesTags: ['customerTerms'],
    }),

    // GET Privacy Policy
    getPrivacyPolicy: builder.query<TermsApiResponse, void>({
      query: () => ({
        url: API_ROUTES.TERMSANDCONDITION_PRIVACY_POLICY,
        method: 'GET',
      }),
      providesTags: ['privacyPolicy'],
    }),

    // POST Create Settings
    createSettings: builder.mutation<TermsApiResponse, CreateSettingsPayload>({
      query: (payload) => ({
        url: API_ROUTES.CREATE_SETTINGS,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['organizerTerms', 'customerTerms', 'privacyPolicy'],
    }),

    // PUT Update Settings
    updateSettings: builder.mutation<TermsApiResponse, UpdateSettingsPayload>({
      query: ({ id, ...payload }) => ({
        url: API_ROUTES.TERMSANDCONDITION_BY_ID(id),
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['organizerTerms', 'customerTerms', 'privacyPolicy'],
    }),
  }),
});

export const { useGetOrganizerTermsQuery, useGetCustomerTermsQuery, useGetPrivacyPolicyQuery, useCreateSettingsMutation, useUpdateSettingsMutation } =
  settingsApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const settingsApi = createApi({
//   reducerPath: 'settingsApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['settings'],

//   endpoints: (builder) => ({
//     getTermsAndCondition: builder.query({
//       query: () => {
//         return {
//           url: API_ROUTES.TERMSANDCONDITION,
//           method: 'GET',
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//       }),
//       providesTags: ['settings'],
//     }),

//     updateTerm: builder.mutation({
//       query: (updatedTerm) => ({
//         url: API_ROUTES.TERMSANDCONDITION_BY_ID(updatedTerm.id),
//         method: 'PUT',
//         body: updatedTerm,
//       }),
//       invalidatesTags: ['settings'],
//     }),
//   }),
// });

// export const { useGetTermsAndConditionQuery, useUpdateTermMutation } = settingsApi;
