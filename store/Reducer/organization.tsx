import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from "../customFetchBaseQuery";

export const organizationApi = createApi({
  reducerPath: "organizationApi",
  baseQuery: customFetchBaseQuery(),
  endpoints: (builder) => ({
    getOrganizations: builder.query({
      query: () => "/organizations",
    }),
    addOrganization: builder.mutation({
      query: (newOrganization) => ({
        url: "/organizations",
        method: "POST",
        body: newOrganization,
      }),
    }),
    updateOrganization: builder.mutation({
      query: ({ id, ...updatedOrganization }) => ({
        url: `/organizations/${id}`,
        method: "PUT",
        body: updatedOrganization,
      }),
    }),
    deleteOrganization: builder.mutation({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const {
  useGetOrganizationsQuery,
  useAddOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} = organizationApi;
