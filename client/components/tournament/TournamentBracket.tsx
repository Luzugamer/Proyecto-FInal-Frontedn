import { useMemo } from "react";
import { Trophy } from "lucide-react";

export interface BracketTeam {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  round: "cuartos" | "semifinales" | "final";
  group?: "A" | "B";
  home?: BracketTeam;
  away?: BracketTeam;
  winnerId?: string;
}

interface TournamentBracketProps {
  matches: Match[];
  tournamentName?: string;
}

const DEFAULT_TEAMS: BracketTeam[] = [
  { id: "1", name: "Agronomía" },
  { id: "2", name: "Ingeniería" },
  { id: "3", name: "Zootecnia" },
  { id: "4", name: "Economía" },
  { id: "5", name: "Enfermería" },
  { id: "6", name: "Forestales" },
  { id: "7", name: "Ciencias Sociales" },
  { id: "8", name: "Educación" },
];

export function TournamentBracket({
  matches,
  tournamentName = "Bracket de Torneo",
}: TournamentBracketProps) {
  // Organizamos los matches por ronda
  const cuartos = useMemo(
    () => matches.filter((m) => m.round === "cuartos"),
    [matches]
  );

  const semifinales = useMemo(
    () => matches.filter((m) => m.round === "semifinales"),
    [matches]
  );

  const finalMatch = useMemo(
    () => matches.find((m) => m.round === "final"),
    [matches]
  );

  // Obtener el campeón
  const champion = useMemo(() => {
    if (!finalMatch?.winnerId) return null;
    return finalMatch.home?.id === finalMatch.winnerId
      ? finalMatch.home
      : finalMatch.away;
  }, [finalMatch]);

  return (
    <div className="w-full bg-gradient-to-b from-primary/5 via-white to-primary/5 rounded-2xl border-2 border-primary/30 overflow-hidden">
      {/* Banner Superior Llamativo */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-8 py-8 text-center relative overflow-hidden">
        {/* Efecto de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Contenido */}
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest mb-2 drop-shadow-lg">
            {tournamentName}
          </h2>
          <p className="text-primary-foreground/90 font-semibold tracking-wide">
            Progresión del Torneo
          </p>
        </div>
      </div>

      {/* Bracket Content */}
      <div className="p-12">
        <div className="relative">
          {/* SVG Lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ minHeight: "600px" }}
          >
            {/* Líneas de flujo - de cuartos a semifinales */}
            <line
              x1="25%"
              y1="100"
              x2="35%"
              y2="200"
              stroke="url(#gradientLine1)"
              strokeWidth="3"
              className="drop-shadow-lg"
            />
            <line
              x1="25%"
              y1="300"
              x2="35%"
              y2="250"
              stroke="url(#gradientLine1)"
              strokeWidth="3"
              className="drop-shadow-lg"
            />

            {/* Lado derecho (espejo) */}
            <line
              x1="75%"
              y1="100"
              x2="65%"
              y2="200"
              stroke="url(#gradientLine2)"
              strokeWidth="3"
              className="drop-shadow-lg"
            />
            <line
              x1="75%"
              y1="300"
              x2="65%"
              y2="250"
              stroke="url(#gradientLine2)"
              strokeWidth="3"
              className="drop-shadow-lg"
            />

            {/* Líneas de semifinales a final */}
            <line
              x1="35%"
              y1="400"
              x2="45%"
              y2="480"
              stroke="url(#gradientLine3)"
              strokeWidth="3"
              className="drop-shadow-lg"
            />
            <line
              x1="65%"
              y1="400"
              x2="55%"
              y2="480"
              stroke="url(#gradientLine3)"
              strokeWidth="3"
              className="drop-shadow-lg"
            />

            {/* Gradientes para las líneas */}
            <defs>
              <linearGradient id="gradientLine1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "rgb(var(--color-primary))", stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: "rgb(var(--color-primary))", stopOpacity: 0.3 }} />
              </linearGradient>
              <linearGradient id="gradientLine2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "rgb(var(--color-primary))", stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: "rgb(var(--color-primary))", stopOpacity: 0.3 }} />
              </linearGradient>
              <linearGradient id="gradientLine3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "rgb(var(--color-primary))", stopOpacity: 0.5 }} />
                <stop offset="50%" style={{ stopColor: "rgb(var(--color-primary))", stopOpacity: 0.7 }} />
                <stop offset="100%" style={{ stopColor: "rgb(var(--color-primary))", stopOpacity: 0.5 }} />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative z-10">
            {/* Grid Layout */}
            <div className="grid grid-cols-12 gap-8">
              {/* CUARTOS - LEFT SIDE */}
              <div className="col-span-5 space-y-8">
                {/* Titulo Grupo A/B - LEFT */}
                <div className="text-center mb-8">
                  <div className="inline-block">
                    <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-4 rounded-lg transform -skew-x-12 shadow-lg">
                      <h4 className="text-2xl font-black text-white uppercase tracking-widest drop-shadow-md">
                        Grupo A
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Grupo A */}
                <div className="space-y-4">
                  {cuartos
                    .filter((m) => m.group === "A")
                    .map((match) => (
                      <MatchCardReadOnly
                        key={match.id}
                        match={match}
                      />
                    ))}
                </div>

                {/* Titulo Grupo B - LEFT */}
                <div className="text-center mb-8 mt-12">
                  <div className="inline-block">
                    <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-4 rounded-lg transform -skew-x-12 shadow-lg">
                      <h4 className="text-2xl font-black text-white uppercase tracking-widest drop-shadow-md">
                        Grupo B
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Grupo B */}
                <div className="space-y-4">
                  {cuartos
                    .filter((m) => m.group === "B")
                    .map((match) => (
                      <MatchCardReadOnly
                        key={match.id}
                        match={match}
                      />
                    ))}
                </div>
              </div>

              {/* CENTER - FINAL */}
              <div className="col-span-2 flex flex-col items-center justify-between">
                {/* SEMIFINALES */}
                <div className="w-full space-y-6">
                  <div className="text-center">
                    <div className="inline-block bg-gradient-to-r from-primary/80 to-primary/60 px-6 py-3 rounded-lg">
                      <h4 className="text-lg font-black text-white uppercase tracking-widest drop-shadow-md">
                        Semifinales
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {semifinales.length > 0 ? (
                      semifinales.map((match) => (
                        <MatchCardReadOnly
                          key={match.id}
                          match={match}
                          size="sm"
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-xs">
                        Pendiente
                      </div>
                    )}
                  </div>
                </div>

                {/* FINAL */}
                <div className="w-full mt-12">
                  <div className="text-center mb-4">
                    <div className="inline-block bg-gradient-to-r from-primary/80 to-primary/60 px-6 py-3 rounded-lg">
                      <h4 className="text-lg font-black text-white uppercase tracking-widest drop-shadow-md">
                        Final
                      </h4>
                    </div>
                  </div>

                  {finalMatch ? (
                    <MatchCardReadOnly
                      match={finalMatch}
                      size="sm"
                    />
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-xs">
                      Pendiente
                    </div>
                  )}
                </div>

                {/* GANADOR */}
                <div className="w-full mt-12 pt-8 border-t-2 border-primary/30">
                  <div className="text-center">
                    {champion ? (
                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <Trophy className="w-16 h-16 text-yellow-500 drop-shadow-lg animate-bounce" />
                        </div>
                        <div className="bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-xl p-5 border-2 border-yellow-400 shadow-lg">
                          <p className="text-xs font-black text-yellow-700 uppercase tracking-wider mb-1">
                            🏆 Campeón
                          </p>
                          <p className="font-black text-2xl text-yellow-900">
                            {champion.name}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Trophy className="w-16 h-16 text-muted-foreground/20 mx-auto" />
                        <div className="bg-muted/30 rounded-xl p-5">
                          <p className="text-xs font-semibold text-muted-foreground uppercase">
                            Pendiente
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CUARTOS - RIGHT SIDE */}
              <div className="col-span-5">
                {/* Espejo del lado izquierdo */}
                <div className="space-y-8">
                  {/* Titulo Grupo A/B - RIGHT */}
                  <div className="text-center mb-8">
                    <div className="inline-block">
                      <div className="bg-gradient-to-l from-primary to-primary/80 px-8 py-4 rounded-lg transform skew-x-12 shadow-lg">
                        <h4 className="text-2xl font-black text-white uppercase tracking-widest drop-shadow-md">
                          Grupo A
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Grupo A */}
                  <div className="space-y-4">
                    {cuartos
                      .filter((m) => m.group === "A")
                      .map((match) => (
                        <MatchCardReadOnly
                          key={match.id}
                          match={match}
                        />
                      ))}
                  </div>

                  {/* Titulo Grupo B - RIGHT */}
                  <div className="text-center mb-8 mt-12">
                    <div className="inline-block">
                      <div className="bg-gradient-to-l from-primary to-primary/80 px-8 py-4 rounded-lg transform skew-x-12 shadow-lg">
                        <h4 className="text-2xl font-black text-white uppercase tracking-widest drop-shadow-md">
                          Grupo B
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Grupo B */}
                  <div className="space-y-4">
                    {cuartos
                      .filter((m) => m.group === "B")
                      .map((match) => (
                        <MatchCardReadOnly
                          key={match.id}
                          match={match}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="bg-primary/5 px-8 py-4 border-t border-primary/20 text-center">
        <p className="text-xs text-muted-foreground font-semibold">
          💡 Los equipos avanzan automáticamente cuando un ganador es registrado por el administrador
        </p>
      </div>
    </div>
  );
}

function MatchCardReadOnly({
  match,
  size = "md",
}: {
  match: Match;
  size?: "sm" | "md";
}) {
  const homeWon = match.winnerId === match.home?.id;
  const awayWon = match.winnerId === match.away?.id;

  const cardClasses =
    size === "sm"
      ? "p-2"
      : "p-3";

  const textClasses =
    size === "sm"
      ? "text-xs"
      : "text-sm";

  return (
    <div className={`bg-white rounded-lg border-2 border-primary/40 shadow-md hover:shadow-lg hover:border-primary/60 transition-all overflow-hidden ${cardClasses}`}>
      {/* Home Team */}
      {match.home ? (
        <div
          className={`border-b border-primary/20 ${
            homeWon
              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
              : "bg-white hover:bg-primary/5"
          } px-3 py-2 flex items-center justify-between transition-colors`}
        >
          <span className={`${textClasses} font-bold flex-1 truncate`}>
            {match.home.name}
          </span>
          {homeWon && (
            <span className="text-lg ml-2 font-black">✓</span>
          )}
        </div>
      ) : (
        <div className={`border-b border-primary/20 bg-muted/30 px-3 py-2 ${textClasses} text-muted-foreground`}>
          -
        </div>
      )}

      {/* Away Team */}
      {match.away ? (
        <div
          className={`${
            awayWon
              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
              : "bg-white hover:bg-primary/5"
          } px-3 py-2 flex items-center justify-between transition-colors`}
        >
          <span className={`${textClasses} font-bold flex-1 truncate`}>
            {match.away.name}
          </span>
          {awayWon && (
            <span className="text-lg ml-2 font-black">✓</span>
          )}
        </div>
      ) : (
        <div className={`bg-muted/30 px-3 py-2 ${textClasses} text-muted-foreground`}>
          -
        </div>
      )}
    </div>
  );
}
