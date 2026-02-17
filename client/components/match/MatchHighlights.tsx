import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Sparkles } from "lucide-react";

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

interface MatchHighlightsProps {
  match: Match;
}

export function MatchHighlights({ match }: MatchHighlightsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">🎯 Puntos Destacados</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1: MVP del Partido */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                MVP del Partido
              </CardTitle>
              <Badge className="bg-yellow-500">⭐ MVP</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-100 flex items-center justify-center text-3xl">
                ⚽
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Diego Flores</h3>
                <p className="text-sm text-muted-foreground">{match.equipoA.nombre}</p>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg space-y-2">
              <p className="text-sm font-semibold">Estadísticas Clave</p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>• 2 Goles</p>
                <p>• 1 Asistencia</p>
                <p>• 87% Precisión de Pases</p>
                <p>• 4 Remates a Gol</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic">
              Desempeño extraordinario en ataque, siendo decisivo en los últimos 30 minutos del partido.
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Mejor Jugada */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Mejor Jugada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg space-y-2 border border-blue-200">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Minuto 78'</p>
                <Badge variant="secondary">Gol</Badge>
              </div>
              <p className="text-sm">
                Pase largo de 40 metros de Carlos López (FIA) que encuentra a Juan Pérez en el área.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Jugadores Involucrados</p>
              <div className="flex gap-2">
                <div className="text-xs bg-primary/10 px-2 py-1 rounded">Carlos López</div>
                <div className="text-xs bg-primary/10 px-2 py-1 rounded">Juan Pérez</div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic">
              Una jugada de transición rápida que definió el resultado final del partido.
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Dato Curioso */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Dato Curioso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="font-semibold text-sm mb-2">🔥 Racha de Victoria</p>
              <p className="text-sm text-muted-foreground">
                {match.equipoA.nombre} consigue su 4ª victoria consecutiva, igualando el récord de la temporada anterior.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Comparación Histórica</p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>• Temporada anterior: 4 victorias consecutivas</p>
                <p>• Edición 2024: 3 victorias consecutivas</p>
                <p>• Edición 2023: 2 victorias consecutivas</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic">
              {match.equipoA.nombre} demuestra un crecimiento consistente en su desempeño a lo largo de las ediciones.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
