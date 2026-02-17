import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Trophy,
  Users,
  Zap,
  Search,
  X,
  Plus,
  RotateCcw,
  Filter,
} from "lucide-react";
import {
  mockTournaments,
  getTournamentTypeEmoji,
  TournamentType,
} from "@/lib/mockTournaments";
import { useAuth } from "@/hooks/useAuth";
import CreateTournamentModal from "@/components/tournament/modals/CreateTournamentModal";

export default function Tournaments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const tabFromParams = searchParams.get("tab") || "activos";
  const [activeTab, setActiveTab] = useState<
    "activos" | "proximos" | "finalizados"
  >(tabFromParams as "activos" | "proximos" | "finalizados");

  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Verificar si el usuario tiene rol de Administrador o Super Administrador
  const isAdmin =
    user?.rol && ["ADMINISTRADOR", "SUPER_ADMIN"].includes(user.rol);

  const handleTabChange = (tab: "activos" | "proximos" | "finalizados") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Obtener arrays únicos para filtros
  // Simplificar disciplinas a solo base (Futsal, Fútbol, Voley, Basquet)
  const disciplines = ["Futsal", "Fútbol", "Voley", "Básquet"];

  const types = Array.from(new Set(mockTournaments.map((t) => t.tipo)));

  const years = Array.from(
    new Set(mockTournaments.map((t) => t.fechaCompetenciaInicio.slice(0, 4))),
  ).sort((a, b) => b.localeCompare(a));

  const filteredTournaments = useMemo(() => {
    return mockTournaments.filter((tournament) => {
      const statusMatch =
        (activeTab === "activos" && tournament.estado === "en_curso") ||
        (activeTab === "proximos" && tournament.estado === "inscripciones") ||
        (activeTab === "finalizados" && tournament.estado === "finalizado");

      const disciplineMatch =
        !selectedDiscipline ||
        tournament.disciplinas.some((d) => d.includes(selectedDiscipline));

      const typeMatch = !selectedType || tournament.tipo === selectedType;

      const yearMatch =
        !selectedYear ||
        tournament.fechaCompetenciaInicio.startsWith(selectedYear);

      const textMatch =
        !searchText ||
        tournament.nombre.toLowerCase().includes(searchText.toLowerCase());

      return (
        statusMatch && disciplineMatch && typeMatch && yearMatch && textMatch
      );
    });
  }, [activeTab, selectedDiscipline, selectedType, selectedYear, searchText]);

  return (
    <div className="w-full bg-gradient-to-b from-primary-50 to-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Admin Hero Section */}
        {isAdmin && (
          <div className="mb-12 bg-gradient-to-r from-primary-700 to-primary-600 rounded-2xl p-12 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-5xl mb-3">🏆</div>
                <h2 className="text-3xl font-bold mb-2">
                  ADMINISTRACIÓN DE TORNEOS
                </h2>
                <p className="text-primary-100">
                  Control total de olimpiadas y competencias
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-primary-900 font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-transform hover:scale-105 shadow-lg text-lg"
              >
                <Plus className="w-5 h-5" />
                CREAR NUEVO TORNEO
              </button>
            </div>
          </div>
        )}

        {/* Header - Proximidad y Continuidad */}
        <div className="mb-16">
          <div className="flex items-start gap-4">
            <div className="w-1.5 h-16 bg-gradient-to-b from-primary via-primary to-primary/50 rounded-full flex-shrink-0"></div>
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-3 leading-tight">
                Torneos Deportivos
              </h1>
              <p className="text-base text-muted-foreground font-medium max-w-2xl">
                Vive la emoción de las competencias universitarias más esperadas
                del año
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-border">
          {["activos", "proximos", "finalizados"].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                handleTabChange(tab as "activos" | "proximos" | "finalizados")
              }
              className={`whitespace-nowrap px-6 py-3 font-bold transition-colors ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "activos" && "🔥 En Curso"}
              {tab === "proximos" && "📅 Próximamente"}
              {tab === "finalizados" && "✅ Finalizados"}
            </button>
          ))}
        </div>

        {/* Search & Collapsible Filters Section */}
        <div className="mb-12 animate-fade-in">
          {/* Search Bar with Filter Toggle */}
          <div className="flex gap-3 mb-6">
            <div className="relative group flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/70 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="🔍 Buscar torneo por nombre..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 md:py-4 text-base md:text-lg border-2 border-primary/20 rounded-2xl focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/20 bg-white transition-all duration-300 hover:border-primary/40"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3.5 md:py-4 border-2 rounded-2xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                showFilters
                  ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-white border-primary/20 text-foreground hover:border-primary/40"
              }`}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="bg-gradient-to-br from-white via-primary-50/30 to-white rounded-2xl border-2 border-primary/10 p-6 md:p-8 shadow-lg shadow-primary/5 backdrop-blur-sm animate-fade-in mb-6">
              {/* Filters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Deporte Filter - Compact */}
                <div className="group">
                  <label className="block text-sm font-bold text-foreground mb-2.5 flex items-center gap-2">
                    <span className="text-lg">⚽</span>
                    Deporte
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDiscipline}
                      onChange={(e) => setSelectedDiscipline(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-all duration-300 hover:border-primary/40 cursor-pointer font-medium appearance-none text-sm"
                    >
                      <option value="">Todos</option>
                      {disciplines.sort().map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Tipo Filter */}
                <div className="group">
                  <label className="block text-sm font-bold text-foreground mb-2.5 flex items-center gap-2">
                    <span className="text-lg">🏆</span>
                    Tipo
                  </label>
                  <div className="relative">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-all duration-300 hover:border-primary/40 cursor-pointer font-medium appearance-none text-sm"
                    >
                      <option value="">Todos</option>
                      {(
                        ["olimpiada", "copa", "campeonato", "amistoso"] as const
                      )
                        .filter((t) => types.includes(t))
                        .map((t) => (
                          <option key={t} value={t}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Año Filter */}
                <div className="group">
                  <label className="block text-sm font-bold text-foreground mb-2.5 flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    Año
                  </label>
                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-all duration-300 hover:border-primary/40 cursor-pointer font-medium appearance-none text-sm"
                    >
                      <option value="">Todos</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedDiscipline("");
                      setSelectedType("");
                      setSelectedYear("");
                    }}
                    disabled={
                      !selectedDiscipline && !selectedType && !selectedYear
                    }
                    className="w-full px-4 py-2.5 border-2 border-dashed border-primary/30 hover:border-primary/60 rounded-xl font-bold text-primary hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Limpiar</span>
                  </button>
                </div>
              </div>

              {/* Active Filters & Results */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-primary/10">
                {/* Active Filters Tags */}
                <div className="flex flex-wrap gap-2 items-center">
                  {(selectedDiscipline || selectedType || selectedYear) && (
                    <span className="text-xs font-bold text-muted-foreground">
                      Filtros activos:
                    </span>
                  )}
                  {selectedDiscipline && (
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-3 py-1 text-xs font-medium text-primary animate-scale-in">
                      {selectedDiscipline}
                      <button
                        onClick={() => setSelectedDiscipline("")}
                        className="ml-1 hover:text-primary/70 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {selectedType && (
                    <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-full px-3 py-1 text-xs font-medium text-secondary animate-scale-in">
                      {selectedType}
                      <button
                        onClick={() => setSelectedType("")}
                        className="ml-1 hover:text-secondary/70 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {selectedYear && (
                    <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-3 py-1 text-xs font-medium text-accent animate-scale-in">
                      {selectedYear}
                      <button
                        onClick={() => setSelectedYear("")}
                        className="ml-1 hover:text-accent/70 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Results Counter */}
                <div className="text-sm font-bold text-muted-foreground">
                  <span className="text-primary">
                    {filteredTournaments.length}
                  </span>{" "}
                  {filteredTournaments.length === 1 ? "torneo" : "torneos"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTournaments.length > 0 ? (
            filteredTournaments.map((tournament) => (
              <Link
                key={tournament.id}
                to={`/torneo/${tournament.slug}`}
                className="flex flex-col h-full bg-white rounded-2xl border-2 border-border hover:border-primary/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
              >
                {/* Header - Figura-Fondo con separación clara */}
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 py-6 border-b-2 border-border/50">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-5xl opacity-90 group-hover:opacity-100 transition-opacity">
                      {getTournamentTypeEmoji(
                        tournament.tipo.toLowerCase() as TournamentType,
                      )}
                    </span>
                    {tournament.estado === "en_curso" && (
                      <span className="inline-flex items-center gap-1 bg-destructive text-white px-3 py-1 rounded-full text-xs font-bold">
                        <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        EN CURSO
                      </span>
                    )}
                    {tournament.estado === "inscripciones" && (
                      <span className="inline-flex items-center gap-1 bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold">
                        INSCRIPCIONES
                      </span>
                    )}
                    {tournament.estado === "finalizado" && (
                      <span className="inline-flex items-center gap-1 bg-muted-foreground text-white px-3 py-1 rounded-full text-xs font-bold">
                        FINALIZADO
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {tournament.nombre}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {tournament.tipo}
                  </p>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Title and Type */}
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {tournament.nombre}
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4 capitalize">
                    {tournament.tipo}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-5 line-clamp-2 flex-1">
                    {tournament.descripcion}
                  </p>

                  {/* Disciplines - Similitud visual */}
                  <div className="flex flex-wrap gap-2 mb-5 pb-5 border-b-2 border-dashed border-primary/20">
                    {tournament.disciplinas.slice(0, 3).map((d) => (
                      <span
                        key={d}
                        className="text-xs font-bold bg-primary-100 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        {d}
                      </span>
                    ))}
                    {tournament.disciplinas.length > 3 && (
                      <span className="text-xs font-bold text-muted-foreground px-3 py-1.5">
                        +{tournament.disciplinas.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Stats - Región Común */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Disciplinas
                          </p>
                          <p className="font-bold">
                            {tournament.disciplinas.length}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-secondary" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Equipos
                          </p>
                          <p className="font-bold">{tournament.totalEquipos}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                        <Zap className="w-5 h-5 text-accent flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-tight mb-0.5">
                            {tournament.estado === "finalizado" && "Estado"}
                            {tournament.estado === "en_curso" && "Progreso"}
                            {tournament.estado === "inscripciones" && "Registros"}
                          </p>
                          <p className="font-bold text-foreground text-sm">
                            {tournament.estado === "finalizado" && "Completado"}
                            {tournament.estado === "en_curso" && `${tournament.partidosJugados} partidos`}
                            {tournament.estado === "inscripciones" && "Abierto"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Button - Cierre y Continuidad */}
                  <button className="w-full py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold rounded-xl hover:from-primary hover:to-primary transition-all duration-300 group-hover:shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide text-sm">
                    Ver Detalles
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                No se encontraron torneos con los filtros aplicados.
              </p>
            </div>
          )}
        </div>

        {/* FAB Button - Floating Action Button */}
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-primary-700 hover:bg-primary-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-40"
            title="Crear Nuevo Torneo"
          >
            <Plus className="w-8 h-8" />
          </button>
        )}
      </div>

      {/* Create Tournament Modal */}
      <CreateTournamentModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}
