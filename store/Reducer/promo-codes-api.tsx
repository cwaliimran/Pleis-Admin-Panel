import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const promoCodesApi = createApi({
  reducerPath: 'promoCodesApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['promo-code'],

  endpoints: (builder) => ({
    getPromoCodes: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };

        if (date) params.date = date;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_PROMO_CODES,
            organizerRoute: API_ROUTES.ORGANIZER_PROMO_CODES,
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['promo-code'],
    }),

    addPromoCode: builder.mutation({
      query: (newPromoCode) => ({
        url: '',
        method: 'POST',
        body: newPromoCode,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_PROMO_CODES,
          organizerRoute: API_ROUTES.ORGANIZER_PROMO_CODES,
        },
      }),
      invalidatesTags: ['promo-code'],
    }),

    updatePromoCode: builder.mutation({
      query: ({ id, ...updatedPromoCode }) => ({
        url: '',
        method: 'PUT',
        body: updatedPromoCode,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_PROMO_CODES_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_PROMO_CODES_BY_ID(id),
        },
      }),
      invalidatesTags: ['promo-code'],
    }),

    deletePromoCode: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_PROMO_CODES_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_PROMO_CODES_BY_ID(id),
        },
      }),
      invalidatesTags: ['promo-code'],
    }),
  }),
});

export const { useGetPromoCodesQuery, useAddPromoCodeMutation, useUpdatePromoCodeMutation, useDeletePromoCodeMutation } = promoCodesApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import API_ROUTES from '../apiRoutes';
// import { customFetchBaseQuery } from '../customFetchBaseQuery';

// export const promoCodesApi = createApi({
//   reducerPath: 'promoCodesApi',
//   baseQuery: customFetchBaseQuery(),
//   tagTypes: ['promo-code'],

//   endpoints: (builder) => ({
//     getPromoCodes: builder.query({
//       query: ({ search, page, status, date, limit }) => {
//         const params: any = {
//           keyword: search,
//           status,
//           page: page + 1,
//           limit,
//         };
//         if (date) (params as any).date = date;
//         return {
//           url: API_ROUTES.PROMO_CODES,
//           method: 'GET',
//           params,
//         };
//       },
//       transformResponse: (res) => ({
//         data: res.data,
//         meta: res.meta,
//       }),
//       providesTags: ['promo-code'],
//     }),

//     addPromoCode: builder.mutation({
//       query: (newPromoCode) => ({
//         url: API_ROUTES.PROMO_CODES,
//         method: 'POST',
//         body: newPromoCode,
//       }),
//       invalidatesTags: ['promo-code'],
//     }),

//     updatePromoCode: builder.mutation({
//       query: ({ id, ...updatedPromoCode }) => ({
//         url: API_ROUTES.PROMO_CODES_BY_ID(id),
//         method: 'PUT',
//         body: updatedPromoCode,
//       }),
//       invalidatesTags: ['promo-code'],
//     }),

//     deletePromoCode: builder.mutation({
//       query: (id) => ({
//         url: API_ROUTES.PROMO_CODES_BY_ID(id),
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['promo-code'],
//     }),
//   }),
// });

// export const { useGetPromoCodesQuery, useAddPromoCodeMutation, useUpdatePromoCodeMutation, useDeletePromoCodeMutation } = promoCodesApi;
