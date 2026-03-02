import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMatches } from "@/hooks/useMatches";
import { LoadingSpinner } from "@/components/common/StateComponents";
import { Link } from "react-router-dom";

type TabType = "proximos" | "resultados" | "torneos";

export default function CalendarCompact() {
  const [activeTab, setActiveTab] = useState<TabType>("proximos");
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: matches, isLoading } = useMatches();

  // Obtener partidos próximos
  const upcomingMatches = matches?.filter(m => m.status === "scheduled").slice(0, 3) || [];
  
  // Obtener resultados recientes
  const recentResults = matches?.filter(m => m.status === "finished").slice(0, 4) || [];

  // Generar días del calendario
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Días vacíos antes del primer día
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Días del mes
    for (let i = 1; i <= daysCount; i++) {
      days.push(i);
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-PE", { day: "numeric", month: "short" }).toUpperCase();
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
  };

  const monthName = currentDate.toLocaleDateString("es-ES", { 
    month: "long", 
    year: "numeric" 
  });

  const today = new Date();
  const todayFormatted = today.toLocaleDateString("es-ES", { 
    weekday: "long", 
    day: "numeric", 
    month: "long" 
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white min-h-screen">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">UNAS Deportes</h1>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-8 mb-6 border-b">
        <button
          onClick={() => setActiveTab("proximos")}
          className={`pb-3 px-2 font-semibold text-sm transition-colors relative ${
            activeTab === "proximos" 
              ? "text-green-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Próximos
          {activeTab === "proximos" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("resultados")}
          className={`pb-3 px-2 font-semibold text-sm transition-colors relative ${
            activeTab === "resultados" 
              ? "text-green-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Resultados
          {activeTab === "resultados" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("torneos")}
          className={`pb-3 px-2 font-semibold text-sm transition-colors relative ${
            activeTab === "torneos" 
              ? "text-green-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Torneos
          {activeTab === "torneos" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
          )}
        </button>
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            {/* Navegación de mes */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-sm font-bold text-gray-800 capitalize">{monthName}</h2>
              <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth().map((day, index) => {
                const isToday = day === today.getDate() && 
                               currentDate.getMonth() === today.getMonth() &&
                               currentDate.getFullYear() === today.getFullYear();
                
                return (
                  <div
                    key={index}
                    className={`aspect-square flex items-center justify-center text-sm rounded ${
                      day === null 
                        ? "" 
                        : isToday 
                        ? "bg-green-500 text-white font-bold" 
                        : "hover:bg-gray-100 cursor-pointer text-gray-700"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
      </div>

      {/* Contenido según tab activo */}
      {activeTab === "proximos" && (
              <>
                {/* Hoy */}
                <h3 className="text-sm font-bold text-gray-800 mb-3 capitalize">
                  Hoy, {todayFormatted}
                </h3>

                {/* Partidos próximos */}
                <div className="space-y-3">
                  {upcomingMatches.map((match) => (
                    <Link
                      key={match.id}
                      to={`/partidos/${match.id}`}
                      className="block bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold uppercase">{match.tournamentId}</span>
                        <span className="text-xs font-semibold">
                          {formatTime(match.date)} • {match.location}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center flex-1">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-1">
                            <span className="text-xs font-bold">🏆</span>
                          </div>
                          <span className="text-xs font-semibold text-center">{match.home}</span>
                        </div>

                        <div className="px-4">
                          <span className="text-2xl font-bold">VS</span>
                        </div>

                        <div className="flex flex-col items-center flex-1">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-1">
                            <span className="text-xs font-bold">⚽</span>
                          </div>
                          <span className="text-xs font-semibold text-center">{match.away}</span>
                        </div>
                      </div>

                      <button className="mt-3 w-full bg-white text-green-600 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
                        Ver Detalles
                      </button>
                    </Link>
                  ))}
                </div>
              </>
            )}

      {activeTab === "resultados" && (
        <>
                <h3 className="text-sm font-bold text-gray-800 mb-3">
                  Resultados Recientes
                </h3>

                <div className="space-y-3">
                  {recentResults.map((match) => (
                    <Link
                      key={match.id}
                      to={`/partidos/${match.id}`}
                      className="block bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500 font-semibold uppercase">
                          Finalizado • {formatDate(match.date)}
                        </span>
                        <span className="text-xs text-gray-600 font-semibold uppercase">
                          {match.tournamentId}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Equipo local */}
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs">🏆</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-800 truncate">
                            {match.home}
                          </span>
                        </div>

                        {/* Marcador */}
                        <div className="flex items-center gap-2 px-4">
                          <span className={`text-xl font-bold ${
                            match.homeScore > match.awayScore ? "text-green-600" : "text-gray-700"
                          }`}>
                            {match.homeScore}
                          </span>
                          <span className="text-gray-400">-</span>
                          <span className={`text-xl font-bold ${
                            match.awayScore > match.homeScore ? "text-green-600" : "text-gray-700"
                          }`}>
                            {match.awayScore}
                          </span>
                        </div>

                        {/* Equipo visitante */}
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          <span className="text-sm font-semibold text-gray-800 truncate text-right">
                            {match.away}
                          </span>
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs">⚽</span>
                          </div>
                        </div>
                      </div>

                      {/* Indicador de ganador */}
                      {match.homeScore !== match.awayScore && (
                        <div className="mt-2 flex justify-center">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </>
            )}

      {activeTab === "torneos" && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">
            Vista de torneos próximamente
          </p>
        </div>
      )}
    </div>
  );
}
