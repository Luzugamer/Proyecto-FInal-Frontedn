import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Trophy } from "lucide-react";
import { getMatchesByTournament } from "@/lib/mockMatches";

interface CalendarioTabProps {
  tournamentSlug: string;
}

export function CalendarioTab({ tournamentSlug }: CalendarioTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
  const matches = getMatchesByTournament(tournamentSlug);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const matchDate = new Date(match.date);
      return (
        matchDate.getMonth() === currentDate.getMonth() &&
        matchDate.getFullYear() === currentDate.getFullYear()
      );
    });
  }, [matches, currentDate]);

  const getMatchesForDay = (day: number) => {
    const dateStr = `2026-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return filteredMatches.filter((match) => match.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthName = currentDate.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1),
  );

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">
          No hay partidos programados aún
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      {/* Month Navigation */}
      <div className="flex items-center justify-between p-6 border-b border-border bg-primary-50">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>
        <h2 className="text-2xl font-bold text-foreground capitalize">
          {monthName}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-primary" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sab"].map((day) => (
            <div
              key={day}
              className="text-center font-bold text-muted-foreground text-sm p-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => (
            <div
              key={idx}
              className={`min-h-24 p-2 border rounded-lg transition-colors ${
                day === null
                  ? "bg-muted"
                  : "bg-white hover:bg-primary-50 border-border cursor-pointer"
              }`}
            >
              {day && (
                <>
                  <p className="font-bold text-foreground mb-2">{day}</p>
                  <div className="space-y-1">
                    {getMatchesForDay(day).map((match) => (
                      <div
                        key={match.id}
                        className="text-xs bg-primary text-primary-foreground p-1 rounded cursor-pointer hover:bg-primary-600 transition-colors"
                        title={`${match.home} vs ${match.away}`}
                      >
                        <p className="font-bold truncate">{match.time}</p>
                        <p className="truncate">{match.home.split(' ')[0]}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
