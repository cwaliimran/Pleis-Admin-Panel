import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { handleApiError } from './handleApiError';
import { CurrentUrl } from '@/constant/constant';
import { logout } from './slice/userSlice';
import { resetStore } from './store';

const getResolvedTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
};

const serializeQueryParams = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    searchParams.append(key, String(value));
  });

  return searchParams.toString().replace(/\+/g, '%20');
};

export const customFetchBaseQuery = () => {
  const baseQuery = fetchBaseQuery({
    baseUrl: CurrentUrl,
    paramsSerializer: serializeQueryParams,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as any;
      const token = state?.userSlice?.user?.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('X-Timezone', getResolvedTimezone());

      return headers;
    },
  });

  return async (arg: any, api: any, extraOptions: any) => {
    const result = await baseQuery(arg, api, extraOptions);

    if (result.error) {
      const message = handleApiError(result.error);
      console.log(message);

      const { status } = result.error;

      // Handle unauthorized access (token expired / invalid)
      if (status === 401) {
        const isBrowser = typeof window !== 'undefined';
        const isOnLoginPage = isBrowser && (window.location.pathname === '/admin/login' || window.location.pathname === '/');

        if (!isOnLoginPage) {
          api.dispatch(logout());
          api.dispatch(resetStore());

          if (isBrowser) {
            window.location.replace('/');
          }
        }
      }
    }

    return result;
  };
};
   