import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tournament } from "@/lib/mockTournaments";
import { ResumenTab } from "./tabs/ResumenTab";
import { InscripcionesTab } from "./tabs/InscripcionesTab";
import { MatchesTab } from "./tabs/MatchesTab";
import { CalendarioTab } from "./tabs/CalendarioTab";
import { PosicionesTab } from "./tabs/PosicionesTab";
import { TournamentBracket, Match as BracketMatch } from "./TournamentBracket";
import { StandingsTable } from "./StandingsTable";
import { EquiposTab } from "./tabs/EquiposTab";
import { MisEquiposTab } from "./tabs/MisEquiposTab";
import {
  FixtureTab,
  ActasTab,
  ConfiguracionTab,
  ReportesTab,
  AuditoriaTab,
  SistemaTab,
} from "./tabs/AdminTabs";
import { RecordsManagementPanel } from "@/components/records/RecordsManagementPanel";
import { RecordsReviewPanel } from "@/components/records/RecordsReviewPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TournamentTabsProps {
  tournament: Tournament;
  userRole?: string;
  onTabChange?: (tabId: string) => void;
  onGenererFixture?: () => void;
  onRegistrarActa?: () => void;
  onEliminar?: () => void;
}

export function TournamentTabs({
  tournament,
  userRole,
  onTabChange,
  onGenererFixture,
  onRegistrarActa,
  onEliminar,
}: TournamentTabsProps) {
  const [activeTab, setActiveTab] = useState("informacion");
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(3);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(4);
      } else {
        setVisibleCount(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determinar tabs según rol
  const getTabs = () => {
    const publicTabs = [
      { id: "informacion", label: "📋 Información", badge: null },
      { id: "partidos", label: "⚽ Partidos", badge: null },
      { id: "calendario", label: "📅 Calendario", badge: null },
      { id: "posiciones", label: "🏆 Posiciones", badge: null },
      { id: "equipos", label: "👥 Equipos", badge: null },
      { id: "galeria", label: "📸 Galería", badge: null },
    ];

    if (!userRole) return publicTabs;

    if (userRole === "DELEGADO_DEPORTES") {
      return [
        { id: "informacion", label: "📋 Información", badge: null },
        { id: "partidos", label: "⚽ Partidos", badge: null },
        { id: "misequipos", label: "⭐ Mis Equipos", badge: "1" },
        { id: "records", label: "📋 Récords", badge: "2" },
        { id: "calendario", label: "📅 Calendario", badge: null },
        { id: "posiciones", label: "🏆 Posiciones", badge: null },
        { id: "equipos", label: "👥 Equipos", badge: null },
      ];
    }

    if (userRole === "COMITE_ORGANIZADOR") {
      return [
        { id: "informacion", label: "📋 Información", badge: null },
        { id: "partidos", label: "⚽ Partidos", badge: null },
        { id: "misequipos", label: "⭐ Mis Equipos", badge: null },
        { id: "inscripciones", label: "✅ Inscripciones", badge: "5" },
        { id: "records", label: "📋 Récords", badge: "3" },
        { id: "fixture", label: "🎲 Fixture", badge: null },
        { id: "actas", label: "📝 Actas", badge: "3" },
        { id: "equipos", label: "👥 Equipos", badge: null },
        { id: "justicia", label: "⚖️ Justicia", badge: null },
        { id: "reportes", label: "📊 Reportes", badge: null },
      ];
    }

    if (userRole === "ADMINISTRADOR") {
      return [
        { id: "informacion", label: "📋 Información", badge: null },
        { id: "partidos", label: "⚽ Partidos", badge: null },
        { id: "configuracion", label: "⚙️ Configuración", badge: null },
        { id: "misequipos", label: "⭐ Mis Equipos", badge: null },
        { id: "inscripciones", label: "✅ Inscripciones", badge: null },
        { id: "records", label: "📋 Récords", badge: null },
        { id: "fixture", label: "🎲 Fixture", badge: null },
        { id: "actas", label: "📝 Actas", badge: null },
        { id: "equipos", label: "👥 Equipos", badge: null },
        { id: "justicia", label: "⚖️ Justicia", badge: null },
        { id: "reportes", label: "📊 Reportes", badge: null },
        { id: "comites", label: "👔 Comités", badge: null },
        { id: "analitica", label: "📈 Analítica", badge: null },
      ];
    }

    if (userRole === "SUPER_ADMIN") {
      return [
        { id: "informacion", label: "📋 Información", badge: null },
        { id: "partidos", label: "⚽ Partidos", badge: null },
        { id: "configuracion", label: "⚙️ Configuración", badge: null },
        { id: "misequipos", label: "⭐ Mis Equipos", badge: null },
        { id: "inscripciones", label: "✅ Inscripciones", badge: null },
        { id: "records", label: "📋 Récords", badge: null },
        { id: "fixture", label: "🎲 Fixture", badge: null },
        { id: "actas", label: "📝 Actas", badge: null },
        { id: "equipos", label: "👥 Equipos", badge: null },
        { id: "justicia", label: "⚖️ Justicia", badge: null },
        { id: "reportes", label: "📊 Reportes", badge: null },
        { id: "comites", label: "👔 Comités", badge: null },
        { id: "analitica", label: "📈 Analítica", badge: null },
        { id: "auditoria", label: "🔍 Auditoría", badge: null },
        { id: "sistema", label: "🛠️ Sistema", badge: null },
      ];
    }

    return publicTabs;
  };

  const tabs = getTabs();

  const visibleTabs = tabs.slice(0, visibleCount);
  const overflowTabs = tabs.slice(visibleCount);
  const isOverflowActive = overflowTabs.some((tab) => tab.id === activeTab);

  const totalOverflowBadges = overflowTabs.reduce((sum, tab) => {
    if (tab.badge) {
      const val = parseInt(tab.badge);
      return isNaN(val) ? sum : sum + val;
    }
    return sum;
  }, 0);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="bg-white border-b border-border flex items-center justify-start rounded-none p-0 h-auto w-full">
        {visibleTabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-3 relative h-12"
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <Badge className="ml-2 bg-red-500 hover:bg-red-600">
                {tab.badge}
              </Badge>
            )}
          </TabsTrigger>
        ))}

        {overflowTabs.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-2 px-4 py-3 h-12 font-medium text-sm border-b-2 border-transparent transition-all hover:bg-muted/50 outline-none",
                  isOverflowActive && "border-primary text-primary"
                )}
              >
                <span>Más</span>
                {totalOverflowBadges > 0 && (
                  <Badge className="bg-red-500 hover:bg-red-600">
                    {totalOverflowBadges}
                  </Badge>
                )}
                <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {overflowTabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "flex items-center justify-between cursor-pointer py-2",
                    activeTab === tab.id && "bg-primary/10 text-primary font-bold"
                  )}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <Badge className="bg-red-500 hover:bg-red-600">
                      {tab.badge}
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TabsList>

      {/* Contenido de cada tab */}
      <TabsContent value="informacion" className="mt-8">
        <ResumenTab tournament={tournament} userRole={userRole} />
      </TabsContent>

      <TabsContent value="partidos" className="mt-8">
        <MatchesTab
          tournamentId={tournament.id}
          tournamentSlug={tournament.slug}
          userRole={userRole}
        />
      </TabsContent>

      {userRole === "DELEGADO_DEPORTES" && (
        <>
          <TabsContent value="misequipos" className="mt-8">
            <MisEquiposTab tournament={tournament} userRole={userRole} />
          </TabsContent>

          <TabsContent value="records" className="mt-8">
            <RecordsManagementPanel
              tournamentId={tournament.id}
              userRole={userRole}
            />
          </TabsContent>
        </>
      )}

      {(userRole === "COMITE_ORGANIZADOR" ||
        userRole === "ADMINISTRADOR" ||
        userRole === "SUPER_ADMIN") && (
        <>
          <TabsContent value="misequipos" className="mt-8">
            <MisEquiposTab tournament={tournament} userRole={userRole} />
          </TabsContent>

          <TabsContent value="inscripciones" className="mt-8">
            <InscripcionesTab
              tournamentId={tournament.id}
              userRole={userRole}
            />
          </TabsContent>

          <TabsContent value="records" className="mt-8">
            <RecordsReviewPanel
              tournamentId={tournament.id}
              userRole={userRole}
            />
          </TabsContent>

          <TabsContent value="fixture" className="mt-8">
            <FixtureTab
              tournamentId={tournament.id}
              userRole={userRole}
              onGenerarFixture={onGenererFixture}
            />
          </TabsContent>

          <TabsContent value="actas" className="mt-8">
            <ActasTab
              tournamentId={tournament.id}
              userRole={userRole}
              onRegistrarActa={onRegistrarActa}
            />
          </TabsContent>
        </>
      )}

      {userRole === "ADMINISTRADOR" && (
        <>
          <TabsContent value="misequipos" className="mt-8">
            <MisEquiposTab tournament={tournament} userRole={userRole} />
          </TabsContent>

          <TabsContent value="configuracion" className="mt-8">
            <ConfiguracionTab tournamentId={tournament.id} />
          </TabsContent>
        </>
      )}

      {userRole === "SUPER_ADMIN" && (
        <>
          <TabsContent value="configuracion" className="mt-8">
            <ConfiguracionTab tournamentId={tournament.id} />
          </TabsContent>

          <TabsContent value="auditoria" className="mt-8">
            <AuditoriaTab tournamentId={tournament.id} />
          </TabsContent>

          <TabsContent value="sistema" className="mt-8">
            <SistemaTab tournamentId={tournament.id} onEliminar={onEliminar} />
          </TabsContent>
        </>
      )}

      {/* Tabs comunes */}
      <TabsContent value="calendario" className="mt-8">
        <CalendarioTab tournamentSlug={tournament.slug} />
      </TabsContent>

      <TabsContent value="posiciones" className="mt-8">
        <PosicionesTab tournamentSlug={tournament.slug} />
      </TabsContent>

      <TabsContent value="equipos" className="mt-8">
        <EquiposTab tournament={tournament} />
      </TabsContent>

      <TabsContent value="justicia" className="mt-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Tribunal deportivo y sanciones
          </p>
        </div>
      </TabsContent>

      <TabsContent value="reportes" className="mt-8">
        {userRole === "ADMINISTRADOR" || userRole === "SUPER_ADMIN" ? (
          <ReportesTab tournamentId={tournament.id} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Sin permiso</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="comites" className="mt-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Gestión de comités - Próximamente
          </p>
        </div>
      </TabsContent>

      <TabsContent value="analitica" className="mt-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Analítica y estadísticas avanzadas
          </p>
        </div>
      </TabsContent>

      <TabsContent value="galeria" className="mt-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Galería de fotos</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}

// Tabs administrativos importados desde ./tabs/AdminTabs.tsx
// Tabs de inscripciones importados desde ./tabs/InscripcionesTab.tsx
// Tab de Mis Equipos importado desde ./tabs/MisEquiposTab.tsx

// Admin Panel para gestionar ganadores del bracket
function AdminBracketPanel({
  matches,
  onUpdateWinner,
}: {
  matches: BracketMatch[];
  onUpdateWinner: (matchId: string, winnerTeamId: string) => void;
}) {
  return (
    <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-blue-900 mb-2">
          ⚙️ Panel de Administración
        </h3>
        <p className="text-blue-700">
          Marca los ganadores de cada partido para actualizar automáticamente el
          bracket
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches
          .filter((m) => m.home && m.away)
          .map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-lg border-2 border-blue-200 p-4 space-y-3"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-foreground text-sm uppercase">
                  {match.round === "cuartos" && "Cuartos"}
                  {match.round === "semifinales" && "Semifinales"}
                  {match.round === "final" && "Final"}
                  {match.group && ` - Grupo ${match.group}`}
                </h4>
                {match.winnerId && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    ✓ Ganador marcado
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => onUpdateWinner(match.id, match.home!.id)}
                  className={`w-full p-3 rounded-lg text-left font-medium transition-all border-2 ${
                    match.winnerId === match.home!.id
                      ? "bg-green-100 border-green-300 text-green-700"
                      : "bg-white border-border text-foreground hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{match.home!.name}</span>
                    {match.winnerId === match.home!.id && (
                      <span className="text-lg">✓</span>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => onUpdateWinner(match.id, match.away!.id)}
                  className={`w-full p-3 rounded-lg text-left font-medium transition-all border-2 ${
                    match.winnerId === match.away!.id
                      ? "bg-green-100 border-green-300 text-green-700"
                      : "bg-white border-border text-foreground hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{match.away!.name}</span>
                    {match.winnerId === match.away!.id && (
                      <span className="text-lg">✓</span>
                    )}
                  </div>
                </button>
              </div>
            </div>
          ))}
      </div>

      {matches.filter((m) => m.home && m.away).length === 0 && (
        <div className="text-center py-8 text-blue-700">
          <p className="font-medium">No hay partidos para configurar</p>
        </div>
      )}
    </div>
  );
}
