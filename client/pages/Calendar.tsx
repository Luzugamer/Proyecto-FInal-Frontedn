import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download, Zap, Trophy, Users, Calendar as CalendarIcon, Grid3x3, List, X } from "lucide-react";
import { useTournaments } from "@/hooks/useTournaments";
import { LoadingSpinner, ErrorState } from "@/components/common/StateComponents";
import type { Tournament } from "@/schemas/tournament.schema";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1));
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Usar hook para obtener torneos
  const { data: allTournaments, isLoading, error } = useTournaments();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Get unique sports from tournaments
  const sports = allTournaments 
    ? Array.from(new Set(allTournaments.flatMap((t) => t.disciplinas || []))).sort()
    : [];

  const filteredTournaments = allTournaments?.filter((tournament) => {
    if (!selectedSport) return true;
    return tournament.disciplinas?.some(s => s.includes(selectedSport));
  }) || [];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDownloadPDF = () => {
    if (!filteredTournaments.length) return;
    
    const content = `CALENDARIO DE TORNEOS - ${currentMonth.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}\n\n`;
    const data = filteredTournaments
      .map(
        (t) =>
          `${t.nombre} (${t.tipo}) - Del ${t.fechaCompetenciaInicio ? new Date(t.fechaCompetenciaInicio).toLocaleDateString("es-ES") : 'N/A'} al ${t.fechaCompetenciaFin ? new Date(t.fechaCompetenciaFin).toLocaleDateString("es-ES") : 'N/A'}`
      )
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content + data)
    );
    element.setAttribute(
      "download",
      `torneos-${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}.txt`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const monthName = currentMonth.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const calendarDays = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  // Helper para obtener torneos de un día
  const getTournamentsForDay = (day: number): Tournament[] => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return filteredTournaments.filter(t => {
      if (!t.fechaCompetenciaInicio || !t.fechaCompetenciaFin) return false;
      const startDate = new Date(t.fechaCompetenciaInicio).toISOString().split('T')[0];
      const endDate = new Date(t.fechaCompetenciaFin).toISOString().split('T')[0];
      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  // Estados de loading y error
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4">
        <ErrorState
          title="Error al cargar torneos"
          message="No se pudieron cargar los torneos para el calendario"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Debug: verificar datos
  console.log('Calendar Debug:', { 
    allTournaments: allTournaments?.length, 
    filteredTournaments: filteredTournaments.length,
    isLoading,
    error 
  });

  return (
    <div className="w-full bg-gradient-to-b from-primary-50 to-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <div className="flex items-start gap-4">
            <div className="w-1.5 h-12 bg-gradient-to-b from-primary to-primary/50 rounded-full flex-shrink-0"></div>
            <div>
              <h1 className="text-3xl font-bold text-foreground leading-tight">Calendario de Torneos</h1>
              <p className="text-base text-muted-foreground mt-3 font-medium">
                Visualiza todos los torneos programados
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 1: Download, View Mode and Filter Controls */}
        <div className="mb-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3 items-center">
            {/* Download Button */}
            <button
              onClick={handleDownloadPDF}
              className="py-3 px-6 bg-destructive text-white rounded-xl font-bold hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Descargar</span>
            </button>

            {/* View Mode Selector - Región Común y Similitud */}
            <div className="flex items-center gap-2 p-1 bg-muted rounded-xl border-2 border-border hover:border-primary/50 transition-colors">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-lg transition-all font-bold flex items-center justify-center ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Vista de cuadrícula"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-lg transition-all font-bold flex items-center justify-center ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Vista de lista"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sport Filter */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-bold text-foreground whitespace-nowrap">Filtrar por deporte:</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="px-4 py-3 border-2 border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white font-medium transition-all hover:border-primary/40"
            >
              <option value="">Todos</option>
              {sports.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SECTION 2: View Content - Grid or List */}
        {viewMode === "grid" && (
        <section className="mb-16">
          {/* Layout de dos columnas en desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna izquierda: Calendario */}
            <div className="bg-white rounded-2xl border-2 border-primary/20 p-8 hover:border-primary/50 transition-all">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <CalendarIcon className="w-6 h-6 text-primary" />
                Vista de Calendario
              </h2>

              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-8 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl">
                <button
                  onClick={handlePrevMonth}
                  className="p-2.5 hover:bg-primary/20 rounded-lg transition-colors text-primary font-bold"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h3 className="text-2xl font-bold text-foreground capitalize text-center flex-1">{monthName}</h3>
                <button
                  onClick={handleNextMonth}
                  className="p-2.5 hover:bg-primary/20 rounded-lg transition-colors text-primary font-bold"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-xl border-2 border-border p-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sab"].map((day) => (
                  <div key={day} className="text-center font-bold text-muted-foreground text-sm p-3 bg-muted rounded-lg">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {calendarDays.map((day, idx) => {
                  if (!day) {
                    return (
                      <div
                        key={idx}
                        className="aspect-square md:min-h-20 bg-muted/30 rounded-lg"
                      />
                    );
                  }

                  const tournamentsOnDay = getTournamentsForDay(day);
                  const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isSelected = selectedDate === dateStr;
                  const hasEvents = tournamentsOnDay.length > 0;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                      className={`aspect-square md:min-h-20 p-1.5 md:p-2 border-2 rounded-lg transition-all ${
                        isSelected
                          ? "bg-primary/10 border-primary ring-2 ring-primary/30"
                          : hasEvents
                          ? "bg-white border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                          : "bg-white border-border hover:bg-muted/20"
                      }`}
                    >
                      <div className="h-full flex flex-col">
                        <p className={`font-bold text-xs md:text-sm mb-1 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {day}
                        </p>
                        
                        {/* Indicadores de torneos - puntos de colores */}
                        {hasEvents && (
                          <div className="flex flex-wrap gap-0.5 md:gap-1 mt-auto">
                            {tournamentsOnDay.slice(0, 6).map((tournament, i) => {
                              // Colores según el estado
                              const getColor = () => {
                                if (tournament.estado === 'en_curso') return 'bg-destructive';
                                if (tournament.estado === 'inscripciones') return 'bg-secondary';
                                return 'bg-primary';
                              };

                              return (
                                <div
                                  key={tournament.id}
                                  className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${getColor()}`}
                                  title={tournament.nombre}
                                />
                              );
                            })}
                            {tournamentsOnDay.length > 6 && (
                              <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground">
                                +{tournamentsOnDay.length - 6}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Columna derecha: Detalles del día seleccionado y torneos */}
          <div className="bg-white rounded-2xl border-2 border-primary/20 p-8 hover:border-primary/50 transition-all">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Trophy className="w-6 h-6 text-primary" />
              Torneos
            </h2>

            {/* Panel de Detalles del Día Seleccionado */}
            {selectedDate ? (
              <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/30 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    {new Date(selectedDate).toLocaleDateString("es-ES", { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
                    aria-label="Cerrar detalles"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {(() => {
                  const day = parseInt(selectedDate.split('-')[2]);
                  const tournamentsOnDay = getTournamentsForDay(day);

                  if (tournamentsOnDay.length === 0) {
                    return (
                      <p className="text-sm text-muted-foreground font-medium py-4 text-center">
                        No hay torneos programados para este día
                      </p>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {tournamentsOnDay.map((tournament) => (
                        <Link
                          key={tournament.id}
                          to={`/torneo/${tournament.slug}`}
                          className="block bg-white p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all hover:shadow-md group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                {tournament.nombre}
                              </h4>
                              <p className="text-xs text-muted-foreground capitalize mb-2">
                                {tournament.tipo}
                              </p>
                              {tournament.disciplinas && tournament.disciplinas.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {tournament.disciplinas.slice(0, 3).map((sport) => (
                                    <span
                                      key={sport}
                                      className="text-xs font-semibold bg-primary-100 text-primary px-2 py-0.5 rounded"
                                    >
                                      {sport}
                                    </span>
                                  ))}
                                  {tournament.disciplinas.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{tournament.disciplinas.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              {tournament.estado === 'en_curso' && (
                                <span className="inline-flex items-center gap-1 bg-destructive text-white px-2 py-1 rounded-full text-xs font-bold">
                                  <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                  EN VIVO
                                </span>
                              )}
                              {tournament.estado === 'inscripciones' && (
                                <span className="bg-secondary text-white px-2 py-1 rounded-full text-xs font-bold">
                                  INSCRIPCIONES
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-medium py-4 text-center">
                Selecciona un día en el calendario para ver los torneos programados
              </p>
            )}
          </div>
        </div>
        </section>
        )}

        {viewMode === "list" && (
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Trophy className="w-6 h-6 text-secondary" />
              Torneos Disponibles
            </h2>
          </div>

          <div className="space-y-4">
            {filteredTournaments.length > 0 ? (
              filteredTournaments.map((tournament) => {
                const startDate = tournament.fechaCompetenciaInicio ? new Date(tournament.fechaCompetenciaInicio) : null;
                const endDate = tournament.fechaCompetenciaFin ? new Date(tournament.fechaCompetenciaFin) : null;

                return (
                  <Link
                    key={tournament.id}
                    to={`/torneo/${tournament.slug}`}
                    className="flex flex-col h-full bg-white rounded-2xl border-2 border-border hover:border-secondary/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className="p-6 flex items-start gap-4 md:gap-6">
                      {/* Tournament Icon - Figura-Fondo */}
                      <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center text-2xl md:text-3xl border-2 border-secondary/30 group-hover:border-secondary/50 transition-colors">
                        {tournament.tipo === "olimpiada" && "🏆"}
                        {tournament.tipo === "copa" && "🏅"}
                        {tournament.tipo === "campeonato" && "⚽"}
                        {tournament.tipo === "amistoso" && "🤝"}
                      </div>

                      {/* Tournament Info */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-base md:text-lg font-bold text-foreground mb-1 group-hover:text-secondary transition-colors">
                              {tournament.nombre}
                            </h3>
                            <p className="text-xs md:text-sm text-muted-foreground capitalize font-medium">
                              {tournament.tipo}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {tournament.estado === "en_curso" && (
                              <span className="inline-flex items-center gap-1 bg-destructive text-white px-2 md:px-3 py-1 rounded-full text-xs font-bold">
                                <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                EN CURSO
                              </span>
                            )}
                            {tournament.estado === "inscripciones" && (
                              <span className="inline-flex items-center gap-1 bg-secondary text-white px-2 md:px-3 py-1 rounded-full text-xs font-bold">
                                INSCRIPCIONES
                              </span>
                            )}
                            {tournament.estado === "finalizado" && (
                              <span className="inline-flex items-center gap-1 bg-muted-foreground text-white px-2 md:px-3 py-1 rounded-full text-xs font-bold">
                                FINALIZADO
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Dates and Stats - Región Común */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5 pb-5 border-b-2 border-dashed border-secondary/20">
                          <div>
                            <p className="text-xs text-muted-foreground font-bold uppercase mb-1.5">Inicio</p>
                            <p className="font-semibold text-foreground text-sm">
                              {startDate ? startDate.toLocaleDateString("es-ES") : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-bold uppercase mb-1.5">Fin</p>
                            <p className="font-semibold text-foreground text-sm">
                              {endDate ? endDate.toLocaleDateString("es-ES") : 'N/A'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-primary flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Disciplinas</p>
                              <p className="font-bold text-foreground">{tournament.disciplinas?.length || 0}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-secondary flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Equipos</p>
                              <p className="font-bold text-foreground">{tournament.totalEquipos || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Disciplines - Similitud */}
                        {tournament.disciplinas && tournament.disciplinas.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {tournament.disciplinas.slice(0, 4).map((d) => (
                              <span
                                key={d}
                                className="text-xs font-bold bg-secondary-100 text-secondary px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-secondary/20 transition-colors"
                              >
                                {d}
                              </span>
                            ))}
                            {tournament.disciplinas.length > 4 && (
                              <span className="text-xs font-bold text-muted-foreground px-2 md:px-3 py-1 md:py-1.5">
                                +{tournament.disciplinas.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-border">
                <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground font-medium">
                  No hay torneos con esos filtros
                </p>
              </div>
            )}
          </div>
        </section>
        )}

        {/* Month Navigation for Reference */}
        <div className="bg-white rounded-2xl border-2 border-border p-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2.5 hover:bg-primary-100 rounded-xl transition-colors text-primary font-bold"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-foreground capitalize text-center flex-1">{monthName}</h2>
            <button
              onClick={handleNextMonth}
              className="p-2.5 hover:bg-primary-100 rounded-xl transition-colors text-primary font-bold"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground text-center font-medium">
            Usa los botones para navegar entre meses y ver los torneos programados
          </p>
        </div>
      </div>
    </div>
  );
}
