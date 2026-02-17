import { Card, CardContent } from "@/components/ui/card";
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
  alineacionA: any[];
  alineacionB: any[];
}

interface MatchLineupProps {
  match: Match;
}

export function MatchLineup({ match }: MatchLineupProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Alineación Equipo A */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-bold text-lg mb-4">{match.equipoA.nombre}</h3>
          <div className="space-y-2">
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">TITULARES</p>
              {match.alineacionA
                .filter((j) => j.titular)
                .map((jugador, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-green-50 mb-2 border border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">
                        {jugador.numero}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{jugador.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {jugador.posicion}
                        </p>
                      </div>
                    </div>
                    {jugador.goles > 0 && (
                      <Badge className="bg-yellow-500">⚽ {jugador.goles}</Badge>
                    )}
                  </div>
                ))}
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">SUPLENTES</p>
              {match.alineacionA
                .filter((j) => !j.titular)
                .map((jugador, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20 mb-2 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs font-bold flex items-center justify-center">
                        {jugador.numero}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{jugador.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {jugador.posicion}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alineación Equipo B */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-bold text-lg mb-4">{match.equipoB.nombre}</h3>
          <div className="space-y-2">
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">TITULARES</p>
              {match.alineacionB
                .filter((j) => j.titular)
                .map((jugador, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-blue-50 mb-2 border border-blue-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                        {jugador.numero}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{jugador.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {jugador.posicion}
                        </p>
                      </div>
                    </div>
                    {jugador.goles > 0 && (
                      <Badge className="bg-yellow-500">⚽ {jugador.goles}</Badge>
                    )}
                  </div>
                ))}
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">SUPLENTES</p>
              {match.alineacionB
                .filter((j) => !j.titular)
                .map((jugador, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20 mb-2 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs font-bold flex items-center justify-center">
                        {jugador.numero}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{jugador.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {jugador.posicion}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
