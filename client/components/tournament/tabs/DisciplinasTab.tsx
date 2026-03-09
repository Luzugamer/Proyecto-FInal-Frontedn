import { useState, useMemo } from "react";
import { Tournament } from "@/lib/mockTournaments";
import { cn } from "@/lib/utils";
import { Trophy, Calendar, BarChart3, GitBranch, ChevronDown } from "lucide-react";

import {
    getDisciplinaConfig,
    getSubTabsFromConfig,
    getSistemaLabel,
    getFaseInfo,
    type SubTab,
    type DisciplinaConfig,
} from "@/lib/disciplinaConfig";

import { PosicionesTab } from "./PosicionesTab";
import { MatchesTab } from "./MatchesTab";
import { ResultadosTab } from "./ResultadosTab";
import { BracketViewer } from "../BracketViewer";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface DisciplinasTabProps {
    tournament: Tournament;
    userRole?: string;
}

// ─── Emoji por disciplina ─────────────────────────────────────────────────────

export function getDisciplinaEmoji(disciplina: string): string {
    const d = disciplina.toLowerCase();
    if (d.includes("fútbol") || d.includes("futbol")) return "⚽";
    if (d.includes("vóley") || d.includes("voley") || d.includes("volei")) return "🏐";
    if (d.includes("básquet") || d.includes("basquet") || d.includes("basket")) return "🏀";
    if (d.includes("atletismo")) return "🏃";
    if (d.includes("natación") || d.includes("natacion")) return "🏊";
    if (d.includes("tenis de mesa") || d.includes("ping")) return "🏓";
    if (d.includes("tenis")) return "🎾";
    if (d.includes("ajedrez")) return "♟️";
    if (d.includes("ciclismo")) return "🚴";
    return "🏅";
}

// ─── Config visual de sub-tabs ────────────────────────────────────────────────

const SUB_TAB_CONFIG: Record<SubTab, { label: string; icon: React.ReactNode }> = {
    posiciones: { label: "Posiciones", icon: <BarChart3 className="w-4 h-4" /> },
    fixture: { label: "Fixture", icon: <Calendar className="w-4 h-4" /> },
    resultados: { label: "Resultados", icon: <Trophy className="w-4 h-4" /> },
    bracket: { label: "Bracket", icon: <GitBranch className="w-4 h-4" /> },
};

// ─── Indicador de fase activa ─────────────────────────────────────────────────

function FaseIndicator({ config }: { config: DisciplinaConfig }) {
    const info = getFaseInfo(config);
    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full",
            info.color,
            info.textColor
        )}>
            <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", info.dot, info.pulse && "animate-pulse")} />
            {info.label}
        </span>
    );
}

// ─── Banner de transición de fase ─────────────────────────────────────────────

