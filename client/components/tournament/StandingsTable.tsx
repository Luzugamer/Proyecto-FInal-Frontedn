import { useMemo } from "react";
import { Trophy } from "lucide-react";

interface StandingsTeam {
  id: string;
  name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  position: number;
}

interface StandingsGroup {
  name: string;
  teams: StandingsTeam[];
}

interface StandingsTableProps {
  groups?: StandingsGroup[];
}

// Mock data con 4 grupos de posiciones
const mockGroups: StandingsGroup[] = [
  {
    name: "Grupo A",
    teams: [
      {
        id: "1",
        name: "Agronomía",
        played: 3,
        wins: 3,
        draws: 0,
        losses: 0,
        points: 9,
        position: 1,
      },
      {
        id: "2",
        name: "Ingeniería",
        played: 3,
        wins: 2,
        draws: 1,
        losses: 0,
        points: 7,
        position: 2,
      },
      {
        id: "3",
        name: "Zootecnia",
        played: 3,
        wins: 1,
        draws: 0,
        losses: 2,
        points: 3,
        position: 3,
      },
      {
        id: "4",
        name: "Economía",
        played: 3,
        wins: 0,
        draws: 0,
        losses: 3,
        points: 0,
        position: 4,
      },
    ],
  },
  {
    name: "Grupo B",
    teams: [
      {
        id: "5",
        name: "Enfermería",
        played: 3,
        wins: 2,
        draws: 1,
        losses: 0,
        points: 7,
        position: 1,
      },
      {
        id: "6",
        name: "Forestales",
        played: 3,
        wins: 2,
        draws: 0,
        losses: 1,
        points: 6,
        position: 2,
      },
      {
        id: "7",
        name: "Ciencias Sociales",
        played: 3,
        wins: 1,
        draws: 1,
        losses: 1,
        points: 4,
        position: 3,
      },
      {
        id: "8",
        name: "Educación",
        played: 3,
        wins: 0,
        draws: 0,
        losses: 3,
        points: 0,
        position: 4,
      },
    ],
  },
  {
    name: "Grupo C",
    teams: [
      {
        id: "9",
        name: "Medicina",
        played: 2,
        wins: 2,
        draws: 0,
        losses: 0,
        points: 6,
        position: 1,
      },
      {
        id: "10",
        name: "Derecho",
        played: 2,
        wins: 1,
        draws: 1,
        losses: 0,
        points: 4,
        position: 2,
      },
      {
        id: "11",
        name: "Administración",
        played: 2,
        wins: 0,
        draws: 1,
        losses: 1,
        points: 1,
        position: 3,
      },
      {
        id: "12",
        name: "Contabilidad",
        played: 2,
        wins: 0,
        draws: 0,
        losses: 2,
        points: 0,
        position: 4,
      },
    ],
  },
  {
    name: "Grupo D",
    teams: [
      {
        id: "13",
        name: "Sistemas",
        played: 2,
        wins: 2,
        draws: 0,
        losses: 0,
        points: 6,
        position: 1,
      },
      {
        id: "14",
        name: "Electrónica",
        played: 2,
        wins: 1,
        draws: 0,
        losses: 1,
        points: 3,
        position: 2,
      },
      {
        id: "15",
        name: "Civil",
        played: 2,
        wins: 0,
        draws: 1,
        losses: 1,
        points: 1,
        position: 3,
      },
      {
        id: "16",
        name: "Mecánica",
        played: 2,
        wins: 0,
        draws: 1,
        losses: 1,
        points: 1,
        position: 4,
      },
    ],
  },
];

export function StandingsTable({ groups = mockGroups }: StandingsTableProps) {
  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-widest">
          Tabla de Posiciones
        </h2>
        <p className="text-muted-foreground text-lg">
          Posición de equipos en cada grupo
        </p>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {groups.map((group) => (
          <div
            key={group.name}
            className="group rounded-2xl border-2 border-primary/30 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
          >
            {/* Group Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5 text-white">
              <h3 className="text-2xl font-black uppercase tracking-widest drop-shadow-md">
                {group.name}
              </h3>
            </div>

            {/* Group Table */}
            <div className="bg-white overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary/10 border-b border-primary/20">
                    <th className="px-4 py-3 text-left text-xs font-black text-foreground uppercase">
                      Pos
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-black text-foreground uppercase">
                      Equipo
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-black text-foreground uppercase">
                      PJ
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-black text-foreground uppercase">
                      G
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-black text-foreground uppercase">
                      E
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-black text-foreground uppercase">
                      P
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-black text-foreground uppercase">
                      Pts
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.teams.map((team, idx) => (
                    <tr
                      key={team.id}
                      className={`border-b border-primary/10 transition-all hover:bg-primary/5 ${
                        idx === 0
                          ? "bg-yellow-50/50"
                          : idx === 1
                            ? "bg-slate-50/50"
                            : idx === 2
                              ? "bg-orange-50/50"
                              : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-black text-sm ${
                            idx === 0
                              ? "bg-yellow-400 text-yellow-900"
                              : idx === 1
                                ? "bg-slate-400 text-slate-900"
                                : idx === 2
                                  ? "bg-orange-400 text-orange-900"
                                  : "bg-primary/20 text-foreground"
                          }`}
                        >
                          {idx + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-foreground">
                          {team.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-foreground">
                        {team.played}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-bold text-green-600">
                        {team.wins}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-bold text-yellow-600">
                        {team.draws}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-bold text-red-600">
                        {team.losses}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 font-black text-primary">
                          {team.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-sm">
          <div>
            <p className="font-black text-foreground">PJ</p>
            <p className="text-muted-foreground text-xs">Partidos Jugados</p>
          </div>
          <div>
            <p className="font-black text-green-600">G</p>
            <p className="text-muted-foreground text-xs">Ganancias</p>
          </div>
          <div>
            <p className="font-black text-yellow-600">E</p>
            <p className="text-muted-foreground text-xs">Empates</p>
          </div>
          <div>
            <p className="font-black text-red-600">P</p>
            <p className="text-muted-foreground text-xs">Pérdidas</p>
          </div>
          <div>
            <p className="font-black text-primary">Pts</p>
            <p className="text-muted-foreground text-xs">Puntos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
