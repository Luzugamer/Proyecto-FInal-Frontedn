export const mockUsers = [
  // SUPER ADMINISTRADOR
  {
    id: "1",
    nombre: "Carlos Super",
    apellido: "Administrador",
    email: "super@siged.test",
    password: "Super123!", // En producción esto debe ser hasheado
    rol: "SUPER_ADMIN" as const,
    estado: "activo",
    telefono: "+51 999 888 777",
    facultad: null,
    avatar: null,
    fechaCreacion: "2024-01-15",
    ultimoAcceso: "2026-02-07T10:30:00",
  },

  // ADMINISTRADOR
  {
    id: "2",
    nombre: "Ana María",
    apellido: "Rodríguez",
    email: "admin@siged.test",
    password: "Admin123!",
    rol: "ADMINISTRADOR" as const,
    estado: "activo",
    telefono: "+51 999 777 666",
    facultad: null,
    avatar: null,
    fechaCreacion: "2024-02-01",
    ultimoAcceso: "2026-02-07T09:15:00",
  },

  // COMITÉ ORGANIZADOR
  {
    id: "3",
    nombre: "Pedro",
    apellido: "Martínez",
    email: "comite@siged.test",
    password: "Comite123!",
    rol: "COMITE_ORGANIZADOR" as const,
    estado: "activo",
    telefono: "+51 999 666 555",
    facultad: null,
    avatar: null,
    fechaCreacion: "2024-03-10",
    ultimoAcceso: "2026-02-07T08:45:00",
  },

  // DELEGADOS DE DEPORTES (uno por cada facultad)
  {
    id: "4",
    nombre: "Luis",
    apellido: "Fernández",
    email: "delegado.agronomia@siged.test",
    password: "Delegado123!",
    rol: "DELEGADO_DEPORTES" as const,
    estado: "activo",
    telefono: "+51 999 555 444",
    facultad: {
      id: "fac-1",
      nombre: "Agronomía",
      codigo: "AGR",
    },
    avatar: null,
    fechaCreacion: "2024-04-05",
    ultimoAcceso: "2026-02-06T16:20:00",
  },
  {
    id: "5",
    nombre: "María",
    apellido: "González",
    email: "delegado.ingenieria@siged.test",
    password: "Delegado123!",
    rol: "DELEGADO_DEPORTES" as const,
    estado: "activo",
    telefono: "+51 999 444 333",
    facultad: {
      id: "fac-2",
      nombre: "Ingeniería",
      codigo: "ING",
    },
    avatar: null,
    fechaCreacion: "2024-04-05",
    ultimoAcceso: "2026-02-07T07:30:00",
  },
  {
    id: "6",
    nombre: "Jorge",
    apellido: "Ramírez",
    email: "delegado.zootecnia@siged.test",
    password: "Delegado123!",
    rol: "DELEGADO_DEPORTES" as const,
    estado: "activo",
    telefono: "+51 999 333 222",
    facultad: {
      id: "fac-3",
      nombre: "Zootecnia",
      codigo: "ZOO",
    },
    avatar: null,
    fechaCreacion: "2024-04-05",
    ultimoAcceso: "2026-02-06T18:00:00",
  },
  {
    id: "7",
    nombre: "Carmen",
    apellido: "Torres",
    email: "delegado.economia@siged.test",
    password: "Delegado123!",
    rol: "DELEGADO_DEPORTES" as const,
    estado: "activo",
    telefono: "+51 999 222 111",
    facultad: {
      id: "fac-4",
      nombre: "Economía",
      codigo: "ECO",
    },
    avatar: null,
    fechaCreacion: "2024-04-05",
    ultimoAcceso: "2026-02-07T11:00:00",
  },
  {
    id: "8",
    nombre: "Roberto",
    apellido: "Silva",
    email: "delegado.forestales@siged.test",
    password: "Delegado123!",
    rol: "DELEGADO_DEPORTES" as const,
    estado: "activo",
    telefono: "+51 999 111 000",
    facultad: {
      id: "fac-5",
      nombre: "Ciencias Forestales",
      codigo: "FOR",
    },
    avatar: null,
    fechaCreacion: "2024-04-05",
    ultimoAcceso: "2026-02-06T14:30:00",
  },
];

export type Role =
  | "SUPER_ADMIN"
  | "ADMINISTRADOR"
  | "COMITE_ORGANIZADOR"
  | "DELEGADO_DEPORTES";

export interface RoleInfo {
  nombre: string;
  permisos: string[];
  descripcion: string;
  restriccion?: string;
}

export const mockRoles: Record<Role, RoleInfo> = {
  SUPER_ADMIN: {
    nombre: "Super Administrador",
    permisos: ["*"], // Todos los permisos
    descripcion: "Control total del sistema",
  },
  ADMINISTRADOR: {
    nombre: "Administrador",
    permisos: [
      "usuarios.crear",
      "usuarios.editar",
      "usuarios.eliminar",
      "usuarios.ver",
      "institucional.*",
      "disciplinas.*",
      "torneos.*",
      "escenarios.*",
      "fixture.*",
      "justicia.*",
      "reportes.*",
      "analitica.*",
    ],
    descripcion: "Gestión completa excepto Super Administradores",
  },
  COMITE_ORGANIZADOR: {
    nombre: "Comité Organizador",
    permisos: [
      "equipos.ver",
      "jugadores.buscar",
      "partidos.ejecutar",
      "partidos.acta",
      "resultados.ver",
      "reclamos.ver",
      "portal.gestionar",
      "reportes.ver",
    ],
    descripcion: "Ejecución de partidos y gestión del portal público",
  },
  DELEGADO_DEPORTES: {
    nombre: "Delegado de Deportes",
    permisos: [
      "equipos.crear.facultad",
      "equipos.editar.facultad",
      "jugadores.crear.facultad",
      "jugadores.editar.facultad",
      "alineacion.registrar.facultad",
      "reclamos.crear.facultad",
      "actas.firmar.facultad",
      "fixture.ver",
      "posiciones.ver",
      "estadisticas.ver",
    ],
    descripcion: "Gestión de equipos y jugadores de su facultad",
    restriccion: "SOLO_FACULTAD_ASIGNADA",
  },
};
