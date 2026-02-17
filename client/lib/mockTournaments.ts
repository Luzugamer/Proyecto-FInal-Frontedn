export type TournamentState =
  | "inscripciones"
  | "en_curso"
  | "finalizado"
  | "cancelado";
export type TournamentType = "olimpiada" | "copa" | "campeonato" | "amistoso";
export type TournamentCategory = "interfacultades" | "cachimbos" | "especial";
export type CompetitionSystem =
  | "todos_vs_todos"
  | "grupos"
  | "eliminacion"
  | "mixto";

export interface Tournament {
  id: string;
  nombre: string;
  slug: string;
  tipo: TournamentType;
  categoria: TournamentCategory;
  estado: TournamentState;
  descripcion: string;
  imagen: string;

  // Fechas
  fechaInscripcionInicio: string;
  fechaInscripcionFin: string;
  fechaCompetenciaInicio: string;
  fechaCompetenciaFin: string;

  // Configuración
  disciplinas: string[];
  maxEquiposPorDisciplina: number;
  sistemaCompetencia: CompetitionSystem;
  equiposPorGrupo: number;
  clasificanPorGrupo: number;

  // Gestión
  comiteAsignado?: string;
  creador?: string;

  // Opciones
  permitirInscripcionGratuita: boolean;
  generarFixtureAuto: boolean;
  publicarEnPortal: boolean;

  // Estadísticas
  totalEquipos: number;
  totalPartidos: number;
  partidosJugados: number;
  totalGoles: number;
  asistencia: number;

  // Metadata
  fechaCreacion: string;
  ultimaModificacion: string;
}

export const mockTournaments: Tournament[] = [
  {
    id: "torneo-1",
    nombre: "Interfacultades 2026",
    slug: "interfacultades-2026",
    tipo: "olimpiada",
    categoria: "interfacultades",
    estado: "en_curso",
    descripcion:
      "La olimpiada deportiva más importante de la UNAS. Todas las facultades compitiendo por la gloria deportiva en 4 disciplinas diferentes.",
    imagen:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=675&fit=crop",

    fechaInscripcionInicio: "2026-01-15T00:00:00",
    fechaInscripcionFin: "2026-02-28T23:59:59",
    fechaCompetenciaInicio: "2026-03-01T00:00:00",
    fechaCompetenciaFin: "2026-04-30T23:59:59",

    disciplinas: [
      "Fútbol Masculino",
      "Fútbol Femenino",
      "Básquet Masculino",
      "Básquet Femenino",
    ],
    maxEquiposPorDisciplina: 20,
    sistemaCompetencia: "grupos",
    equiposPorGrupo: 4,
    clasificanPorGrupo: 2,

    comiteAsignado: "Comité A - Deportes",
    creador: "admin@siged.unas",

    permitirInscripcionGratuita: true,
    generarFixtureAuto: true,
    publicarEnPortal: true,

    totalEquipos: 42,
    totalPartidos: 5,
    partidosJugados: 3,
    totalGoles: 9,
    asistencia: 5000,

    fechaCreacion: "2026-01-10T10:00:00",
    ultimaModificacion: "2026-02-07T14:30:00",
  },
  {
    id: "torneo-2",
    nombre: "Cachimbos 2026",
    slug: "cachimbos-2026",
    tipo: "olimpiada",
    categoria: "cachimbos",
    estado: "inscripciones",
    descripcion:
      "Competencia para los estudiantes de primer año. Futsal, Fútbol, Voley y Básquet para que demuestren su talento deportivo.",
    imagen:
      "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=1200&h=675&fit=crop",

    fechaInscripcionInicio: "2026-02-10T00:00:00",
    fechaInscripcionFin: "2026-03-15T23:59:59",
    fechaCompetenciaInicio: "2026-03-20T00:00:00",
    fechaCompetenciaFin: "2026-05-15T23:59:59",

    disciplinas: [
      "Futsal Masculino",
      "Futsal Femenino",
      "Voley Masculino",
      "Voley Femenino",
    ],
    maxEquiposPorDisciplina: 18,
    sistemaCompetencia: "grupos",
    equiposPorGrupo: 4,
    clasificanPorGrupo: 2,

    comiteAsignado: "Comité B - Cachimbos",
    creador: "admin@siged.unas",

    permitirInscripcionGratuita: true,
    generarFixtureAuto: false,
    publicarEnPortal: true,

    totalEquipos: 28,
    totalPartidos: 0,
    partidosJugados: 0,
    totalGoles: 0,
    asistencia: 0,

    fechaCreacion: "2026-01-20T10:00:00",
    ultimaModificacion: "2026-02-07T14:30:00",
  },
  {
    id: "torneo-3",
    nombre: "Torneo Especial Futsal 2026",
    slug: "torneo-especial-futsal-2026",
    tipo: "campeonato",
    categoria: "especial",
    estado: "finalizado",
    descripcion:
      "Torneo especial de Futsal que reunió a los mejores jugadores de todas las facultades.",
    imagen:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=675&fit=crop",

    fechaInscripcionInicio: "2025-11-01T00:00:00",
    fechaInscripcionFin: "2025-12-15T23:59:59",
    fechaCompetenciaInicio: "2026-01-10T00:00:00",
    fechaCompetenciaFin: "2026-01-31T23:59:59",

    disciplinas: ["Futsal Masculino", "Futsal Femenino"],
    maxEquiposPorDisciplina: 16,
    sistemaCompetencia: "eliminacion",
    equiposPorGrupo: 0,
    clasificanPorGrupo: 0,

    comiteAsignado: "Comité A - Deportes",
    creador: "admin@siged.unas",

    permitirInscripcionGratuita: true,
    generarFixtureAuto: true,
    publicarEnPortal: true,

    totalEquipos: 32,
    totalPartidos: 28,
    partidosJugados: 28,
    totalGoles: 87,
    asistencia: 3200,

    fechaCreacion: "2025-10-15T10:00:00",
    ultimaModificacion: "2026-02-01T14:30:00",
  },
];

