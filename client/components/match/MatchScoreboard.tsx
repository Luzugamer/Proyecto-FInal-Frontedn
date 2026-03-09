import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Match {
  equipoA: {
    nombre: string;
    facultad: string;
    logo: string;
    goles: number;
  };
  equipoB: {
    nombre: string;
    facultad: string;
    logo: string;
    goles: number;
  };
  estado: "por_jugar" | "en_vivo" | "finalizado";
}

interface MatchScoreboardProps {
  match: Match;
  isWinner: string;
}

export function MatchScoreboard({ match, isWinner }: MatchScoreboardProps) {
  return (
    <div className="relative bg-gradient-to-r from-primary/5 via-background to-primary/5 p-8 rounded-lg border">
      <div className="flex items-center justify-center gap-6 md:gap-12">
        {/* Equipo A */}
        <div
          className={`flex-1 text-center p-6 rounded-lg transition-all ${
            isWinner === "A"
              ? "ring-2 ring-primary bg-primary/10"
              : ""
          }`}
        >
          <h2 className="text-lg font-bold text-foreground mb-4">
            {match.equipoA.nombre}
          </h2>
          <div className="text-5xl font-bold text-primary">
            {match.equipoA.goles}
          </div>
        </div>

        {/* Separador con estado */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl font-bold text-muted-foreground">-</span>
        </div>

        {/* Equipo B */}
        <div
          className={`flex-1 text-center p-6 rounded-lg transition-all ${
            isWinner === "B"
              ? "ring-2 ring-primary bg-primary/10"
              : ""
          }`}
        >
          <h2 className="text-lg font-bold text-foreground mb-4">
            {match.equipoB.nombre}
          </h2>
          <div className="text-5xl font-bold text-primary">
            {match.equipoB.goles}
          </div>
        </div>
      </div>

      {/* Indicador de ganador */}
      {match.estado === "finalizado" && isWinner !== "empate" && (
        <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 rounded-br-lg text-xs font-bold">
          🏆 {isWinner === "A" ? match.equipoA.nombre : match.equipoB.nombre}
        </div>
      )}
    </div>
  );
}