function FaseBanner({ config, onGoToBracket }: { config: DisciplinaConfig; onGoToBracket: () => void }) {
    if (config.sistemaCompetencia !== "grupos_y_eliminacion") return null;
    if (config.faseActual !== "eliminacion" && config.faseActual !== "grupos") return null;

    if (config.faseActual === "eliminacion") {
        return (
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-orange-50 border border-orange-200">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-base">🔥</span>
                    <span className="font-bold text-orange-800">Fase de grupos finalizada.</span>
                    <span className="text-orange-700 hidden sm:inline">Los clasificados ya están en el bracket.</span>
                </div>
                <button
                    onClick={onGoToBracket}
                    className="flex-shrink-0 text-xs font-bold text-orange-700 border border-orange-300 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                >
                    Ver Bracket →
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-sm">
            <span className="text-base">ℹ️</span>
            <span className="text-blue-800">
                <strong>Top {config.equiposClasifican}</strong> de cada grupo avanzan a eliminación directa.
            </span>
        </div>
    );
}

// ─── Selector de disciplina ───────────────────────────────────────────────────

function DisciplinaSelector({
    disciplinas, selected, tournamentSlug, onSelect,
}: {
    disciplinas: string[]; selected: string; tournamentSlug: string; onSelect: (d: string) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile: dropdown */}
            <div className="md:hidden relative">
                <button
                    onClick={() => setOpen(!open)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-primary/30 rounded-xl font-bold text-foreground hover:border-primary transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <span className="text-lg">{getDisciplinaEmoji(selected)}</span>
                        <span>{selected}</span>
                    </span>
                    <ChevronDown className={cn("w-5 h-5 text-primary transition-transform", open && "rotate-180")} />
                </button>
                {open && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                        {disciplinas.map((d) => {
                            const cfg = getDisciplinaConfig(tournamentSlug, d);
                            const fase = getFaseInfo(cfg);
                            return (
                                <button
                                    key={d}
                                    onClick={() => { onSelect(d); setOpen(false); }}
                                    className={cn("w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-primary/5",
                                        d === selected && "bg-primary/10 text-primary font-bold")}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-base">{getDisciplinaEmoji(d)}</span>
                                        <span>{d}</span>
                                    </span>
                                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", fase.color, fase.textColor)}>
                                        {fase.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Desktop: pills */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
                {disciplinas.map((d) => {
                    const active = d === selected;
                    const cfg = getDisciplinaConfig(tournamentSlug, d);
                    const fase = getFaseInfo(cfg);
                    return (
                        <button
                            key={d}
                            onClick={() => onSelect(d)}
                            className={cn("flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold text-sm transition-all",
                                active
                                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-[1.02]"
                                    : "bg-white text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                            )}
                        >
                            <span className="text-base leading-none">{getDisciplinaEmoji(d)}</span>
                            <span>{d}</span>
                            {!active && (
                                <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", fase.dot, fase.pulse && "animate-pulse")} />
                            )}
                        </button>
                    );
                })}
            </div>
        </>
    );
}

// ─── Sub-tabs ─────────────────────────────────────────────────────────────────

function DisciplinaSubTabs({ available, active, config, onChange }: {
    available: SubTab[]; active: SubTab; config: DisciplinaConfig; onChange: (t: SubTab) => void;
}) {
    return (
        <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
            {available.map((tab) => {
                const { label, icon } = SUB_TAB_CONFIG[tab];
                const isActive = tab === active;
                const isEliminacionHot = tab === "bracket" && config.faseActual === "eliminacion";
                return (
                    <button
                        key={tab}
                        onClick={() => onChange(tab)}
                        className={cn("flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all -mb-px",
                            isActive ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border")}
                    >
                        {icon}
                        {label}
                        {isEliminacionHot && !isActive && <span className="text-xs text-orange-400">🔥</span>}
                    </button>
                );
            })}
        </div>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function DisciplinasTab({ tournament, userRole }: DisciplinasTabProps) {
    const { disciplinas, slug } = tournament;

    const [selectedDisciplina, setSelectedDisciplina] = useState<string>(disciplinas[0] ?? "");

    const config = useMemo(
        () => getDisciplinaConfig(slug, selectedDisciplina),
        [slug, selectedDisciplina]
    );

    const availableSubTabs = useMemo(() => getSubTabsFromConfig(config), [config]);
    const [activeSubTab, setActiveSubTab] = useState<SubTab>(availableSubTabs[0]);

    const handleDisciplinaChange = (d: string) => {
        setSelectedDisciplina(d);
        const newConfig = getDisciplinaConfig(slug, d);
        const tabs = getSubTabsFromConfig(newConfig);
        setActiveSubTab((prev) => (tabs.includes(prev) ? prev : tabs[0]));
    };

    const goToBracket = () => {
        if (availableSubTabs.includes("bracket")) setActiveSubTab("bracket");
    };

    if (disciplinas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <Trophy className="w-12 h-12 text-muted-foreground opacity-30" />
                <p className="text-lg font-medium text-muted-foreground">Este torneo no tiene disciplinas configuradas.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* ── Título estandarizado ──────────────────────────────────────────── */}
            <div>
                <h2 className="text-xl font-bold text-foreground">🏅 Disciplinas</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                    {disciplinas.length} disciplina{disciplinas.length !== 1 ? "s" : ""} —
                    selecciona una para ver posiciones, fixture, resultados y bracket
                </p>
            </div>

            <DisciplinaSelector
                disciplinas={disciplinas}
                selected={selectedDisciplina}
                tournamentSlug={slug}
                onSelect={handleDisciplinaChange}
            />

            <div className="bg-white rounded-2xl border-2 border-border overflow-hidden shadow-sm">

                {/* Header: nombre + fase + sistema */}
                <div className="flex items-center gap-4 px-6 py-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                    <span className="text-4xl leading-none">{getDisciplinaEmoji(selectedDisciplina)}</span>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl font-black text-foreground">{selectedDisciplina}</h3>
                            <FaseIndicator config={config} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {getSistemaLabel(config)}
                            {config.numGrupos > 0 && ` · ${config.numGrupos} grupos`}
                            {config.equiposClasifican > 0 && ` · Top ${config.equiposClasifican} clasifican`}
                            {config.equiposEnBracket > 0 && ` · Bracket de ${config.equiposEnBracket}`}
                        </p>
                    </div>
                </div>

                {/* Banner de fase */}
                <div className="px-6 pt-4">
                    <FaseBanner config={config} onGoToBracket={goToBracket} />
                </div>

                {/* Sub-tabs */}
                <div className="px-6 pt-3">
                    <DisciplinaSubTabs
                        available={availableSubTabs}
                        active={activeSubTab}
                        config={config}
                        onChange={setActiveSubTab}
                    />
                </div>

                {/* Contenido */}
                <div className="px-6 py-6">
                    {activeSubTab === "posiciones" && (
                        <PosicionesTab
                            tournamentSlug={tournament.slug}
                            disciplina={selectedDisciplina}
                            config={config}
                        />
                    )}
                    {activeSubTab === "fixture" && (
                        <MatchesTab
                            tournamentSlug={tournament.slug}
                            disciplina={selectedDisciplina}
                        />
                    )}
                    {activeSubTab === "resultados" && (
                        <ResultadosTab
                            tournamentSlug={tournament.slug}
                            disciplina={selectedDisciplina}
                        />
                    )}
                    {activeSubTab === "bracket" && (
                        <BracketViewer
                            disciplina={selectedDisciplina}
                            config={config}
                            tournamentSlug={tournament.slug}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}