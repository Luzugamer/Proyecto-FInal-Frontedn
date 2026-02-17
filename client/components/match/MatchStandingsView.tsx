import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Match {
  equipoA: {
    nombre: string;
    facultad: string;
    goles: number;
  };
  equipoB: {
    nombre: string;
    facultad: string;
    goles: number;
  };
}

interface MatchStandingsViewProps {
  match: Match;
}

// Datos simulados de tabla de posiciones
const STANDINGS_DATA = [
  {
    pos: 1,
    facultad: "FIA",
    pj: 5,
    g: 4,
    e: 1,
    p: 0,
    gf: 12,
    gc: 3,
    dg: 9,
    pts: 13,
    cambio: "↑",
    ultimos5: ["🟢", "🟢", "🟢", "🟡", "🟢"],
  },
  {
    pos: 2,
    facultad: "FIZ",
    pj: 5,
    g: 3,
    e: 1,
    p: 1,
    gf: 9,
    gc: 5,
    dg: 4,
    pts: 10,
    cambio: "",
    ultimos5: ["🟢", "🟢", "🔴", "🟢", "🟡"],
  },
  {
    pos: 3,
    facultad: "FIIS",
    pj: 5,
    g: 2,
    e: 2,
    p: 1,
    gf: 7,
    gc: 6,
    dg: 1,
    pts: 8,
    cambio: "↓",
    ultimos5: ["🟡", "🟢", "🔴", "🟡", "🔴"],
  },
  {
    pos: 4,
    facultad: "FIARN",
    pj: 5,
    g: 1,
    e: 1,
    p: 3,
    gf: 5,
    gc: 10,
    dg: -5,
    pts: 4,
    cambio: "",
    ultimos5: ["🔴", "🔴", "🟡", "🟢", "🔴"],
  },
];

export function MatchStandingsView({ match }: MatchStandingsViewProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/5">
              <TableHead className="w-12">Pos</TableHead>
              <TableHead>Facultad</TableHead>
              <TableHead className="text-center">PJ</TableHead>
              <TableHead className="text-center">G</TableHead>
              <TableHead className="text-center">E</TableHead>
              <TableHead className="text-center">P</TableHead>
              <TableHead className="text-center">GF</TableHead>
              <TableHead className="text-center">GC</TableHead>
              <TableHead className="text-center">DG</TableHead>
              <TableHead className="text-center">Pts</TableHead>
              <TableHead className="text-center">Últimos 5</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {STANDINGS_DATA.map((row, idx) => {
              const isTeamInMatch =
                row.facultad === "FIA" || row.facultad === "FIIS";

              return (
                <TableRow
                  key={idx}
                  className={`${
                    isTeamInMatch
                      ? "bg-primary/5 border-l-4 border-primary"
                      : ""
                  } ${idx === 0 ? "border-t-2" : ""}`}
                >
                  <TableCell className="font-bold text-primary">
                    {row.pos}
                    {row.cambio && (
                      <span className="ml-1 text-sm text-green-600">
                        {row.cambio}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {row.facultad}
                    {isTeamInMatch && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        En este partido
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{row.pj}</TableCell>
                  <TableCell className="text-center text-green-600 font-semibold">
                    {row.g}
                  </TableCell>
                  <TableCell className="text-center text-yellow-600 font-semibold">
                    {row.e}
                  </TableCell>
                  <TableCell className="text-center text-red-600 font-semibold">
                    {row.p}
                  </TableCell>
                  <TableCell className="text-center">{row.gf}</TableCell>
                  <TableCell className="text-center">{row.gc}</TableCell>
                  <TableCell className="text-center font-semibold">
                    {row.dg > 0 && "+"}
                    {row.dg}
                  </TableCell>
                  <TableCell className="text-center font-bold text-primary">
                    {row.pts}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      {row.ultimos5.map((result, i) => (
                        <span
                          key={i}
                          title={
                            result === "🟢"
                              ? "Victoria"
                              : result === "🟡"
                              ? "Empate"
                              : "Derrota"
                          }
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Información contextual */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Última actualización</p>
          <p className="font-semibold text-sm">Hace 5 minutos</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Leyenda</p>
          <div className="flex gap-2 text-xs">
            <span title="Victoria">🟢 Victoria</span>
            <span title="Empate">🟡 Empate</span>
            <span title="Derrota">🔴 Derrota</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Clasificación</p>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 bg-green-100 rounded">Clasificados</span>
          </div>
        </div>
      </div>
    </div>
  );
}
