"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slice/userSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for persisted user data on app initialization
    const initializeAuth = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          dispatch(setUser(user));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        // Clear corrupted data
        localStorage.removeItem("user");
      }
    };

    initializeAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
