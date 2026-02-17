import {
  Plus,
  Users,
  Edit2,
  Trash2,
  User,
  Award,
  ArrowRight,
  Info,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
}

interface Team {
  id: number;
  name: string;
  city: string;
  coach: string;
  players: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  players_list: Player[];
  facultadId?: string;
}

const teams: Team[] = [
  {
    id: 1,
    name: "Agronomía FC",
    city: "Tingo María",
    coach: "Carlos Busquets",
    players: 23,
    wins: 8,
    draws: 2,
    losses: 1,
    points: 26,
    facultadId: "fac-1",
    players_list: [
      { id: 1, name: "Ángelo Campos", number: 1, position: "Portero" },
      { id: 2, name: "Luis Abram", number: 4, position: "Defensa" },
      { id: 3, name: "Josepmir Ballón", number: 5, position: "Centrocampista" },
      { id: 4, name: "Cristian Benavente", number: 10, position: "Delantero" },
      { id: 5, name: "Pablo Míguez", number: 9, position: "Delantero" },
    ],
  },
  {
    id: 2,
    name: "Ingeniería Systems",
    city: "Tingo María",
    coach: "Roberto Mosquera",
    players: 23,
    wins: 7,
    draws: 3,
    losses: 1,
    points: 24,
    facultadId: "fac-2",
    players_list: [
      { id: 6, name: "Jhilmar Lora", number: 1, position: "Portero" },
      { id: 7, name: "Miguel Trauco", number: 3, position: "Defensa" },
      {
        id: 8,
        name: "Horacio Calcaterra",
        number: 6,
        position: "Centrocampista",
      },
      {
        id: 9,
        name: "Cristian Martínez Borja",
        number: 9,
        position: "Delantero",
      },
      { id: 10, name: "Washington Corozo", number: 11, position: "Delantero" },
    ],
  },
  {
    id: 3,
    name: "Zootecnia United",
    city: "Tingo María",
    coach: "Juan Máximo Carrasco",
    players: 23,
    wins: 6,
    draws: 2,
    losses: 3,
    points: 20,
    facultadId: "fac-3",
    players_list: [
      { id: 11, name: "Sebastiano Lombardi", number: 1, position: "Portero" },
      { id: 12, name: "Aldo Corzo", number: 2, position: "Defensa" },
      { id: 13, name: "Jairo Concha", number: 8, position: "Centrocampista" },
      { id: 14, name: "Edison Flores", number: 10, position: "Centrocampista" },
      { id: 15, name: "Alex Valera", number: 19, position: "Delantero" },
    ],
  },
];

export default function Teams() {
  const { user } = useAuth();

  const filteredTeams = useMemo(() => {
    if (user?.rol === "DELEGADO_DEPORTES" && user.facultad) {
      return teams.filter((t) => t.facultadId === user.facultad?.id);
    }
    return teams;
  }, [user]);

  const isDelegado = user?.rol === "DELEGADO_DEPORTES";

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-accent/10 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {isDelegado ? `Equipos de ${user.facultad?.nombre}` : "Equipos"}
              </h1>
              <p className="text-lg text-muted-foreground">
                Administra equipos, jugadores y plantillas
              </p>
            </div>
            {(user?.rol === "SUPER_ADMIN" ||
              user?.rol === "ADMINISTRADOR" ||
              isDelegado) && (
              <button className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity self-start md:self-auto">
                <Plus className="w-5 h-5" />
                Nuevo Equipo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {isDelegado && (
          <Alert className="mb-8 border-primary/20 bg-primary-50">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-bold">
              Modo Delegado
            </AlertTitle>
            <AlertDescription className="text-primary/80">
              Solo puedes gestionar equipos y jugadores pertenecientes a la
              facultad de <strong>{user.facultad?.nombre}</strong>.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Equipos Visibles
                </p>
                <p className="text-3xl font-bold text-accent">
                  {filteredTeams.length}
                </p>
              </div>
              <Users className="w-10 h-10 text-accent opacity-20" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Jugadores Totales
                </p>
                <p className="text-3xl font-bold text-primary">
                  {filteredTeams.reduce((sum, t) => sum + t.players, 0)}
                </p>
              </div>
              <User className="w-10 h-10 text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Promedio de Puntos
                </p>
                <p className="text-3xl font-bold text-secondary">
                  {filteredTeams.length > 0
                    ? (
                        filteredTeams.reduce((sum, t) => sum + t.points, 0) /
                        filteredTeams.length
                      ).toFixed(1)
                    : "0"}
                </p>
              </div>
              <Award className="w-10 h-10 text-secondary opacity-20" />
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            Listado de Equipos
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-accent hover:shadow-lg transition-all"
              >
                {/* Team Header */}
                <div className="bg-gradient-to-r from-accent to-accent/80 p-6 text-accent-foreground">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold">{team.name}</h3>
                      <p className="text-accent-foreground/80">{team.city}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white/20 rounded-lg transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white/20 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm opacity-90">Entrenador: {team.coach}</p>
                </div>

                {/* Team Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-5 gap-3 mb-6 pb-6 border-b border-border">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {team.wins}
                      </p>
                      <p className="text-xs text-muted-foreground">Ganancias</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-secondary">
                        {team.draws}
                      </p>
                      <p className="text-xs text-muted-foreground">Empates</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-destructive">
                        {team.losses}
                      </p>
                      <p className="text-xs text-muted-foreground">Derrotas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent">
                        {team.points}
                      </p>
                      <p className="text-xs text-muted-foreground">Puntos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {team.players}
                      </p>
                      <p className="text-xs text-muted-foreground">Jugadores</p>
                    </div>
                  </div>

                  {/* Players Preview */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-foreground mb-3">
                      Jugadores
                    </p>
                    <div className="space-y-2">
                      {team.players_list.map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center justify-between p-2 bg-muted/50 rounded"
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              #{player.number} {player.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {player.position}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full py-2 border border-accent text-accent rounded-lg font-semibold hover:bg-accent/10 transition-colors flex items-center justify-center gap-2">
                    Ver Detalles Completos
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
