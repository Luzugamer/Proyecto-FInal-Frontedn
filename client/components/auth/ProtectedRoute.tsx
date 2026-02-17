import React from "react";
import { Navigate } from "react-router-dom";
import { mockAuthService } from "@/lib/mockAuthService";
import { Role } from "@/lib/mockAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  permission?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  permission,
}: ProtectedRouteProps) {
  const session = mockAuthService.getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(session.user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (permission && !mockAuthService.hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
