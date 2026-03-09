import { Link } from "react-router-dom";
import { Play, Users, Flame, Trophy, Calendar, BookOpen, Bell, TrendingUp, Shield, Clock, ChevronRight, Zap } from "lucide-react";

interface Match {
  id: number;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  sport: string;
  time: string;
  viewers: number;
  location: string;
  isLive: boolean;
}

const liveMatches: Match[] = [
  {
    id: 1,
    home: "Agronomía",
    away: "Zootecnia",
    homeScore: 3,
    awayScore: 1,
    sport: "Fútbol",
    time: "78'",
    viewers: 1234,
    location: "Estadio UNAS",
    isLive: true,
  },
];

const sports = [
  { name: "Fútbol", href: "/deportes/futbol", emoji: "⚽", color: "from-green-500 to-green-600" },
  { name: "Vóley", href: "/deportes/voley", emoji: "🏐", color: "from-yellow-500 to-yellow-600" },
  { name: "Básquet", href: "/deportes/basquet", emoji: "🏀", color: "from-orange-500 to-orange-600" },
  { name: "Futsal", href: "/deportes/futsal", emoji: "🏃", color: "from-blue-500 to-blue-600" },
];

const platformStats = [
  { label: "Torneos gestionados", value: "24", icon: Trophy },
  { label: "Equipos registrados", value: "186", icon: Shield },
  { label: "Partidos jugados", value: "1,340", icon: Play },
  { label: "Facultades activas", value: "12", icon: Users },
];

const recentActivity = [
  { icon: "⚽", text: "Agronomía marcó el 3-1 ante Zootecnia", time: "Hace 2 min", type: "gol" },
  { icon: "🏆", text: "Medicina avanzó a cuartos de final en Básquet", time: "Hace 15 min", type: "resultado" },
  { icon: "📋", text: "Se inscribió Ingeniería Civil en Futsal — Cachimbos 2026", time: "Hace 1h", type: "inscripción" },
  { icon: "📅", text: "Nuevo partido programado: Derecho vs. Enfermería — Vóley", time: "Hace 2h", type: "programación" },
  { icon: "🥇", text: "Sistemas ganó 2-0 y lidera el grupo B de Fútbol", time: "Hace 3h", type: "resultado" },
];

const quickLinks = [
  { label: "Reglamentos", icon: BookOpen, href: "/reglamentos", desc: "Normas oficiales por disciplina" },
  { label: "Próximos Partidos", icon: Calendar, href: "/partidos?tab=proximos", desc: "Programación de jornadas" },
  { label: "Palmarés", icon: Trophy, href: "/palmares", desc: "Campeones históricos" },
  { label: "Anuncios", icon: Bell, href: "/anuncios", desc: "Avisos oficiales del torneo" },
];

