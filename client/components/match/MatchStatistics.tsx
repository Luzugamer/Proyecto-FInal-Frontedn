import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  estadisticas: any;
}

interface MatchStatisticsProps {
  match: Match;
}

export function MatchStatistics({ match }: MatchStatisticsProps) {
  const stats = [
    {
      metrica: "Posesión",
      unidad: "%",
      equipoA: match.estadisticas.equipoA.posesion,
      equipoB: match.estadisticas.equipoB.posesion,
    },
    {
      metrica: "Remates Totales",
      unidad: "",
      equipoA: match.estadisticas.equipoA.rematesTotales,
      equipoB: match.estadisticas.equipoB.rematesTotales,
    },
    {
      metrica: "Remates a Gol",
      unidad: "",
      equipoA: match.estadisticas.equipoA.rematesAGol,
      equipoB: match.estadisticas.equipoB.rematesAGol,
    },
    {
      metrica: "Corners",
      unidad: "",
      equipoA: match.estadisticas.equipoA.corners,
      equipoB: match.estadisticas.equipoB.corners,
    },
    {
      metrica: "Faltas",
      unidad: "",
      equipoA: match.estadisticas.equipoA.faltas,
      equipoB: match.estadisticas.equipoB.faltas,
    },
    {
      metrica: "Tarjetas Amarillas",
      unidad: "",
      equipoA: match.estadisticas.equipoA.tarjetas,
      equipoB: match.estadisticas.equipoB.tarjetas,
    },
    {
      metrica: "Pases Completados",
      unidad: "",
      equipoA: match.estadisticas.equipoA.pases,
      equipoB: match.estadisticas.equipoB.pases,
    },
    {
      metrica: "Precisión de Pases",
      unidad: "%",
      equipoA: match.estadisticas.equipoA.precisonPases,
      equipoB: match.estadisticas.equipoB.precisonPases,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabla Comparativa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estadísticas Detalladas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/5">
                  <TableHead className="text-left">{match.equipoA.nombre}</TableHead>
                  <TableHead className="text-center">Métrica</TableHead>
                  <TableHead className="text-right">{match.equipoB.nombre}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((stat, idx) => {
                  const maxValue = Math.max(stat.equipoA, stat.equipoB);
                  const widthA = (stat.equipoA / maxValue) * 100;
                  const widthB = (stat.equipoB / maxValue) * 100;

                  return (
                    <TableRow key={idx}>
                      <TableCell className="text-left">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">
                            {stat.equipoA}
                            {stat.unidad}
                          </span>
                          <div className="h-2 w-24 bg-green-200 rounded-full overflow-hidden ml-2">
                            <div
                              className="h-full bg-green-500 transition-all"
                              style={{ width: `${widthA}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium">
                        {stat.metrica}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-between">
                          <div className="h-2 w-24 bg-blue-200 rounded-full overflow-hidden mr-2">
                            <div
                              className="h-full bg-blue-500 transition-all"
                              style={{ width: `${widthB}%`, marginLeft: "auto" }}
                            />
                          </div>
                          <span className="font-semibold text-sm">
                            {stat.equipoB}
                            {stat.unidad}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Notas */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            📌 <strong>Nota:</strong> Las estadísticas mostradas son de carácter informativo y se actualizan
            después de cada partido. Para más detalles técnicos, consulta con los árbitros del evento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
