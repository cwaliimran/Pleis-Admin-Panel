"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { clearUser, setUser } from "@/store/slice/userSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.userSlice.user);

  const logout = () => {
    dispatch(clearUser());
    router.push("/");
  };

  const login = (userData: {
    id: string;
    name: string;
    email: string;
    role: string;
    image: string;
  }) => {
    dispatch(setUser(userData));
  };

  const isAuthenticated = !!user;
  const isOrganizer = user?.role === "organizer";
  const isSuperAdmin = user?.role === "superAdmin";

  const canAccess = (allowedRoles: string[]) => {
    return user && allowedRoles.includes(user.role);
  };

  const getDashboardRoute = () => {
    if (user?.role === "superAdmin") {
      return "/super-admin";
    } else if (user?.role === "organizer") {
      return "/organizer/dashboard";
    }
    return "/";
  };

  return {
    user,
    isAuthenticated,
    isOrganizer,
    isSuperAdmin,
    login,
    logout,
    canAccess,
    getDashboardRoute,
  };
};