export default function Index() {
  return (
    <div className="w-full">

      {/* ── ANNOUNCEMENT BANNER ── */}
      <div className="bg-primary text-white text-sm py-2.5 px-4 text-center font-medium flex items-center justify-center gap-3">
        <Bell className="w-4 h-4 flex-shrink-0 animate-pulse" />
        <span>
          📢 Inscripciones para <strong>Cachimbos 2026</strong> abiertas hasta el{" "}
          <strong>15 de marzo</strong>
        </span>
      </div>

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] bg-gradient-to-br from-primary via-secondary to-primary overflow-hidden flex items-center">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                radial-gradient(circle at 80% 20%, white 1px, transparent 1px),
                radial-gradient(circle at 60% 80%, white 1px, transparent 1px)`,
              backgroundSize: "60px 60px, 80px 80px, 40px 40px",
            }}
          />
        </div>

        {/* Decorative orb */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute left-10 bottom-10 w-64 h-64 bg-accent/10 rounded-full blur-2xl" />

        <div className="container mx-auto px-4 relative z-10 py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Live pill */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-5 py-2 text-white text-sm font-semibold mb-8">
              <span className="w-2.5 h-2.5 bg-destructive rounded-full animate-pulse" />
              {liveMatches.length} partido{liveMatches.length !== 1 ? "s" : ""} en vivo ahora
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight">
              Todo el deporte{" "}
              <span>
                universitario
                <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-accent rounded-full opacity-80" />
              </span>
              , en un solo lugar.
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              SIGED centraliza la gestión de torneos, resultados, estadísticas y comunicados de la actividad deportiva de la UNAS.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/torneos?tab=activos"
                className="group px-8 py-4 bg-destructive text-white rounded-xl font-bold text-base hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Flame className="w-5 h-5" />
                Ver torneos activos
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── PLATFORM STATS ── */}
      <section className="py-12 bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {platformStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground font-medium leading-tight">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TORNEOS EN CURSO ── */}
      <section className="py-20 bg-white border-t-4 border-primary">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-3xl">
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-14 bg-gradient-to-b from-primary to-primary/50 rounded-full flex-shrink-0" />
              <div>
                <h2 className="text-4xl font-bold text-foreground leading-tight">Torneos en Curso</h2>
                <p className="text-base text-muted-foreground mt-2 font-medium">
                  Competencias activas abiertas a todas las facultades
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {[
              {
                id: 1,
                slug: "interfacultades-2026",
                title: "INTERFACULTADES 2026",
                status: "En Progreso",
                description: "La competencia deportiva más importante de la UNAS. Todas las facultades compitiendo por la gloria.",
                daysLeft: 18,
                totalTeams: 42,
                progress: 65,
              },
              {
                id: 2,
                slug: "cachimbos-2026",
                title: "CACHIMBOS 2026",
                status: "Inscripciones",
                description: "El torneo de bienvenida para los nuevos ingresantes. Muestra tu talento desde el primer ciclo.",
                daysLeft: 34,
                totalTeams: 18,
                progress: 20,
              },
            ].map((tournament) => (
              <div
                key={tournament.id}
                className="bg-white rounded-3xl p-8 shadow-sm border border-border hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      tournament.status === "En Progreso"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {tournament.status}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-foreground">Faltan {tournament.daysLeft}</p>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Días para la final</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{tournament.title}</h3>
                <p className="text-muted-foreground mb-8 line-clamp-2">{tournament.description}</p>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-foreground">Progreso del Torneo</span>
                      <span className="text-muted-foreground">{tournament.progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          tournament.status === "En Progreso" ? "bg-primary" : "bg-accent"
                        }`}
                        style={{ width: `${tournament.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <span className="font-bold">{tournament.totalTeams} Equipos</span>
                    </div>
                    <Link
                      to={`/torneo/${tournament.slug}`}
                      className="px-5 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm"
                    >
                      Ver detalles <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/torneos?tab=activos" className="text-primary hover:text-primary/80 font-bold text-base flex items-center gap-2 mx-auto w-fit">
              Ver todos los torneos →
            </Link>
          </div>
        </div>
      </section>

      {/* ── PARTIDOS HOY + ACTIVIDAD RECIENTE (2 columnas) ── */}
      <section className="py-20 bg-gradient-to-b from-white to-primary/5 border-t-4 border-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Partidos (2/3) */}
            <div className="lg:col-span-2">
              <div className="mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-1.5 h-14 bg-gradient-to-b from-secondary to-secondary/50 rounded-full flex-shrink-0" />
                  <div>
                    <h2 className="text-4xl font-bold text-foreground">Partidos Hoy</h2>
                    <p className="text-base text-muted-foreground mt-2 font-medium">Sigue los encuentros del día en tiempo real</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 mb-8">
                {liveMatches.map((match) => (
                  <div
                    key={match.id}
                    className="group bg-white border-2 border-secondary rounded-2xl overflow-hidden hover:shadow-2xl hover:border-secondary/80 transition-all duration-300"
                  >
                    <div className="bg-gradient-to-r from-destructive to-red-600 px-6 py-3.5 flex items-center justify-between text-white">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                        <span className="font-bold text-sm tracking-wide">EN VIVO</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">{match.sport}</span>
                        <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">{match.time}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-3 gap-4 items-center mb-5">
                        <div className="text-center space-y-1">
                          <p className="text-xs font-bold text-foreground/70 uppercase tracking-tight">{match.home}</p>
                          <p className="text-5xl font-black text-primary">{match.homeScore}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-light text-muted-foreground/30">VS</span>
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-xs font-bold text-foreground/70 uppercase tracking-tight">{match.away}</p>
                          <p className="text-5xl font-black text-secondary">{match.awayScore}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-dashed border-border pt-4">
                        <p className="text-xs text-muted-foreground font-medium">📍 {match.location}</p>
                        <Link
                          to={`/partidos/${match.id}`}
                          className="px-5 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                          <Play className="w-3.5 h-3.5" />
                          Ver en vivo
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Próximos partidos del día */}
                {[
                  { id: 2, home: "Medicina", away: "Derecho", sport: "Vóley", time: "15:00", location: "Coliseo UNAS" },
                  { id: 3, home: "Sistemas", away: "Ingeniería Civil", sport: "Básquet", time: "17:30", location: "Cancha 2" },
                ].map((upcoming) => (
                  <div
                    key={upcoming.id}
                    className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="bg-muted/50 px-6 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-bold text-muted-foreground">PRÓXIMO — {upcoming.time}</span>
                      </div>
                      <span className="text-xs font-bold bg-secondary/20 text-secondary px-3 py-1 rounded-full">{upcoming.sport}</span>
                    </div>
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div className="grid grid-cols-3 gap-4 items-center flex-1 max-w-xs">
                        <p className="text-sm font-bold text-center">{upcoming.home}</p>
                        <p className="text-center text-muted-foreground text-xs font-medium">VS</p>
                        <p className="text-sm font-bold text-center">{upcoming.away}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-muted-foreground hidden sm:block">📍 {upcoming.location}</p>
                        <Link
                          to={`/partidos/${upcoming.id}`}
                          className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                        >
                          Ver <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actividad Reciente (1/3) */}
            <div>
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-1">
                  <Zap className="w-6 h-6 text-accent" />
                  <h2 className="text-2xl font-bold text-foreground">Actividad Reciente</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1 font-medium ml-9">Lo último que pasó en la plataforma</p>
              </div>

              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white border border-border rounded-xl px-4 py-3.5 hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex gap-3 items-start">
                      <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug">{item.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── NOTICIAS ── */}
      <section className="py-20 bg-white border-t-4 border-accent">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-3xl">
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-14 bg-gradient-to-b from-accent to-accent/50 rounded-full flex-shrink-0" />
              <div>
                <h2 className="text-4xl font-bold text-foreground leading-tight">Últimas Noticias</h2>
                <p className="text-base text-muted-foreground mt-2 font-medium">Mantente informado de los eventos más importantes</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              {
                id: 1,
                title: "Interfacultades 2026 arranca con lleno total en el Estadio UNAS",
                category: "Noticias",
                date: "Hoy",
                image: "bg-gradient-to-br from-green-500 to-green-700",
              },
              {
                id: 2,
                title: "Medicina domina el grupo A de Básquet con tres victorias seguidas",
                category: "Resultados",
                date: "Ayer",
                image: "bg-gradient-to-br from-orange-400 to-orange-600",
              },
              {
                id: 3,
                title: "Cachimbos 2026: guía completa para inscribir tu equipo antes del plazo",
                category: "Anuncios",
                date: "Hace 2 días",
                image: "bg-gradient-to-br from-primary to-secondary",
              },
            ].map((news) => (
              <div key={news.id} className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all group">
                <div className={`h-36 ${news.image} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{news.category}</span>
                    <span className="text-xs text-muted-foreground">{news.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                    {news.title}
                  </h3>
                  <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2">
                    Leer noticia <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="text-primary hover:text-primary/80 font-bold text-base flex items-center gap-2 mx-auto w-fit">
              Ver todas las noticias →
            </button>
          </div>
        </div>
      </section>

      {/* ── DISCIPLINAS ── */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-white border-t-4 border-primary/20" id="disciplines">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-3xl">
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-14 bg-gradient-to-b from-primary to-primary/50 rounded-full flex-shrink-0" />
              <div>
                <h2 className="text-4xl font-bold text-foreground leading-tight">Disciplinas Deportivas</h2>
                <p className="text-base text-muted-foreground mt-2 font-medium max-w-2xl">
                  SIGED cubre todas las disciplinas que compiten en Interfacultades y Cachimbos. Consulta equipos, tablas y estadísticas por deporte.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sports.map((sport) => {
              const descriptions: Record<string, string> = {
                Fútbol: "El deporte rey con partidos emocionantes entre todas las facultades.",
                Vóley: "Voleibol universitario con actuaciones de alto nivel.",
                Básquet: "Baloncesto competitivo con estrategia y velocidad.",
                Futsal: "Fútbol rápido y dinámico en espacios reducidos.",
              };
              return (
                <div
                  key={sport.name}
                  className="flex flex-col h-full bg-white rounded-2xl border-2 border-border p-8 text-center"
                >
                  <div className="mb-4 h-14 flex items-center justify-center text-4xl">{sport.emoji}</div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{sport.name}</h3>
                  <p className="text-muted-foreground text-sm flex-1">{descriptions[sport.name]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}