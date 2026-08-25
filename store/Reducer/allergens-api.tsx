import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const allergensApi = createApi({
  reducerPath: 'allergensApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['allergens'],

  endpoints: (builder) => ({
    getAllergens: builder.query({
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
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_PRESET_MENU_ALLERGEN,
            organizerRoute: API_ROUTES.ORGANIZER_PRESET_MENU_ALLERGEN,
          },
        };
      },
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['allergens'],
    }),

    getAllergenCode: builder.query({
      query: () => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_ALLERGEN_CODE,
        method: 'GET',
      }),
      transformResponse: (res: any) => res.data,
      providesTags: ['allergens'],
    }),

    addAllergen: builder.mutation({
      query: (newAllergen) => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_ALLERGEN,
        method: 'POST',
        body: newAllergen,
      }),
      invalidatesTags: ['allergens'],
    }),

    updateAllergen: builder.mutation({
      query: ({ id, ...updatedAllergen }) => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_ALLERGEN_BY_ID(id),
        method: 'PUT',
        body: updatedAllergen,
      }),
      invalidatesTags: ['allergens'],
    }),

    deleteAllergen: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_ALLERGEN_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['allergens'],
    }),
  }),
});

export const { useGetAllergensQuery, useGetAllergenCodeQuery, useAddAllergenMutation, useUpdateAllergenMutation, useDeleteAllergenMutation } =
  allergensApi;
