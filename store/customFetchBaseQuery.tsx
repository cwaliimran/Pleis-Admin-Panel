import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { handleApiError } from './handleApiError';

export const customFetchBaseQuery = () => {
  const baseQuery = fetchBaseQuery({
    // baseUrl: process.env.NEXT_PUBLIC_API_URL,
    baseUrl: process.env.NEXT_PUBLIC_API_URL_LOCAL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as any;
      const token = state?.userSlice?.user?.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  return async (arg: any, api: any, extraOptions: any) => {
    const result = await baseQuery(arg, api, extraOptions);

    if (result.error) {
      const message = handleApiError(result.error);
      // You can dispatch a notification or log the error here
      console.log(message);
      console.log('Unauthorized access - redirecting to login');
    }
    return result;
  };
};
