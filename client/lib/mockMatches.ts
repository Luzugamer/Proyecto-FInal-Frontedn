/**
 * mockMatches.ts
 *
 * IMPORTANTE: el campo `sport` debe coincidir EXACTAMENTE con el nombre
 * de disciplina definido en mockTournaments.ts para cada torneo.
 *
 * Interfacultades 2026  → "Fútbol Masculino" | "Fútbol Femenino" | "Básquet Masculino" | "Básquet Femenino"
 * Cachimbos 2026        → "Futsal Masculino"  | "Futsal Femenino" | "Voley Masculino"   | "Voley Femenino"
 * Torneo Especial Futsal 2026 → "Futsal Masculino" | "Futsal Femenino"
 */

export interface Match {
  id: number;
  date: string;
  time: string;
  home: string;
  away: string;
  homeScore?: number;
  awayScore?: number;
  sport: string;
  tournament: string;
  tournamentSlug: string;
  court: string;
  status: "live" | "today" | "upcoming" | "finished";
  events?: {
    type: "goal" | "yellow" | "red";
    team: string;
    player: string;
    minute: string;
  }[];
  stats?: {
    home: { possession: number; shots: number; shotsOnTarget: number; fouls: number; corners: number };
    away: { possession: number; shots: number; shotsOnTarget: number; fouls: number; corners: number };
  };
}

