import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Match {
  cronologia: any[];
}

interface MatchTimelineProps {
  match: Match;
}

const TIPO_ICON: Record<string, string> = {
  gol: "⚽",
  cambio: "🔄",
  tarjeta_amarilla: "🟨",
  tarjeta_roja: "🔴",
  descanso: "⏸️",
  fin: "🏁",
  saque: "▶️",
};

const TIPO_COLOR: Record<string, string> = {
  gol: "bg-yellow-100 border-yellow-300",
  cambio: "bg-blue-100 border-blue-300",
  tarjeta_amarilla: "bg-yellow-50 border-yellow-200",
  tarjeta_roja: "bg-red-100 border-red-300",
  descanso: "bg-gray-100 border-gray-300",
  fin: "bg-green-100 border-green-300",
  saque: "bg-primary/10 border-primary/30",
};

export function MatchTimeline({ match }: MatchTimelineProps) {
  return (
    <div className="relative">
      <div className="space-y-4">
        {match.cronologia.map((evento, idx) => (
          <div key={idx} className="flex gap-4">
            {/* Línea vertical */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${TIPO_COLOR[evento.tipo]}`}>
                {TIPO_ICON[evento.tipo] || "📌"}
              </div>
              {idx < match.cronologia.length - 1 && (
                <div className="w-0.5 h-12 bg-gray-300 mt-2" />
              )}
            </div>

            {/* Contenido del evento */}
            <div className="flex-1 pb-4">
              <Card className={`border-l-4 ${TIPO_COLOR[evento.tipo]}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-mono mb-1">
                        {evento.minuto}'
                      </p>
                      <p className="text-sm font-semibold">
                        {evento.descripcion}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {evento.tipo.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div className="mt-8 pt-6 border-t space-y-3">
        <p className="text-sm font-semibold">Leyenda de Eventos</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚽</span>
            <span>Gol</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🔄</span>
            <span>Cambio</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🟨</span>
            <span>Tarjeta Amarilla</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🔴</span>
            <span>Tarjeta Roja</span>
          </div>
        </div>
      </div>
    </div>
  );
}
