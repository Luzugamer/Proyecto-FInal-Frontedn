import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download, Zap, Trophy, Users, Calendar as CalendarIcon, Grid3x3, List } from "lucide-react";
import { mockTournaments } from "@/lib/mockTournaments";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1));
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Get unique sports
  const sports = Array.from(
    new Set(mockTournaments.flatMap((t) => t.disciplinas)),
  ).sort();

  const filteredTournaments = mockTournaments.filter((tournament) => {
    if (!selectedSport) return true;
    return tournament.disciplinas.some(d => d.includes(selectedSport));
  });

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDownloadPDF = () => {
    const content = `CALENDARIO DE TORNEOS - ${currentMonth.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}\n\n`;
    const data = filteredTournaments
      .map(
        (t) =>
          `${t.nombre} (${t.tipo}) - Del ${new Date(t.fechaCompetenciaInicio).toLocaleDateString("es-ES")} al ${new Date(t.fechaCompetenciaFin).toLocaleDateString("es-ES")}`
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

  return (
    <div className="w-full bg-gradient-to-b from-primary-50 to-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <div className="flex items-start gap-4">
            <div className="w-1.5 h-16 bg-gradient-to-b from-primary to-primary/50 rounded-full flex-shrink-0"></div>
            <div>
              <h1 className="text-5xl font-bold text-foreground leading-tight">Calendario de Torneos</h1>
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
        <section className="mb-16 bg-white rounded-2xl border-2 border-primary/20 p-8 hover:border-primary/50 transition-all">
          <div className="mb-8">
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
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => {
                  const dateStr = day ? `2026-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null;
                  const tournamentsOnDay = dateStr ? filteredTournaments.filter(t => {
                    const startDate = new Date(t.fechaCompetenciaInicio).toISOString().split('T')[0];
                    const endDate = new Date(t.fechaCompetenciaFin).toISOString().split('T')[0];
                    return dateStr >= startDate && dateStr <= endDate;
                  }) : [];

                  return (
                    <div
                      key={idx}
                      className={`min-h-28 p-2 border-2 rounded-xl transition-all ${
                        day === null
                          ? "bg-muted/30 border-transparent"
                          : "bg-white border-border hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      {day && (
                        <>
                          <p className="font-bold text-foreground mb-2 text-sm">{day}</p>
                          <div className="space-y-1">
                            {tournamentsOnDay.map((tournament) => (
                              <Link
                                key={tournament.id}
                                to={`/torneo/${tournament.slug}`}
                                className="block text-xs bg-primary text-primary-foreground p-1.5 rounded-md hover:bg-primary-600 transition-colors truncate font-semibold"
                                title={tournament.nombre}
                              >
                                {tournament.nombre.slice(0, 15)}...
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
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
                const startDate = new Date(tournament.fechaCompetenciaInicio);
                const endDate = new Date(tournament.fechaCompetenciaFin);

                return (
                  <Link
                    key={tournament.id}
                    to={`/torneo/${tournament.slug}`}
                    className="flex flex-col h-full bg-white rounded-2xl border-2 border-border hover:border-secondary/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className="p-6 flex items-start gap-4 md:gap-6">
                      {/* Tournament Icon - Figura-Fondo */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center text-3xl border-2 border-secondary/30 group-hover:border-secondary/50 transition-colors">
                        {tournament.tipo === "olimpiada" && "🏆"}
                        {tournament.tipo === "copa" && "🏅"}
                        {tournament.tipo === "campeonato" && "⚽"}
                        {tournament.tipo === "amistoso" && "🤝"}
                      </div>

                      {/* Tournament Info */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-secondary transition-colors">
                              {tournament.nombre}
                            </h3>
                            <p className="text-sm text-muted-foreground capitalize font-medium">
                              {tournament.tipo}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
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
                        </div>

                        {/* Dates and Stats - Región Común */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5 pb-5 border-b-2 border-dashed border-secondary/20">
                          <div>
                            <p className="text-xs text-muted-foreground font-bold uppercase mb-1.5">Inicio</p>
                            <p className="font-semibold text-foreground text-sm">
                              {startDate.toLocaleDateString("es-ES")}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-bold uppercase mb-1.5">Fin</p>
                            <p className="font-semibold text-foreground text-sm">
                              {endDate.toLocaleDateString("es-ES")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-primary flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Disciplinas</p>
                              <p className="font-bold text-foreground">{tournament.disciplinas.length}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-secondary flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Equipos</p>
                              <p className="font-bold text-foreground">{tournament.totalEquipos}</p>
                            </div>
                          </div>
                        </div>

                        {/* Disciplines - Similitud */}
                        <div className="flex flex-wrap gap-2">
                          {tournament.disciplinas.slice(0, 4).map((d) => (
                            <span
                              key={d}
                              className="text-xs font-bold bg-secondary-100 text-secondary px-3 py-1.5 rounded-lg hover:bg-secondary/20 transition-colors"
                            >
                              {d}
                            </span>
                          ))}
                          {tournament.disciplinas.length > 4 && (
                            <span className="text-xs font-bold text-muted-foreground px-3 py-1.5">
                              +{tournament.disciplinas.length - 4}
                            </span>
                          )}
                        </div>
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