export const getTournamentStateLabel = (estado: TournamentState): string => {
  const labels: Record<TournamentState, string> = {
    inscripciones: "Inscripciones",
    en_curso: "En Curso",
    finalizado: "Finalizado",
    cancelado: "Cancelado",
  };
  return labels[estado];
};

export const getTournamentStateColor = (estado: TournamentState): string => {
  const colors: Record<TournamentState, string> = {
    inscripciones: "bg-blue-100 text-blue-700 border-blue-200",
    en_curso: "bg-green-100 text-green-700 border-green-200",
    finalizado: "bg-gray-100 text-gray-700 border-gray-200",
    cancelado: "bg-red-100 text-red-700 border-red-200",
  };
  return colors[estado];
};

export const getTournamentTypeEmoji = (tipo: TournamentType): string => {
  const emojis: Record<TournamentType, string> = {
    olimpiada: "🏆",
    copa: "🏅",
    campeonato: "⚽",
    amistoso: "🤝",
  };
  return emojis[tipo];
};

export const getMockTeamsForTournament = (tournamentId: string) => {
  const baseTeams = [
    {
      id: "1",
      nombre: "Agronomía",
      facultad: "Agronomía",
      logo: "🌾",
      puntos: 45,
      posicion: 1,
    },
    {
      id: "2",
      nombre: "Ingeniería",
      facultad: "Ingeniería",
      logo: "⚙️",
      puntos: 38,
      posicion: 2,
    },
    {
      id: "3",
      nombre: "Zootecnia",
      facultad: "Zootecnia",
      logo: "🐄",
      puntos: 35,
      posicion: 3,
    },
    {
      id: "4",
      nombre: "Economía",
      facultad: "Economía",
      logo: "📊",
      puntos: 28,
      posicion: 4,
    },
    {
      id: "5",
      nombre: "Enfermería",
      facultad: "Enfermería",
      logo: "⚕️",
      puntos: 25,
      posicion: 5,
    },
    {
      id: "6",
      nombre: "Forestales",
      facultad: "Ciencias Forestales",
      logo: "🌲",
      puntos: 22,
      posicion: 6,
    },
  ];
  return baseTeams;
};

export const getMockMatchesForTournament = (tournamentId: string) => {
  return [
    {
      id: "1",
      homeTeam: "Agronomía",
      awayTeam: "Zootecnia",
      homeScore: 3,
      awayScore: 2,
      state: "finished",
      date: "2026-02-05T15:00:00",
      sport: "Fútbol Masculino",
      location: "Estadio UNAS",
    },
    {
      id: "2",
      homeTeam: "Ingeniería",
      awayTeam: "Economía",
      homeScore: 2,
      awayScore: 1,
      state: "finished",
      date: "2026-02-05T17:00:00",
      sport: "Fútbol Masculino",
      location: "Cancha Sintética",
    },
    {
      id: "3",
      homeTeam: "Enfermería",
      awayTeam: "Forestales",
      homeScore: null,
      awayScore: null,
      state: "live",
      date: "2026-02-10T15:00:00",
      sport: "Básquet Femenino",
      location: "Coliseo Cerrado",
    },
    {
      id: "4",
      homeTeam: "Agronomía",
      awayTeam: "Ingeniería",
      homeScore: null,
      awayScore: null,
      state: "upcoming",
      date: "2026-02-12T17:00:00",
      sport: "Fútbol Masculino",
      location: "Estadio UNAS",
    },
    {
      id: "5",
      homeTeam: "Zootecnia",
      awayTeam: "Forestales",
      homeScore: null,
      awayScore: null,
      state: "upcoming",
      date: "2026-02-15T16:00:00",
      sport: "Básquet Masculino",
      location: "Cancha 1",
    },
  ];
};
