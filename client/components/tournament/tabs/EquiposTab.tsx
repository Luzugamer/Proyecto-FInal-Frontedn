import { useState, useMemo } from "react";
import { ChevronDown, Users } from "lucide-react";
import { Tournament } from "@/lib/mockTournaments";

interface EquiposTabProps {
  tournament: Tournament;
}

interface TeamByDiscipline {
  disciplina: string;
  teams: {
    id: string;
    nombre: string;
    facultad: string;
  }[];
}

// Mock data de equipos por disciplina
const getMockTeamsData = (tournament: Tournament): TeamByDiscipline[] => {
  const teamsByDiscipline: Record<string, any[]> = {};

  // Inicializar para cada disciplina
  tournament.disciplinas.forEach((disciplina) => {
    teamsByDiscipline[disciplina] = [];
  });

  // Equipos base que se distribuyen entre disciplinas
  const baseTeams = [
    { facultad: "Agronomía", id: "ag" },
    { facultad: "Ingeniería", id: "ing" },
    { facultad: "Zootecnia", id: "zoo" },
    { facultad: "Economía", id: "econ" },
    { facultad: "Enfermería", id: "enf" },
    { facultad: "Forestales", id: "for" },
    { facultad: "Ciencias Sociales", id: "cs" },
    { facultad: "Educación", id: "edu" },
    { facultad: "Medicina", id: "med" },
    { facultad: "Derecho", id: "der" },
  ];

  // Distribuir equipos entre disciplinas
  let teamIndex = 0;
  tournament.disciplinas.forEach((disciplina) => {
    for (let i = 0; i < 3; i++) {
      if (teamIndex < baseTeams.length) {
        const team = baseTeams[teamIndex];
        teamsByDiscipline[disciplina].push({
          id: `${team.id}-${disciplina}`,
          nombre: `${team.facultad} ${disciplina.split(" ")[0]}`,
          facultad: team.facultad,
        });
        teamIndex++;
      }
    }
  });

  return tournament.disciplinas.map((disciplina) => ({
    disciplina,
    teams: teamsByDiscipline[disciplina] || [],
  }));
};

export function EquiposTab({ tournament }: EquiposTabProps) {
  const [expandedDisciplina, setExpandedDisciplina] = useState<string | null>(
    tournament.disciplinas[0] || null
  );

  const teamsData = useMemo(
    () => getMockTeamsData(tournament),
    [tournament]
  );

  const totalTeams = useMemo(
    () => teamsData.reduce((sum, d) => sum + d.teams.length, 0),
    [teamsData]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-widest">
          Equipos Inscritos
        </h2>
        <p className="text-muted-foreground text-lg">
          Total de {totalTeams} equipos distribuidos en {tournament.disciplinas.length} disciplinas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20 p-6 text-center">
          <p className="text-muted-foreground text-sm font-semibold mb-2">
            Disciplinas
          </p>
          <p className="text-4xl font-black text-primary">
            {tournament.disciplinas.length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-100/50 to-blue-50/50 rounded-xl border-2 border-blue-200 p-6 text-center">
          <p className="text-muted-foreground text-sm font-semibold mb-2">
            Equipos Totales
          </p>
          <p className="text-4xl font-black text-blue-600">{totalTeams}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-100/50 to-purple-50/50 rounded-xl border-2 border-purple-200 p-6 text-center">
          <p className="text-muted-foreground text-sm font-semibold mb-2">
            Promedio por Disciplina
          </p>
          <p className="text-4xl font-black text-purple-600">
            {Math.round(totalTeams / tournament.disciplinas.length)}
          </p>
        </div>
      </div>

      {/* Disciplinas Accordion */}
      <div className="space-y-4">
        {teamsData.map((data) => (
          <div
            key={data.disciplina}
            className="rounded-xl border-2 border-primary/30 overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <button
              onClick={() =>
                setExpandedDisciplina(
                  expandedDisciplina === data.disciplina
                    ? null
                    : data.disciplina
                )
              }
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-6 py-5 text-white font-bold uppercase tracking-widest transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <span>{data.disciplina}</span>
                <span className="ml-2 text-sm font-normal bg-white/20 px-3 py-1 rounded-full">
                  {data.teams.length} equipos
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  expandedDisciplina === data.disciplina ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Content */}
            {expandedDisciplina === data.disciplina && (
              <div className="bg-white p-6">
                {data.teams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.teams.map((team) => (
                      <div
                        key={team.id}
                        className="bg-gradient-to-br from-white to-primary/5 rounded-lg border-2 border-primary/20 p-5 hover:border-primary/40 hover:shadow-md transition-all group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-black text-lg text-foreground group-hover:text-primary transition-colors">
                                {team.nombre}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {team.facultad}
                              </p>
                            </div>
                            <div className="text-2xl">⚽</div>
                          </div>
                          <div className="pt-2 border-t border-primary/10 flex items-center justify-between text-xs text-muted-foreground">
                            <span>ID: {team.id}</span>
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded font-semibold">
                              Inscrito
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No hay equipos inscritos en esta disciplina</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          💡 Haz clic en una disciplina para ver los equipos inscritos
        </p>
      </div>
    </div>
  );
}
