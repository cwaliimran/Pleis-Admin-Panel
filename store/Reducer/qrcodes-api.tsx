import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const qrcodesApi = createApi({
  reducerPath: 'qrcodesApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['qrcode'],

  endpoints: (builder) => ({
    getQrcodes: builder.query({
      query: ({ companyOrganizer }) => {
        const params: any = {
          // keyword: search,
          // status,
          // page: page + 1,
          limit: 1000,
        };

        // if (date) (params as any).date = date;
        if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
        return {
          url: API_ROUTES.ADMIN_QR_CODE,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['qrcode'],
    }),

    addQrcode: builder.mutation({
      query: (newQrcode) => ({
        url: API_ROUTES.ADMIN_QR_CODE,
        method: 'POST',
        body: newQrcode,
      }),
      invalidatesTags: ['qrcode'],
    }),

    deleteQrcode: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_QR_CODE_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['qrcode'],
    }),
  }),
});

export const { useGetQrcodesQuery, useAddQrcodeMutation, useDeleteQrcodeMutation } = qrcodesApi;
