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
    home: {
      possession: number;
      shots: number;
      shotsOnTarget: number;
      fouls: number;
      corners: number;
    };
    away: {
      possession: number;
      shots: number;
      shotsOnTarget: number;
      fouls: number;
      corners: number;
    };
  };
}

export const mockMatches: Match[] = [
  // INTERFACULTADES 2026 - Solo 5 ejemplos
  {
    id: 1,
    date: "2026-02-07",
    time: "10:00",
    home: "Agronomía",
    away: "Zootecnia",
    homeScore: 3,
    awayScore: 1,
    sport: "Fútbol",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Estadio UNAS",
    status: "live",
    events: [
      {
        type: "goal",
        team: "Agronomía",
        player: "Carlos López",
        minute: "15'",
      },
      {
        type: "goal",
        team: "Zootecnia",
        player: "Mario García",
        minute: "32'",
      },
      {
        type: "goal",
        team: "Agronomía",
        player: "Fernando Soto",
        minute: "78'",
      },
    ],
    stats: {
      home: {
        possession: 58,
        shots: 12,
        shotsOnTarget: 6,
        fouls: 8,
        corners: 5,
      },
      away: {
        possession: 42,
        shots: 8,
        shotsOnTarget: 3,
        fouls: 12,
        corners: 3,
      },
    },
  },
  {
    id: 2,
    date: "2026-02-03",
    time: "14:00",
    home: "Enfermería",
    away: "Forestales",
    homeScore: 2,
    awayScore: 1,
    sport: "Vóley",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Coliseo Cerrado",
    status: "finished",
    events: [
      {
        type: "goal",
        team: "Enfermería",
        player: "Ana Silva",
        minute: "1er Set",
      },
    ],
    stats: {
      home: {
        possession: 52,
        shots: 24,
        shotsOnTarget: 18,
        fouls: 6,
        corners: 0,
      },
      away: {
        possession: 48,
        shots: 21,
        shotsOnTarget: 15,
        fouls: 7,
        corners: 0,
      },
    },
  },
  {
    id: 3,
    date: "2026-02-07",
    time: "11:00",
    home: "Ingeniería",
    away: "Economía",
    homeScore: 0,
    awayScore: 0,
    sport: "Básquet",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Cancha 1",
    status: "today",
    stats: {
      home: {
        possession: 50,
        shots: 16,
        shotsOnTarget: 12,
        fouls: 5,
        corners: 0,
      },
      away: {
        possession: 50,
        shots: 14,
        shotsOnTarget: 10,
        fouls: 4,
        corners: 0,
      },
    },
  },
  {
    id: 4,
    date: "2026-02-10",
    time: "10:00",
    home: "Agronomía",
    away: "Ingeniería",
    sport: "Fútbol",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Estadio UNAS",
    status: "upcoming",
    stats: {
      home: {
        possession: 55,
        shots: 10,
        shotsOnTarget: 5,
        fouls: 7,
        corners: 4,
      },
      away: {
        possession: 45,
        shots: 9,
        shotsOnTarget: 4,
        fouls: 8,
        corners: 3,
      },
    },
  },
  {
    id: 5,
    date: "2026-02-12",
    time: "15:00",
    home: "Medicina",
    away: "Derecho",
    homeScore: 1,
    awayScore: 1,
    sport: "Futsal",
    tournament: "Interfacultades 2026",
    tournamentSlug: "interfacultades-2026",
    court: "Cancha 2",
    status: "finished",
    events: [
      {
        type: "goal",
        team: "Medicina",
        player: "Pedro Sánchez",
        minute: "12'",
      },
      {
        type: "goal",
        team: "Derecho",
        player: "Luis García",
        minute: "28'",
      },
    ],
    stats: {
      home: {
        possession: 54,
        shots: 11,
        shotsOnTarget: 6,
        fouls: 9,
        corners: 2,
      },
      away: {
        possession: 46,
        shots: 8,
        shotsOnTarget: 4,
        fouls: 10,
        corners: 1,
      },
    },
  },
];

export function getMatchesByTournament(tournamentSlug: string): Match[] {
  return mockMatches.filter((match) => match.tournamentSlug === tournamentSlug);
}

export function getMatchById(id: number): Match | undefined {
  return mockMatches.find((match) => match.id === id);
}

export function getTournamentNameBySlug(slug: string): string {
  const match = mockMatches.find((m) => m.tournamentSlug === slug);
  return match?.tournament || "Desconocido";
}
