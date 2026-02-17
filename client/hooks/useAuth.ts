import { useState, useEffect } from "react";
import { mockAuthService, Session } from "@/lib/mockAuthService";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(
    mockAuthService.getSession(),
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Escuchar cambios en el localStorage por si se abre en otra pestaña
    const handleStorageChange = () => {
      setSession(mockAuthService.getSession());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const newSession = await mockAuthService.login(email, password);
      setSession(newSession);
      return newSession;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await mockAuthService.logout();
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: string) => {
    return mockAuthService.hasPermission(permission);
  };

  const canAccessFacultad = (facultadId: string) => {
    return mockAuthService.canAccessFacultad(facultadId);
  };

  return {
    session,
    user: session?.user,
    isAuthenticated: !!session,
    isLoading,
    login,
    logout,
    hasPermission,
    canAccessFacultad,
  };
}
