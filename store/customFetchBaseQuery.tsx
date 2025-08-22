import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { handleApiError } from './handleApiError';

export const customFetchBaseQuery = () => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  return async (arg: any, api: any, extraOptions: any) => {
    let result = await baseQuery(arg, api, extraOptions);

    if (result.error) {
      const message = handleApiError(result.error);
      // You can dispatch a notification or log the error here
      console.error(message);
      console.error('Unauthorized access - redirecting to login');
    }
    return result;
  };
};
