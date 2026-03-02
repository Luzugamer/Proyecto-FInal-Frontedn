import { Link } from "react-router-dom";
import { Play, Users, Flame } from "lucide-react";
import { usePublicTournaments } from "@/hooks/useTournaments";
import { useLiveMatches } from "@/hooks/useMatches";
import { LoadingSpinner, ErrorState } from "@/components/common/StateComponents";

const sports = [
  {
    name: "Fútbol",
    href: "/deportes/futbol",
    color: "from-green-500 to-green-600",
  },
  {
    name: "Vóley",
    href: "/deportes/voley",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    name: "Básquet",
    href: "/deportes/basquet",
    color: "from-orange-500 to-orange-600",
  },
  {
    name: "Futsal",
    href: "/deportes/futsal",
    color: "from-blue-500 to-blue-600",
  },
];

export default function Index() {
  // Obtener datos con hooks
  const { data: tournaments, isLoading: tournamentsLoading, error: tournamentsError } = usePublicTournaments();
  const { data: liveMatches, isLoading: matchesLoading, error: matchesError } = useLiveMatches();

  // Mostrar loading global si ambos están cargando
  if (tournamentsLoading && matchesLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-screen bg-gradient-to-r from-primary via-secondary to-primary overflow-hidden animate-gradient-x">
        <style>{`
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 15s ease infinite;
          }
        `}</style>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2240%22 fill=%22none%22 stroke=%22white%22 stroke-width=%220.5%22 opacity=%220.1%22/></svg>')] bg-repeat"></div>
        </div>

        <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10 text-center">
          <div className="mb-6 animate-pulse-live">
            <Flame className="w-16 h-16 text-accent mx-auto animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Vive la Pasión Deportiva UNAS en Tiempo Real
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl">
            Gestión integral de olimpiadas Cachimbos e Interfacultades.
            <br />
            Resultados en vivo, estadísticas actualizadas y toda la emoción del
            deporte universitario.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/torneos?tab=activos"
              className="group relative px-8 py-4 bg-destructive text-white rounded-lg font-bold text-lg hover:shadow-xl transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Flame className="w-6 h-6" />
                VER TORNEOS ACTIVOS
              </span>
              <div className="absolute inset-0 bg-destructive/80 group-hover:opacity-0 transition-opacity"></div>
            </Link>
          </div>

          <div className="mt-8 inline-block bg-white/20 backdrop-blur rounded-full px-6 py-3 text-white">
            <p className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-destructive rounded-full animate-pulse"></span>
              <span className="font-semibold">
                {liveMatches?.length || 0} partidos en vivo ahora
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Ongoing Tournaments Section - Región Común */}
      <section className="py-10 bg-white border-t-4 border-primary">
        <div className="container mx-auto px-4">
          {/* Section Header - Proximidad y Continuidad */}
          <div className="mb-8 max-w-3xl animate-fade-in-up">
            <style>{`
              @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in-up {
                animation: fade-in-up 0.6s ease-out;
              }
            `}</style>
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-12 bg-gradient-to-b from-primary to-primary/50 rounded-full flex-shrink-0"></div>
              <div>
                <h2 className="text-2xl font-bold text-foreground leading-tight">
                  Torneos en Curso
                </h2>
                <p className="text-base text-muted-foreground mt-3 font-medium">
                  Competencias actuales en las que puedes participar
                </p>
              </div>
            </div>
          </div>

          {/* Tournaments Grid - Similitud y Simetría */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tournamentsLoading ? (
              <div className="col-span-2 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : tournamentsError ? (
              <div className="col-span-2">
                <ErrorState
                  title="Error al cargar torneos"
                  onRetry={() => window.location.reload()}
                />
              </div>
            ) : tournaments && tournaments.length > 0 ? (
              tournaments.slice(0, 6).map((tournament, index) => {
                // Calcular días hasta la final
                const daysLeft = tournament.endDate
                  ? Math.ceil((new Date(tournament.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  : 0;

                // Calcular progreso aproximado
                const progress = tournament.startDate && tournament.endDate
                  ? Math.min(100, Math.max(0, 
                      ((Date.now() - new Date(tournament.startDate).getTime()) / 
                       (new Date(tournament.endDate).getTime() - new Date(tournament.startDate).getTime())) * 100
                    ))
                  : 0;

                return (
                  <div
                    key={tournament.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-100 text-primary animate-pulse">
                        {tournament.state}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">
                          {daysLeft > 0 ? `Faltan ${daysLeft}` : 'Finalizado'}
                        </p>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">
                          {daysLeft > 0 ? 'Días para la final' : ''}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                      {tournament.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {tournament.description || 'Torneo deportivo universitario'}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-bold text-foreground">
                            Progreso del Torneo
                          </span>
                          <span className="text-muted-foreground">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-primary to-secondary"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-bold">
                            {tournament.maxTeams || 'N/A'} Equipos
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/torneo/${tournament.slug}`}
                        className="w-full py-2 mt-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary-700 hover:scale-105 transition-all flex items-center justify-center gap-2 text-xs"
                      >
                        <Users className="w-4 h-4" />
                        VER DETALLES
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-muted-foreground">No hay torneos en curso actualmente</p>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/torneos?tab=activos"
              className="text-primary hover:text-primary-700 font-bold text-lg flex items-center gap-2 mx-auto w-fit"
            >
              Ver todos los torneos →
            </Link>
          </div>
        </div>
      </section>

      {/* Live Matches Section - Región Común y Similitud */}
      <section className="py-10 bg-gradient-to-b from-white via-white to-primary-50 border-t-4 border-secondary">
        <div className="container mx-auto px-4">
          {/* Section Header - Proximidad y Continuidad */}
          <div className="mb-8 max-w-3xl animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-12 bg-gradient-to-b from-secondary to-secondary/50 rounded-full flex-shrink-0"></div>
              <div>
                <h2 className="text-2xl font-bold text-foreground leading-tight">
                  Partidos Hoy
                </h2>
                <p className="text-base text-muted-foreground mt-3 font-medium">
                  Sigue los encuentros de hoy en vivo
                </p>
              </div>
            </div>
          </div>

          {/* Matches Grid - Similitud de estilo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {matchesLoading ? (
              <div className="col-span-3 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : matchesError ? (
              <div className="col-span-3">
                <ErrorState
                  title="Error al cargar partidos"
                  onRetry={() => window.location.reload()}
                />
              </div>
            ) : liveMatches && liveMatches.length > 0 ? (
              liveMatches.slice(0, 9).map((match, index) => (
                <div
                  key={match.id}
                  className="group flex flex-col h-full bg-white border-2 border-secondary rounded-xl overflow-hidden hover:shadow-2xl hover:border-secondary/80 hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {/* Live Badge - Figura-Fondo claro */}
                  <div className="bg-gradient-to-r from-destructive via-destructive to-red-600 px-4 py-3 flex items-center justify-between text-white border-b-4 border-destructive/40 animate-pulse">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-white rounded-full animate-ping"></span>
                      <span className="font-bold text-xs tracking-wide">EN VIVO</span>
                    </div>
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">{match.sport}</span>
                  </div>

                  {/* Score Section - Simetría y Continuidad */}
                  <div className="flex-1 p-5 text-center flex flex-col justify-center">
                    <div className="grid grid-cols-3 gap-3 items-center mb-4">
                      {/* Home Team */}
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground/80 uppercase tracking-tight">
                          {match.home}
                        </p>
                        <p className="text-3xl font-black text-primary group-hover:scale-110 transition-transform">
                          {match.homeScore}
                        </p>
                      </div>

                      {/* Separator - Conectividad visual */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-0.5 h-8 bg-gradient-to-b from-primary via-primary to-transparent rounded-full"></div>
                        <span className="text-xl font-light text-muted-foreground/40">-</span>
                      </div>

                      {/* Away Team */}
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground/80 uppercase tracking-tight">
                          {match.away}
                        </p>
                        <p className="text-3xl font-black text-secondary group-hover:scale-110 transition-transform">
                          {match.awayScore}
                        </p>
                      </div>
                    </div>

                    {/* Match Info - Región Común */}
                    <div className="border-t border-dashed border-primary/20 pt-2 mt-2 space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        📍 {match.location}
                      </p>
                      {match.time && (
                        <p className="text-xs text-muted-foreground/70">
                          {match.time}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="px-4 pb-4">
                    <Link
                      to={`/partidos/${match.id}`}
                      className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary-700 hover:scale-105 transition-all flex items-center justify-center gap-2 text-xs"
                    >
                      <Play className="w-4 h-4" />
                      VER DETALLES
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">No hay partidos en vivo en este momento</p>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/partidos"
              className="text-primary hover:text-primary-700 font-bold text-lg flex items-center gap-2 mx-auto w-fit"
            >
              Ver todos los partidos →
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section - Región Común y Similitud */}
      <section className="py-10 bg-white border-t-4 border-accent">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-8 max-w-3xl animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-12 bg-gradient-to-b from-accent to-accent/50 rounded-full flex-shrink-0"></div>
              <div>
                <h2 className="text-2xl font-bold text-foreground leading-tight">
                  Últimas Noticias
                </h2>
                <p className="text-base text-muted-foreground mt-3 font-medium">
                  Mantente informado de los eventos más importantes
                </p>
              </div>
            </div>
          </div>

          {/* News Grid - Similitud de estilos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {[
              {
                id: 1,
                title: "Interfacultades 2026 Comienza con Emoción",
                category: "Noticias",
                date: "Hoy",
                image: "bg-gradient-to-br from-green-500 to-green-600",
              },
              {
                id: 2,
                title: "Cachimbos 2026: Inscripciones Abiertas",
                category: "Inscripciones",
                date: "Hace 2h",
                image: "bg-gradient-to-br from-blue-500 to-blue-600",
              },
              {
                id: 3,
                title: "Final de Fútbol: Agronomía vs Ingeniería",
                category: "Resultados",
                date: "Hace 5h",
                image: "bg-gradient-to-br from-orange-500 to-red-600",
              },
              {
                id: 4,
                title: "Nuevo Récord en Vóley Femenino",
                category: "Destacado",
                date: "Ayer",
                image: "bg-gradient-to-br from-yellow-500 to-orange-500",
              },
              {
                id: 5,
                title: "Entrevista: Capitán del Equipo Campeón",
                category: "Entrevistas",
                date: "Hace 1 día",
                image: "bg-gradient-to-br from-purple-500 to-pink-500",
              },
              {
                id: 6,
                title: "Calendario Actualizado de Partidos",
                category: "Anuncios",
                date: "Hace 2 días",
                image: "bg-gradient-to-br from-teal-500 to-cyan-500",
              },
            ].map((news, index) => (
              <div
                key={news.id}
                className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-28 ${news.image} group-hover:scale-105 transition-transform duration-300`}></div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-primary bg-primary-100 px-2 py-0.5 rounded-full">
                      {news.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {news.date}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {news.title}
                  </h3>
                  <button className="w-full py-1.5 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary-700 hover:scale-105 transition-all text-xs">
                    VER DETALLES
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="text-primary hover:text-primary-700 font-bold text-lg flex items-center gap-2 mx-auto w-fit">
              Ver todas las noticias →
            </button>
          </div>
        </div>
      </section>

      {/* Sports Categories Information - Similitud y Simetría */}
      <section className="py-10 bg-gradient-to-b from-primary-50 to-white border-t-4 border-primary/20" id="disciplines">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-8 max-w-3xl animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-12 bg-gradient-to-b from-primary to-primary/50 rounded-full flex-shrink-0"></div>
              <div>
                <h2 className="text-2xl font-bold text-foreground leading-tight">
                  Disciplinas Deportivas
                </h2>
                <p className="text-base text-muted-foreground mt-3 font-medium max-w-2xl">
                  En SIGED podrás encontrar información completa sobre todas las
                  disciplinas deportivas que participan en Interfacultades y
                  Cachimbos.
                </p>
              </div>
            </div>
          </div>

          {/* Disciplines Grid - Similitud uniforme */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {sports.map((sport) => {
              const descriptions: Record<string, string> = {
                Fútbol:
                  "El deporte rey con partidos emocionantes entre todas las facultades.",
                Vóley: "Voleibol universitario con actuaciones de alto nivel.",
                Básquet: "Baloncesto competitivo con estrategia y velocidad.",
                Futsal: "Fútbol rápido y dinámico en espacios reducidos.",
              };
              return (
                <div
                  key={sport.name}
                  className="group flex flex-col h-full bg-white rounded-xl border-2 border-border hover:border-primary/50 p-6 text-center hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                >
                  {/* Icon area */}
                  <div className="mb-3 h-10 flex items-center justify-center text-3xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                    {sport.name === "Fútbol" && "⚽"}
                    {sport.name === "Vóley" && "🏐"}
                    {sport.name === "Básquet" && "🏀"}
                    {sport.name === "Futsal" && "🏃"}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {sport.name}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-xs mb-4 flex-1">
                    {descriptions[sport.name] ||
                      "Información de este deporte disponible en la plataforma."}
                  </p>

                  {/* Footer separator */}
                  <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full mx-auto mb-3 group-hover:w-full group-hover:via-primary transition-all"></div>

                  {/* CTA */}
                  <p className="text-xs text-primary font-bold uppercase tracking-wide group-hover:scale-110 transition-transform">
                    Ver disciplinas
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
