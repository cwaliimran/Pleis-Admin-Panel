import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const customFetchBaseQuery = () => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_APP_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  return async (arg: any, api: any, extraOptions: any) => {
    let result = await baseQuery(arg, api, extraOptions);

    if (result.error && result.error.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      console.error("Unauthorized access - redirecting to login");
    }
    return result;
  };
};
