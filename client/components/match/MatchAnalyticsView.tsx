import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface MatchAnalyticsViewProps {
  match: Match;
}

// Datos para gráfico de rendimiento (Radar)
const RENDIMIENTO_DATA = [
  {
    metrica: "Ofensiva",
    FIA: 85,
    FIIS: 45,
    fullMark: 100,
  },
  {
    metrica: "Defensiva",
    FIA: 80,
    FIIS: 60,
    fullMark: 100,
  },
  {
    metrica: "Efectividad",
    FIA: 90,
    FIIS: 70,
    fullMark: 100,
  },
  {
    metrica: "Precisión",
    FIA: 82,
    FIIS: 78,
    fullMark: 100,
  },
  {
    metrica: "Regularidad",
    FIA: 88,
    FIIS: 65,
    fullMark: 100,
  },
  {
    metrica: "Disciplina",
    FIA: 75,
    FIIS: 50,
    fullMark: 100,
  },
];

// Datos para evolución de posiciones (Línea)
const EVOLUCION_POSICIONES = [
  { jornada: 1, FIA: 2, FIIS: 3 },
  { jornada: 2, FIA: 2, FIIS: 2 },
  { jornada: 3, FIA: 1, FIIS: 3 },
  { jornada: 4, FIA: 1, FIIS: 3 },
  { jornada: 5, FIA: 1, FIIS: 3 },
];

// Datos para estadísticas del partido (Barras horizontales)
const ESTADISTICAS_PARTIDO = [
  { metrica: "Posesión (%)", FIA: 65, FIIS: 35 },
  { metrica: "Remates", FIA: 12, FIIS: 8 },
  { metrica: "Remates a gol", FIA: 8, FIIS: 5 },
  { metrica: "Corners", FIA: 6, FIIS: 4 },
  { metrica: "Faltas", FIA: 4, FIIS: 7 },
  { metrica: "Tarjetas", FIA: 1, FIIS: 2 },
];

// Datos para rendimiento por tiempo (Barras agrupadas)
const GOLES_POR_TIEMPO = [
  { tiempo: "1T", FIA: 1, FIIS: 1 },
  { tiempo: "2T", FIA: 2, FIIS: 0 },
];

// Datos para contribución individual (Dona)
const GOLEADORES = [
  { nombre: "Diego Flores (FIA)", valor: 40, color: "#00873E" },
  { nombre: "Roberto Silva (FIIS)", valor: 25, color: "#3B82F6" },
  { nombre: "Juan Pérez (FIA)", valor: 20, color: "#00873E" },
  { nombre: "Player 4 (FIA)", valor: 10, color: "#00873E" },
  { nombre: "Player 5 (FIIS)", valor: 5, color: "#3B82F6" },
];

export function MatchAnalyticsView({ match }: MatchAnalyticsViewProps) {
  return (
    <div className="space-y-8">
      {/* Gráfico 1: Rendimiento Comparativo (Radar) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📊 Comparativa de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={RENDIMIENTO_DATA}>
              <PolarGrid stroke="#ddd" />
              <PolarAngleAxis dataKey="metrica" />
              <PolarRadiusAxis />
              <Radar
                name={match.equipoA.nombre}
                dataKey="FIA"
                stroke="#00873E"
                fill="#00873E"
                fillOpacity={0.4}
              />
              <Radar
                name={match.equipoB.nombre}
                dataKey="FIIS"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.4}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico 2: Evolución de Posiciones (Línea) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📈 Evolución de Posiciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={EVOLUCION_POSICIONES}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jornada" label={{ value: "Jornada", position: "insideBottomRight", offset: -5 }} />
              <YAxis
                reversed
                domain={[0, 4]}
                label={{ value: "Posición", angle: -90, position: "insideLeft" }}
                ticks={[1, 2, 3, 4]}
              />
              <Tooltip formatter={(value) => `Posición ${value}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="FIA"
                stroke="#00873E"
                strokeWidth={2}
                dot={{ fill: "#00873E" }}
                name={match.equipoA.nombre}
              />
              <Line
                type="monotone"
                dataKey="FIIS"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6" }}
                name={match.equipoB.nombre}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico 3: Estadísticas del Partido (Barras Horizontales) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">⚽ Estadísticas del Partido</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={ESTADISTICAS_PARTIDO}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="metrica" type="category" width={90} />
              <Tooltip />
              <Legend />
              <Bar dataKey="FIA" fill="#00873E" name={match.equipoA.nombre} />
              <Bar dataKey="FIIS" fill="#3B82F6" name={match.equipoB.nombre} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico 4: Goles por Tiempo (Barras Agrupadas) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🥅 Goles por Tiempo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={GOLES_POR_TIEMPO}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tiempo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="FIA" fill="#00873E" name={match.equipoA.nombre} />
              <Bar dataKey="FIIS" fill="#3B82F6" name={match.equipoB.nombre} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico 5: Contribución Individual (Goleadores) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🏆 Top 5 Goleadores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {GOLEADORES.map((goleador, idx) => {
              const percentage = (goleador.valor / 100) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      {idx + 1}. {goleador.nombre}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {goleador.valor}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: goleador.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
