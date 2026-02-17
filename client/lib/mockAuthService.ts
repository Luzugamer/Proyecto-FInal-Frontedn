import { mockUsers, mockRoles, Role } from "./mockAuth";

export interface Session {
  user: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    rol: Role;
    facultad: { id: string; nombre: string; codigo: string } | null;
    avatar: string | null;
  };
  token: string;
  expiresAt: number;
}

export const mockAuthService = {
  // Simular login
  login: async (email: string, password: string): Promise<Session> => {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = mockUsers.find(
      (u) =>
        u.email === email && u.password === password && u.estado === "activo",
    );

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    // Crear sesión simulada
    const session: Session = {
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
        facultad: user.facultad,
        avatar: user.avatar,
      },
      token: `mock-token-${user.id}-${Date.now()}`,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 horas
    };

    // Guardar en localStorage
    localStorage.setItem("siged_session", JSON.stringify(session));

    return session;
  },

  // Simular logout
  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    localStorage.removeItem("siged_session");
  },

  // Obtener sesión actual
  getSession: (): Session | null => {
    const sessionData = localStorage.getItem("siged_session");
    if (!sessionData) return null;

    try {
      const session = JSON.parse(sessionData) as Session;

      // Verificar si expiró
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem("siged_session");
        return null;
      }

      return session;
    } catch (e) {
      localStorage.removeItem("siged_session");
      return null;
    }
  },

  // Verificar permisos
  hasPermission: (permission: string) => {
    const session = mockAuthService.getSession();
    if (!session) return false;

    const userRole = mockRoles[session.user.rol];
    if (!userRole) return false;

    // Super admin tiene todos los permisos
    if (userRole.permisos.includes("*")) return true;

    // Verificar permiso específico o wildcard
    return userRole.permisos.some((p) => {
      if (p === permission) return true;
      if (p.endsWith(".*")) {
        const prefix = p.slice(0, -2);
        return permission.startsWith(prefix);
      }
      return false;
    });
  },

  // Verificar si puede acceder a datos de una facultad
  canAccessFacultad: (facultadId: string) => {
    const session = mockAuthService.getSession();
    if (!session) return false;

    const rol = session.user.rol;

    // Super admin y admin pueden acceder a todo
    if (rol === "SUPER_ADMIN" || rol === "ADMINISTRADOR") return true;

    // Comité puede ver todo pero no editar
    if (rol === "COMITE_ORGANIZADOR") return true;

    // Delegado solo puede acceder a su facultad
    if (rol === "DELEGADO_DEPORTES") {
      return session.user.facultad?.id === facultadId;
    }

    return false;
  },
};
