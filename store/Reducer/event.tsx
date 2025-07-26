import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from "../customFetchBaseQuery";

export const eventApi = createApi({
  reducerPath: "eventApi",
  baseQuery: customFetchBaseQuery(),
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => "/events",
    }),
    addEvent: builder.mutation({
      query: (newEvent) => ({
        url: "/events",
        method: "POST",
        body: newEvent,
      }),
    }),
    updateEvent: builder.mutation({
      query: ({ id, ...updatedEvent }) => ({
        url: `/events/${id}`,
        method: "PUT",
        body: updatedEvent,
      }),
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const {
  useGetEventsQuery,
  useAddEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;
