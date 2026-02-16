import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { handleApiError } from '../handleApiError';
import { CurrentUrl } from '@/constant/constant';
import { logout } from '../slice/userSlice';
import { resetStore } from '../store';

export const customFetchBaseQueryWithRoleRouting = () => {
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

  return async (args: any, api: any, extraOptions: any) => {
    // Modify URL based on user role if roleBasedRouting is provided
    if (args.roleBasedRouting) {
      const state = api.getState() as any;
      const userRole = state?.userSlice?.user?.role;
      const isSuperAdmin = userRole === 'superAdmin' || userRole === 'admin';

      const { adminRoute, organizerRoute, adminOnlyParams = [], organizerOnlyParams = [] } = args.roleBasedRouting;

      // Select appropriate route based on user role
      if (isSuperAdmin && adminRoute) {
        args.url = adminRoute;
      } else if (organizerRoute) {
        args.url = organizerRoute;
      }

      // Filter params for non-admin users (remove admin-only params)
      if (!isSuperAdmin && args.params && adminOnlyParams.length > 0) {
        const filteredParams = { ...args.params };
        adminOnlyParams.forEach((param: string) => {
          delete filteredParams[param];
        });
        args.params = filteredParams;
      }

      // Filter params for admin users (remove organizer-only params)
      if (isSuperAdmin && args.params && organizerOnlyParams.length > 0) {
        const filteredParams = { ...args.params };
        organizerOnlyParams.forEach((param: string) => {
          delete filteredParams[param];
        });
        args.params = filteredParams;
      }

      // Check admin-only endpoints
      if (args.roleBasedRouting.adminOnly && !isSuperAdmin) {
        throw new Error('Unauthorized: Only administrators can access this endpoint');
      }

      // Remove the roleBasedRouting object before making the request
      delete args.roleBasedRouting;
    }

    const result = await baseQuery(args, api, extraOptions);

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

// import { fetchBaseQuery } from '@reduxjs/toolkit/query';
// import { handleApiError } from '../handleApiError';
// import { CurrentUrl } from '@/constant/constant';
// import { logout } from '../slice/userSlice';
// import { resetStore } from '../store';

// export const customFetchBaseQueryWithRoleRouting = () => {
//   const baseQuery = fetchBaseQuery({
//     baseUrl: CurrentUrl,
//     prepareHeaders: (headers, { getState }) => {
//       const state = getState() as any;
//       const token = state?.userSlice?.user?.token;

//       if (token) {
//         headers.set('Authorization', `Bearer ${token}`);
//       }
//       return headers;
//     },
//   });

//   return async (args: any, api: any, extraOptions: any) => {
//     // Modify URL based on user role if roleBasedRouting is provided
//     if (args.roleBasedRouting) {
//       const state = api.getState() as any;
//       const userRole = state?.userSlice?.user?.role;
//       const isSuperAdmin = userRole === 'superAdmin' || userRole === 'admin';

//       const { adminRoute, organizerRoute, adminOnlyParams = [] } = args.roleBasedRouting;

//       // Select appropriate route based on user role
//       if (isSuperAdmin && adminRoute) {
//         args.url = adminRoute;
//       } else if (organizerRoute) {
//         args.url = organizerRoute;
//       }

//       // Filter params for non-admin users
//       if (!isSuperAdmin && args.params && adminOnlyParams.length > 0) {
//         const filteredParams = { ...args.params };
//         adminOnlyParams.forEach((param: string) => {
//           delete filteredParams[param];
//         });
//         args.params = filteredParams;
//       }

//       // Check admin-only endpoints
//       if (args.roleBasedRouting.adminOnly && !isSuperAdmin) {
//         throw new Error('Unauthorized: Only administrators can access this endpoint');
//       }

//       // Remove the roleBasedRouting object before making the request
//       delete args.roleBasedRouting;
//     }

//     const result = await baseQuery(args, api, extraOptions);

//     if (result.error) {
//       const message = handleApiError(result.error);
//       console.log(message);

//       const { status } = result.error;

//       // Handle unauthorized access (token expired / invalid)
//       if (status === 401) {
//         const isBrowser = typeof window !== 'undefined';
//         const isOnLoginPage = isBrowser && (window.location.pathname === '/admin/login' || window.location.pathname === '/');

//         if (!isOnLoginPage) {
//           api.dispatch(logout());
//           api.dispatch(resetStore());

//           if (isBrowser) {
//             window.location.replace('/');
//           }
//         }
//       }
//     }

//     return result;
//   };
// };
