import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { handleApiError } from './handleApiError';
import { CurrentUrl } from '@/constant/constant';
import { logout } from './slice/userSlice';
import { resetStore } from './store';

export const customFetchBaseQuery = () => {
  const baseQuery = fetchBaseQuery({
    baseUrl: CurrentUrl,
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
      console.log(message);

      // Check for 401 Unauthorized (token expired)
      if (result.error.status === 401) {
        api.dispatch(logout());
        api.dispatch(resetStore());

        if (typeof window !== 'undefined') {
          window.location.replace('/');
        }
      }
    }
    return result;
  };
};