export const mockMatches: Match[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // INTERFACULTADES 2026 — slug: "interfacultades-2026" — estado: en_curso
  // disciplinas: Fútbol Masculino | Fútbol Femenino | Básquet Masculino | Básquet Femenino
  // ══════════════════════════════════════════════════════════════════════════

  // ─── Fútbol Masculino ─────────────────────────────────────────────────────
  {
    id: 1,
    date: "2026-02-07",
    time: "10:00",
    home: "Agronomía",
    away: "Zootecnia",
    homeScore: 3,
    awayScore: 1,
    sport: "Fútbol Masculino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Estadio UNAS",
    status: "live",
    events: [
      { type: "goal",   team: "Agronomía", player: "Carlos López",  minute: "15'" },
      { type: "goal",   team: "Zootecnia", player: "Mario García",  minute: "32'" },
      { type: "yellow", team: "Zootecnia", player: "Pedro Torres",  minute: "45'" },
      { type: "goal",   team: "Agronomía", player: "Fernando Soto", minute: "67'" },
      { type: "goal",   team: "Agronomía", player: "Luis Ramírez",  minute: "78'" },
    ],
    stats: {
      home: { possession: 58, shots: 12, shotsOnTarget: 6, fouls: 8,  corners: 5 },
      away: { possession: 42, shots: 8,  shotsOnTarget: 3, fouls: 12, corners: 3 },
    },
  },
  {
    id: 2,
    date: "2026-02-05",
    time: "14:00",
    home: "Ingeniería",
    away: "Economía",
    homeScore: 2,
    awayScore: 0,
    sport: "Fútbol Masculino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Cancha Sintética",
    status: "finished",
    events: [
      { type: "goal", team: "Ingeniería", player: "Miguel Ríos",  minute: "23'" },
      { type: "goal", team: "Ingeniería", player: "Jesús Castro", minute: "55'" },
      { type: "red",  team: "Economía",   player: "Omar Vega",    minute: "70'" },
    ],
    stats: {
      home: { possession: 62, shots: 14, shotsOnTarget: 7, fouls: 6,  corners: 6 },
      away: { possession: 38, shots: 5,  shotsOnTarget: 1, fouls: 14, corners: 2 },
    },
  },
  {
    id: 3,
    date: "2026-02-10",
    time: "10:00",
    home: "Agronomía",
    away: "Ingeniería",
    sport: "Fútbol Masculino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Estadio UNAS",
    status: "today",
  },
  {
    id: 4,
    date: "2026-03-03",
    time: "10:00",
    home: "Zootecnia",
    away: "Economía",
    sport: "Fútbol Masculino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Estadio UNAS",
    status: "upcoming",
  },
  {
    id: 5,
    date: "2026-03-06",
    time: "14:00",
    home: "Medicina",
    away: "Derecho",
    sport: "Fútbol Masculino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Cancha Sintética",
    status: "upcoming",
  },
  {
    id: 6,
    date: "2026-03-10",
    time: "16:00",
    home: "Forestales",
    away: "Sistemas",
    sport: "Fútbol Masculino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Estadio UNAS",
    status: "upcoming",
  },

  // ─── Fútbol Femenino ──────────────────────────────────────────────────────
  {
    id: 7,
    date: "2026-02-06",
    time: "09:00",
    home: "Enfermería",
    away: "Educación",
    homeScore: 2,
    awayScore: 2,
    sport: "Fútbol Femenino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Estadio UNAS",
    status: "finished",
    events: [
      { type: "goal", team: "Enfermería", player: "Ana Pérez",    minute: "20'" },
      { type: "goal", team: "Educación",  player: "Rosa Díaz",    minute: "35'" },
      { type: "goal", team: "Enfermería", player: "Lucía Torres", minute: "60'" },
      { type: "goal", team: "Educación",  player: "Carmen Cruz",  minute: "88'" },
    ],
    stats: {
      home: { possession: 50, shots: 9, shotsOnTarget: 4, fouls: 7, corners: 3 },
      away: { possession: 50, shots: 8, shotsOnTarget: 4, fouls: 6, corners: 4 },
    },
  },
  {
    id: 8,
    date: "2026-02-10",
    time: "11:00",
    home: "Medicina",
    away: "Zootecnia",
    sport: "Fútbol Femenino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Estadio UNAS",
    status: "today",
  },
  {
    id: 9,
    date: "2026-03-04",
    time: "09:00",
    home: "Agronomía",
    away: "Derecho",
    sport: "Fútbol Femenino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Cancha Sintética",
    status: "upcoming",
  },
  {
    id: 10,
    date: "2026-03-07",
    time: "11:00",
    home: "Ingeniería",
    away: "Forestales",
    sport: "Fútbol Femenino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Estadio UNAS",
    status: "upcoming",
  },

  // ─── Básquet Masculino ────────────────────────────────────────────────────
  {
    id: 11,
    date: "2026-02-04",
    time: "15:00",
    home: "Sistemas",
    away: "Derecho",
    homeScore: 78,
    awayScore: 65,
    sport: "Básquet Masculino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Coliseo Cerrado",
    status: "finished",
    stats: {
      home: { possession: 52, shots: 42, shotsOnTarget: 28, fouls: 18, corners: 0 },
      away: { possession: 48, shots: 38, shotsOnTarget: 22, fouls: 22, corners: 0 },
    },
  },
  {
    id: 12,
    date: "2026-02-04",
    time: "17:00",
    home: "Ingeniería",
    away: "Medicina",
    homeScore: 54,
    awayScore: 61,
    sport: "Básquet Masculino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Coliseo Cerrado",
    status: "finished",
    stats: {
      home: { possession: 48, shots: 35, shotsOnTarget: 20, fouls: 25, corners: 0 },
      away: { possession: 52, shots: 40, shotsOnTarget: 26, fouls: 20, corners: 0 },
    },
  },
  {
    id: 13,
    date: "2026-02-07",
    time: "11:00",
    home: "Agronomía",
    away: "Economía",
    sport: "Básquet Masculino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Coliseo Cerrado",
    status: "live",
    stats: {
      home: { possession: 50, shots: 16, shotsOnTarget: 12, fouls: 5, corners: 0 },
      away: { possession: 50, shots: 14, shotsOnTarget: 10, fouls: 4, corners: 0 },
    },
  },
  {
    id: 14,
    date: "2026-03-02",
    time: "15:00",
    home: "Sistemas",
    away: "Medicina",
    sport: "Básquet Masculino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Coliseo Cerrado",
    status: "upcoming",
  },
  {
    id: 15,
    date: "2026-03-05",
    time: "17:00",
    home: "Derecho",
    away: "Agronomía",
    sport: "Básquet Masculino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Coliseo Cerrado",
    status: "upcoming",
  },

  // ─── Básquet Femenino ─────────────────────────────────────────────────────
  {
    id: 16,
    date: "2026-02-03",
    time: "14:00",
    home: "Enfermería",
    away: "Forestales",
    homeScore: 48,
    awayScore: 35,
    sport: "Básquet Femenino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Coliseo Cerrado",
    status: "finished",
    stats: {
      home: { possession: 55, shots: 30, shotsOnTarget: 20, fouls: 14, corners: 0 },
      away: { possession: 45, shots: 22, shotsOnTarget: 14, fouls: 18, corners: 0 },
    },
  },
  {
    id: 17,
    date: "2026-02-10",
    time: "14:00",
    home: "Educación",
    away: "Zootecnia",
    sport: "Básquet Femenino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Coliseo Cerrado",
    status: "today",
  },
  {
    id: 18,
    date: "2026-03-03",
    time: "16:00",
    home: "Agronomía",
    away: "Medicina",
    sport: "Básquet Femenino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Coliseo Cerrado",
    status: "upcoming",
  },
  {
    id: 19,
    date: "2026-03-07",
    time: "14:00",
    home: "Derecho",
    away: "Enfermería",
    sport: "Básquet Femenino",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Coliseo Cerrado",
    status: "upcoming",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CACHIMBOS 2026 — slug: "cachimbos-2026" — estado: inscripciones
  // disciplinas: Futsal Masculino | Futsal Femenino | Voley Masculino | Voley Femenino
  // ══════════════════════════════════════════════════════════════════════════

  // ─── Futsal Masculino ─────────────────────────────────────────────────────
  {
    id: 20,
    date: "2026-03-22",
    time: "09:00",
    home: "Agronomía",
    away: "Ingeniería",
    sport: "Futsal Masculino",
    tournament: "Cachimbos 2026",
    tournamentSlug: "cachimbos-2026",
    court: "Cancha Techada",
    status: "upcoming",
  },
  {
    id: 21,
    date: "2026-03-22",
    time: "11:00",
    home: "Medicina",
    away: "Derecho",
    sport: "Futsal Masculino",
    tournament: "Cachimbos 2026",
    tournamentSlug: "cachimbos-2026",
    court: "Cancha Techada",
    status: "upcoming",
  },
  {
    id: 22,
    date: "2026-03-24",
    time: "10:00",
    home: "Zootecnia",
    away: "Economía",
    sport: "Futsal Masculino",
    tournament: "Cachimbos 2026",
    tournamentSlug: "cachimbos-2026",
    court: "Cancha Techada",
    status: "upcoming",
  },
  {
    id: 23,
    date: "2026-03-26",
    time: "10:00",
    home: "Forestales",
    away: "Sistemas",
    sport: "Futsal Masculino",
    tournament: "Cachimbos 2026",
    tournamentSlug: "cachimbos-2026",
    court: "Cancha Techada",
    status: "upcoming",
  },

  // ─── Futsal Femenino ──────────────────────────────────────────────────────
  {
    id: 24,
    date: "2026-03-23",
    time: "09:00",
    home: "Enfermería",
    away: "Educación",
    sport: "Futsal Femenino",
    tournament: "Cachimbos 2026",
    tournamentSlug: "cachimbos-2026",
    court: "Cancha Techada",
    status: "upcoming",
  },
  {
    id: 25,
    date: "2026-03-25",
    time: "09:00",
    home: "Medicina",
    away: "Forestales",
    sport: "Futsal Femenino",
    tournament: "Cachimbos 2026",
    tournamentSlug: "cachimbos-2026",
    court: "Cancha Techada",
    status: "upcoming",
  },
  {
    id: 26,
    date: "2026-03-27",
    time: "09:00",
    home: "Agronomía",
    away: "Zootecnia",
    sport: "Futsal Femenino",
    tournament: "Cachimbos 2026",
    tournamentSlug: "cachimbos-2026",
    court: "Cancha Techada",
    status: "upcoming",
  },

  // ─── Voley Masculino ──────────────────────────────────────────────────────
  {
    id: 27,
    date: "2026-03-22",
    time: "14:00",
    home: "Agronomía",
    away: "Forestales",
    sport: "Voley Masculino",
    tournament: "Cachimbos 2026",
    tournamentSlug: "cachimbos-2026",
    court: "Coliseo Cerrado",
    status: "upcoming",
  },
  {
    id: 28,
    date: "2026-03-24",
    time: "14:00",
    home: "Ingeniería",
    away: "Economía",
    sport: "Voley Masculino",
    tournament: "Cachimbos 2026",
    tournamentSlug: "cachimbos-2026",
    court: "Coliseo Cerrado",
    status: "upcoming",
  },
  {
    id: 29,
    date: "2026-03-26",
    time: "14:00",
    home: "Medicina",
    away: "Sistemas",
    sport: "Voley Masculino",
    tournament: "Cachimbos 2026",
    tournamentSlug: "cachimbos-2026",
    court: "Coliseo Cerrado",
    status: "upcoming",
  },

  // ─── Voley Femenino ───────────────────────────────────────────────────────
  {
    id: 30,
    date: "2026-03-23",
    time: "14:00",
    home: "Medicina",
    away: "Zootecnia",
    sport: "Voley Femenino",
    tournament: "Cachimbos 2026",
    tournamentSlug: "cachimbos-2026",
    court: "Coliseo Cerrado",
    status: "upcoming",
  },
  {
    id: 31,
    date: "2026-03-25",
    time: "14:00",
    home: "Derecho",
    away: "Educación",
    sport: "Voley Femenino",
    tournament: "Cachimbos 2026",
    tournamentSlug: "cachimbos-2026",
    court: "Coliseo Cerrado",
    status: "upcoming",
  },
  {
    id: 32,
    date: "2026-03-27",
    time: "14:00",
    home: "Enfermería",
    away: "Ingeniería",
    sport: "Voley Femenino",
    tournament: "Cachimbos 2026",
    tournamentSlug: "cachimbos-2026",
    court: "Coliseo Cerrado",
    status: "upcoming",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TORNEO ESPECIAL FUTSAL 2026 — slug: "torneo-especial-futsal-2026" — estado: finalizado
  // disciplinas: Futsal Masculino | Futsal Femenino
  // ══════════════════════════════════════════════════════════════════════════

  // ─── Futsal Masculino ─────────────────────────────────────────────────────
  {
    id: 33,
    date: "2026-01-12",
    time: "10:00",
    home: "Agronomía",
    away: "Zootecnia",
    homeScore: 3,
    awayScore: 2,
    sport: "Futsal Masculino",
    tournament: "Torneo Especial Futsal 2026",
    tournamentSlug: "torneo-especial-futsal-2026",
    court: "Cancha Techada",
    status: "finished",
    events: [
      { type: "goal", team: "Agronomía", player: "Carlos López",  minute: "5'"  },
      { type: "goal", team: "Zootecnia", player: "Mario García",  minute: "12'" },
      { type: "goal", team: "Agronomía", player: "Luis Ramírez",  minute: "18'" },
      { type: "goal", team: "Zootecnia", player: "Pedro Torres",  minute: "25'" },
      { type: "goal", team: "Agronomía", player: "Fernando Soto", minute: "38'" },
    ],
    stats: {
      home: { possession: 55, shots: 18, shotsOnTarget: 9, fouls: 10, corners: 0 },
      away: { possession: 45, shots: 14, shotsOnTarget: 7, fouls: 12, corners: 0 },
    },
  },
  {
    id: 34,
    date: "2026-01-14",
    time: "10:00",
    home: "Ingeniería",
    away: "Medicina",
    homeScore: 1,
    awayScore: 4,
    sport: "Futsal Masculino",
    tournament: "Torneo Especial Futsal 2026",
    tournamentSlug: "torneo-especial-futsal-2026",
    court: "Cancha Techada",
    status: "finished",
    events: [
      { type: "goal", team: "Medicina",   player: "Juan Pérez",  minute: "8'"  },
      { type: "goal", team: "Ingeniería", player: "Miguel Ríos", minute: "15'" },
      { type: "goal", team: "Medicina",   player: "Juan Pérez",  minute: "22'" },
      { type: "goal", team: "Medicina",   player: "Omar Soto",   minute: "30'" },
      { type: "goal", team: "Medicina",   player: "Juan Pérez",  minute: "37'" },
    ],
    stats: {
      home: { possession: 42, shots: 12, shotsOnTarget: 5,  fouls: 14, corners: 0 },
      away: { possession: 58, shots: 20, shotsOnTarget: 12, fouls: 9,  corners: 0 },
    },
  },
  {
    id: 35,
    date: "2026-01-20",
    time: "10:00",
    home: "Agronomía",
    away: "Medicina",
    homeScore: 2,
    awayScore: 2,
    sport: "Futsal Masculino",
    tournament: "Torneo Especial Futsal 2026",
    tournamentSlug: "torneo-especial-futsal-2026",
    court: "Cancha Techada",
    status: "finished",
    events: [
      { type: "goal", team: "Agronomía", player: "Carlos López", minute: "10'" },
      { type: "goal", team: "Medicina",  player: "Omar Soto",    minute: "18'" },
      { type: "goal", team: "Agronomía", player: "Luis Ramírez", minute: "28'" },
      { type: "goal", team: "Medicina",  player: "Juan Pérez",   minute: "39'" },
    ],
    stats: {
      home: { possession: 50, shots: 16, shotsOnTarget: 8, fouls: 11, corners: 0 },
      away: { possession: 50, shots: 15, shotsOnTarget: 8, fouls: 10, corners: 0 },
    },
  },
  {
    id: 36,
    date: "2026-01-28",
    time: "15:00",
    home: "Agronomía",
    away: "Derecho",
    homeScore: 4,
    awayScore: 1,
    sport: "Futsal Masculino",
    tournament: "Torneo Especial Futsal 2026",
    tournamentSlug: "torneo-especial-futsal-2026",
    court: "Cancha Techada",
    status: "finished",
    events: [
      { type: "goal", team: "Agronomía", player: "Fernando Soto", minute: "3'"  },
      { type: "goal", team: "Agronomía", player: "Carlos López",  minute: "14'" },
      { type: "goal", team: "Derecho",   player: "Luis García",   minute: "22'" },
      { type: "goal", team: "Agronomía", player: "Luis Ramírez",  minute: "31'" },
      { type: "goal", team: "Agronomía", player: "Carlos López",  minute: "38'" },
    ],
    stats: {
      home: { possession: 60, shots: 22, shotsOnTarget: 12, fouls: 8,  corners: 0 },
      away: { possession: 40, shots: 10, shotsOnTarget: 4,  fouls: 15, corners: 0 },
    },
  },
  {
    id: 37,
    date: "2026-01-30",
    time: "10:00",
    home: "Medicina",
    away: "Derecho",
    homeScore: 3,
    awayScore: 0,
    sport: "Futsal Masculino",
    tournament: "Torneo Especial Futsal 2026",
    tournamentSlug: "torneo-especial-futsal-2026",
    court: "Cancha Techada",
    status: "finished",
    events: [
      { type: "goal", team: "Medicina", player: "Juan Pérez", minute: "7'"  },
      { type: "goal", team: "Medicina", player: "Omar Soto",  minute: "19'" },
      { type: "goal", team: "Medicina", player: "Juan Pérez", minute: "32'" },
    ],
    stats: {
      home: { possession: 63, shots: 19, shotsOnTarget: 11, fouls: 7,  corners: 0 },
      away: { possession: 37, shots: 8,  shotsOnTarget: 2,  fouls: 16, corners: 0 },
    },
  },

  // ─── Futsal Femenino ──────────────────────────────────────────────────────
  {
    id: 38,
    date: "2026-01-13",
    time: "09:00",
    home: "Enfermería",
    away: "Educación",
    homeScore: 3,
    awayScore: 1,
    sport: "Futsal Femenino",
    tournament: "Torneo Especial Futsal 2026",
    tournamentSlug: "torneo-especial-futsal-2026",
    court: "Cancha Techada",
    status: "finished",
    events: [
      { type: "goal", team: "Enfermería", player: "Ana Pérez",    minute: "7'"  },
      { type: "goal", team: "Educación",  player: "Rosa Díaz",    minute: "15'" },
      { type: "goal", team: "Enfermería", player: "Lucía Torres", minute: "24'" },
      { type: "goal", team: "Enfermería", player: "Ana Pérez",    minute: "35'" },
    ],
    stats: {
      home: { possession: 57, shots: 16, shotsOnTarget: 9, fouls: 8,  corners: 0 },
      away: { possession: 43, shots: 10, shotsOnTarget: 5, fouls: 11, corners: 0 },
    },
  },
  {
    id: 39,
    date: "2026-01-15",
    time: "11:00",
    home: "Medicina",
    away: "Forestales",
    homeScore: 2,
    awayScore: 0,
    sport: "Futsal Femenino",
    tournament: "Torneo Especial Futsal 2026",
    tournamentSlug: "torneo-especial-futsal-2026",
    court: "Cancha Techada",
    status: "finished",
    events: [
      { type: "goal", team: "Medicina", player: "Sofía Cruz", minute: "11'" },
      { type: "goal", team: "Medicina", player: "Sofía Cruz", minute: "29'" },
    ],
    stats: {
      home: { possession: 61, shots: 14, shotsOnTarget: 8, fouls: 9,  corners: 0 },
      away: { possession: 39, shots: 8,  shotsOnTarget: 3, fouls: 13, corners: 0 },
    },
  },
  {
    id: 40,
    date: "2026-01-21",
    time: "09:00",
    home: "Agronomía",
    away: "Zootecnia",
    homeScore: 1,
    awayScore: 1,
    sport: "Futsal Femenino",
    tournament: "Torneo Especial Futsal 2026",
    tournamentSlug: "torneo-especial-futsal-2026",
    court: "Cancha Techada",
    status: "finished",
    events: [
      { type: "goal", team: "Agronomía", player: "Carla Flores", minute: "14'" },
      { type: "goal", team: "Zootecnia", player: "Diana Lima",   minute: "33'" },
    ],
    stats: {
      home: { possession: 52, shots: 13, shotsOnTarget: 6, fouls: 10, corners: 0 },
      away: { possession: 48, shots: 11, shotsOnTarget: 5, fouls: 9,  corners: 0 },
    },
  },
  {
    id: 41,
    date: "2026-01-29",
    time: "09:00",
    home: "Enfermería",
    away: "Medicina",
    homeScore: 1,
    awayScore: 3,
    sport: "Futsal Femenino",
    tournament: "Torneo Especial Futsal 2026",
    tournamentSlug: "torneo-especial-futsal-2026",
    court: "Cancha Techada",
    status: "finished",
    events: [
      { type: "goal", team: "Medicina",   player: "Sofía Cruz",   minute: "6'"  },
      { type: "goal", team: "Enfermería", player: "Ana Pérez",    minute: "19'" },
      { type: "goal", team: "Medicina",   player: "Karen Flores", minute: "27'" },
      { type: "goal", team: "Medicina",   player: "Sofía Cruz",   minute: "36'" },
    ],
    stats: {
      home: { possession: 45, shots: 12, shotsOnTarget: 5,  fouls: 13, corners: 0 },
      away: { possession: 55, shots: 18, shotsOnTarget: 10, fouls: 9,  corners: 0 },
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getMatchesByTournament(tournamentSlug: string): Match[] {
  return mockMatches.filter((m) => m.tournamentSlug === tournamentSlug);
}

export function getMatchById(id: number): Match | undefined {
  return mockMatches.find((m) => m.id === id);
}

export function getTournamentNameBySlug(slug: string): string {
  return mockMatches.find((m) => m.tournamentSlug === slug)?.tournament ?? "Desconocido";
}