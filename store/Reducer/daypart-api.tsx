import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const daypartApi = createApi({
  reducerPath: 'daypartApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['daypart'],

  endpoints: (builder) => ({
    getDayparts: builder.query({
      query: ({ search, page, status, date, limit, summary, sortBy, sortOrder }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) params.date = date;
        if (summary) params.summary = summary;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;
        return {
          url: API_ROUTES.ADMIN_PRESET_MENU_DAYPART,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['daypart'],
    }),

    getDaypartCode: builder.query({
      query: () => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_DAYPART_CODE,
        method: 'GET',
      }),
      transformResponse: (res: any) => res.data,
      providesTags: ['daypart'],
    }),

    addDaypart: builder.mutation({
      query: (newDaypart) => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_DAYPART,
        method: 'POST',
        body: newDaypart,
      }),
      invalidatesTags: ['daypart'],
    }),

    updateDaypart: builder.mutation({
      query: ({ id, ...updatedDaypart }) => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_DAYPART_BY_ID(id),
        method: 'PUT',
        body: updatedDaypart,
      }),
      invalidatesTags: ['daypart'],
    }),

    deleteDaypart: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_DAYPART_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['daypart'],
    }),
  }),
});

export const { useGetDaypartsQuery, useGetDaypartCodeQuery, useAddDaypartMutation, useUpdateDaypartMutation, useDeleteDaypartMutation } =
  daypartApi;
