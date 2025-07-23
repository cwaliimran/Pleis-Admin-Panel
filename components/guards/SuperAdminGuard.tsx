"use client";

import RouteGuard from "./RouteGuard";

interface SuperAdminGuardProps {
  children: React.ReactNode;
}

export default function SuperAdminGuard({ children }: SuperAdminGuardProps) {
  return <RouteGuard allowedRoles={["superAdmin"]}>{children}</RouteGuard>;
}
