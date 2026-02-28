import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tournament } from "@/lib/mockTournaments";
import { ResumenTab } from "./tabs/ResumenTab";
import { InscripcionesTab } from "./tabs/InscripcionesTab";
import { TournamentBracket, Match as BracketMatch } from "./TournamentBracket";
import { EquiposTab } from "./tabs/EquiposTab";
import { MisEquiposTab } from "./tabs/MisEquiposTab";
import { DisciplinasTab } from "./tabs/DisciplinasTab";
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
      if (window.innerWidth < 400) {
        setVisibleCount(2);
      } else if (window.innerWidth < 640) {
        setVisibleCount(3);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(4);
      } else {
        setVisibleCount(6);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getTabs = () => {
    const publicTabs = [
      { id: "informacion", label: "📋 Información", badge: null },
      { id: "disciplinas",  label: "🏅 Disciplinas",  badge: null },
      { id: "equipos",     label: "👥 Equipos",      badge: null },
      { id: "galeria",     label: "📸 Galería",      badge: null },
    ];

    if (!userRole) return publicTabs;

    if (userRole === "DELEGADO_DEPORTES") {
      return [
        { id: "informacion", label: "📋 Información", badge: null },
        { id: "disciplinas",  label: "🏅 Disciplinas",  badge: null },
        { id: "misequipos",  label: "⭐ Mis Equipos",  badge: "1" },
        { id: "records",     label: "📋 Récords",      badge: "2" },
        { id: "equipos",     label: "👥 Equipos",      badge: null },
      ];
    }

    if (userRole === "COMITE_ORGANIZADOR") {
      return [
        { id: "informacion",  label: "📋 Información",  badge: null },
        { id: "disciplinas",   label: "🏅 Disciplinas",   badge: null },
        { id: "inscripciones", label: "✅ Inscripciones", badge: "5" },
        { id: "records",      label: "📋 Récords",       badge: "3" },
        { id: "fixture",      label: "🎲 Fixture",       badge: null },
        { id: "actas",        label: "📝 Actas",         badge: "3" },
        { id: "equipos",      label: "👥 Equipos",       badge: null },
        { id: "justicia",     label: "⚖️ Justicia",      badge: null },
        { id: "reportes",     label: "📊 Reportes",      badge: null },
      ];
    }

    if (userRole === "ADMINISTRADOR") {
      return [
        { id: "informacion",  label: "📋 Información",  badge: null },
        { id: "disciplinas",   label: "🏅 Disciplinas",   badge: null },
        { id: "configuracion", label: "⚙️ Config",        badge: null },
        { id: "inscripciones", label: "✅ Inscrip.",      badge: null },
        { id: "records",      label: "📋 Récords",       badge: null },
        { id: "fixture",      label: "🎲 Fixture",       badge: null },
        { id: "actas",        label: "📝 Actas",         badge: null },
        { id: "equipos",      label: "👥 Equipos",       badge: null },
        { id: "justicia",     label: "⚖️ Justicia",      badge: null },
        { id: "reportes",     label: "📊 Reportes",      badge: null },
        { id: "comites",      label: "👔 Comités",       badge: null },
        { id: "analitica",    label: "📈 Analítica",     badge: null },
      ];
    }

    if (userRole === "SUPER_ADMIN") {
      return [
        { id: "informacion",  label: "📋 Información",  badge: null },
        { id: "disciplinas",   label: "🏅 Disciplinas",   badge: null },
        { id: "configuracion", label: "⚙️ Config",        badge: null },
        { id: "inscripciones", label: "✅ Inscrip.",      badge: null },
        { id: "records",      label: "📋 Récords",       badge: null },
        { id: "fixture",      label: "🎲 Fixture",       badge: null },
        { id: "actas",        label: "📝 Actas",         badge: null },
        { id: "equipos",      label: "👥 Equipos",       badge: null },
        { id: "justicia",     label: "⚖️ Justicia",      badge: null },
        { id: "reportes",     label: "📊 Reportes",      badge: null },
        { id: "comites",      label: "👔 Comités",       badge: null },
        { id: "analitica",    label: "📈 Analítica",     badge: null },
        { id: "auditoria",    label: "🔍 Auditoría",     badge: null },
        { id: "sistema",      label: "🛠️ Sistema",       badge: null },
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
      {/* ── Barra de tabs ──────────────────────────────────────────────────── */}
      <TabsList className="bg-white border-b border-border flex items-center justify-start rounded-none p-0 h-auto w-full">
        {visibleTabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-2.5 sm:px-4 py-3 relative h-12 whitespace-nowrap flex-shrink-0 text-xs sm:text-sm"
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <Badge className="ml-1.5 bg-red-500 hover:bg-red-600 text-[10px] h-4 px-1">
                {tab.badge}
              </Badge>
            )}
          </TabsTrigger>
        ))}

        {/* Botón de overflow — solo muestra "···" sin texto para no desbordar en móvil */}
        {overflowTabs.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 px-3 h-12 font-bold text-base border-b-2 border-transparent transition-all hover:bg-muted/50 outline-none flex-shrink-0 tracking-widest leading-none",
                  isOverflowActive
                    ? "border-primary text-primary"
                    : "text-muted-foreground"
                )}
                aria-label="Más secciones"
              >
                ···
                {totalOverflowBadges > 0 && (
                  <Badge className="bg-red-500 hover:bg-red-600 text-[10px] h-4 px-1 ml-0.5">
                    {totalOverflowBadges}
                  </Badge>
                )}
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

      {/* ── Contenido de tabs ─────────────────────────────────────────────── */}

      <TabsContent value="informacion" className="mt-8">
        <ResumenTab tournament={tournament} userRole={userRole} />
      </TabsContent>

      <TabsContent value="disciplinas" className="mt-8">
        <DisciplinasTab tournament={tournament} userRole={userRole} />
      </TabsContent>

      <TabsContent value="equipos" className="mt-8">
        <EquiposTab tournament={tournament} />
      </TabsContent>

      <TabsContent value="galeria" className="mt-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Galería de fotos — Próximamente</p>
        </div>
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

          <TabsContent value="justicia" className="mt-8">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Tribunal deportivo y sanciones
              </p>
            </div>
          </TabsContent>

          <TabsContent value="reportes" className="mt-8">
            <ReportesTab tournamentId={tournament.id} />
          </TabsContent>
        </>
      )}

      {(userRole === "ADMINISTRADOR" || userRole === "SUPER_ADMIN") && (
        <>
          <TabsContent value="configuracion" className="mt-8">
            <ConfiguracionTab tournamentId={tournament.id} />
          </TabsContent>

          <TabsContent value="comites" className="mt-8">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Gestión de comités — Próximamente
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
        </>
      )}

      {userRole === "SUPER_ADMIN" && (
        <>
          <TabsContent value="auditoria" className="mt-8">
            <AuditoriaTab tournamentId={tournament.id} />
          </TabsContent>

          <TabsContent value="sistema" className="mt-8">
            <SistemaTab
              tournamentId={tournament.id}
              onEliminar={onEliminar}
            />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
}