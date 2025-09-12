import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['settings'],

  endpoints: (builder) => ({
    getTermsAndCondition: builder.query({
      query: () => {
        return {
          url: API_ROUTES.TERMSANDCONDITION,
          method: 'GET',
        };
      },
      transformResponse: (res) => ({
        data: res.data,
      }),
      providesTags: ['settings'],
    }),

    updateTerm: builder.mutation({
      query: (updatedTerm) => ({
        url: API_ROUTES.TERMSANDCONDITION_BY_ID(updatedTerm.id),
        method: 'PUT',
        body: updatedTerm,
      }),
      invalidatesTags: ['settings'],
    }),
  }),
});

export const { useGetTermsAndConditionQuery, useUpdateTermMutation } =
  settingsApi;
