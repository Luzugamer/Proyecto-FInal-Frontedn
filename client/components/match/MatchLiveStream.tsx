import { useState, useEffect, useRef } from "react";
import {
    Send,
    Radio,
    Users,
    Volume2,
    VolumeX,
    Maximize2,
    Play,
    Eye,
    Signal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Match {
    equipoA: { nombre: string; goles: number };
    equipoB: { nombre: string; goles: number };
    estado: "por_jugar" | "en_vivo" | "finalizado";
    hora: string;
    cancha: string;
}

export interface MatchLiveStreamProps {
    match: Match;
}

interface ChatMessage {
    id: number;
    usuario: string;
    texto: string;
    ts: string;
    tipo: "normal" | "gol" | "sistema";
    avatar: string;
}

interface LiveEvent {
    id: number;
    minuto: number;
    tipo: "gol" | "tarjeta_amarilla" | "tarjeta_roja" | "cambio";
    descripcion: string;
    equipo: "A" | "B";
}

// ─── Datos simulados ──────────────────────────────────────────────────────────

const INITIAL_MESSAGES: ChatMessage[] = [
    { id: 1, usuario: "DelegadoFIA", texto: "¡Vamos FIA, a ganar este partido! 🔥", ts: "15:02", tipo: "normal", avatar: "🌾" },
    { id: 2, usuario: "ProfeGarcía", texto: "Excelente inicio de juego para ambos equipos", ts: "15:04", tipo: "normal", avatar: "👨‍🏫" },
    { id: 3, usuario: "Carlos_FIIS", texto: "¡GOL! ¡GOL! ¡GOL! Diego Flores al minuto 12 ⚽", ts: "15:12", tipo: "gol", avatar: "💻" },
    { id: 4, usuario: "Sistema", texto: "⚽ GOL — Diego Flores (FIA) — Min. 12'", ts: "15:12", tipo: "sistema", avatar: "🏟️" },
    { id: 5, usuario: "Ana_Zootecnia", texto: "¡Qué golazo! Grandísimo partido 😱", ts: "15:13", tipo: "normal", avatar: "🐄" },
    { id: 6, usuario: "HinchaCachimbo", texto: "Primera vez que veo un partido en vivo aquí, genial la plataforma!", ts: "15:15", tipo: "normal", avatar: "🎓" },
    { id: 7, usuario: "Sistema", texto: "🟨 Tarjeta Amarilla — Óscar Mendoza (FIIS) — Min. 23'", ts: "15:23", tipo: "sistema", avatar: "🏟️" },
    { id: 8, usuario: "DelegadoFIIS", texto: "Estuvo bien la tarjeta pero fue muy dura la falta", ts: "15:24", tipo: "normal", avatar: "💻" },
];

const RANDOM_MESSAGES: Omit<ChatMessage, "id" | "ts">[] = [
    { usuario: "Hincha01", texto: "¡Tremendo partido! 🔥", tipo: "normal", avatar: "👤" },
    { usuario: "ProfeLópez", texto: "Muy buen nivel técnico esta temporada", tipo: "normal", avatar: "👩‍🏫" },
    { usuario: "Estudiante22", texto: "¿Alguien sabe a qué hora es la final?", tipo: "normal", avatar: "🎓" },
    { usuario: "FIA_Oficial", texto: "¡Arriba la facultad! 💪🌾", tipo: "normal", avatar: "🌾" },
    { usuario: "Arbitro_UNAS", texto: "Gran disciplina de ambos equipos hoy", tipo: "normal", avatar: "🟨" },
    { usuario: "Delegado_FCA", texto: "Nuestro turno viene la próxima semana 👀", tipo: "normal", avatar: "💰" },
    { usuario: "Cachimbo2026", texto: "Primera olimpiada que sigo, ¡épico! 🏟️", tipo: "normal", avatar: "⭐" },
];

const LIVE_EVENTS: LiveEvent[] = [
    { id: 1, minuto: 12, tipo: "gol", descripcion: "GOL — Diego Flores (FIA)", equipo: "A" },
    { id: 2, minuto: 23, tipo: "tarjeta_amarilla", descripcion: "Óscar Mendoza (FIIS)", equipo: "B" },
    { id: 3, minuto: 38, tipo: "gol", descripcion: "GOL — Roberto Silva (FIIS)", equipo: "B" },
    { id: 4, minuto: 51, tipo: "cambio", descripcion: "Entra Luis Torres por M. Ramos", equipo: "A" },
    { id: 5, minuto: 67, tipo: "gol", descripcion: "GOL — Juan Pérez (FIA)", equipo: "A" },
    { id: 6, minuto: 78, tipo: "tarjeta_roja", descripcion: "Expulsado — P. Castillo (FIIS)", equipo: "B" },
];

const EVENT_ICON: Record<string, string> = {
    gol: "⚽",
    tarjeta_amarilla: "🟨",
    tarjeta_roja: "🟥",
    cambio: "🔄",
};

// ─── Componente ───────────────────────────────────────────────────────────────

export function MatchLiveStream({ match }: MatchLiveStreamProps) {
    const isLive = match.estado === "en_vivo";
    const isFinished = match.estado === "finalizado";

    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState("");
    const [viewers, setViewers] = useState(312);
    const [muted, setMuted] = useState(false);
    const [minutoVivo, setMinutoVivo] = useState(isLive ? 67 : isFinished ? 90 : 0);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Espectadores parpadeantes (solo en vivo)
    useEffect(() => {
        if (!isLive) return;
        const iv = setInterval(() => setViewers((v) => v + Math.floor(Math.random() * 5) - 2), 4000);
        return () => clearInterval(iv);
    }, [isLive]);

    // Mensajes automáticos (solo en vivo)
    useEffect(() => {
        if (!isLive) return;
        const iv = setInterval(() => {
            const base = RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)];
            const now = new Date();
            const ts = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
            setMessages((prev) => [...prev.slice(-40), { ...base, id: Date.now(), ts }]);
        }, 6000);
        return () => clearInterval(iv);
    }, [isLive]);

    // Reloj del partido (solo en vivo)
    useEffect(() => {
        if (!isLive) return;
        const iv = setInterval(() => setMinutoVivo((m) => Math.min(m + 1, 90)), 60000);
        return () => clearInterval(iv);
    }, [isLive]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        const now = new Date();
        const ts = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        setMessages((prev) => [...prev, { id: Date.now(), usuario: "Tú", texto: inputText.trim(), ts, tipo: "normal", avatar: "👤" }]);
        setInputText("");
    };

    // ── Partido no iniciado ───────────────────────────────────────────────────────
    if (match.estado === "por_jugar") {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Radio className="w-10 h-10 text-primary/40" />
                </div>
                <div>
                    <p className="text-xl font-bold text-foreground">Transmisión no disponible aún</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        La señal en vivo iniciará cuando comience el partido a las <strong>{match.hora}</strong> hs.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm font-medium text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                    Partido programado — {match.cancha}
                </div>
            </div>
        );
    }

    // ── Layout principal ──────────────────────────────────────────────────────────
    return (
        <div className="space-y-5">

            {/* Barra de estado */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    {isLive ? (
                        <Badge className="bg-red-600 text-white flex items-center gap-1.5 px-3 py-1 text-sm">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            EN VIVO
                        </Badge>
                    ) : (
                        <Badge className="bg-muted-foreground text-white px-3 py-1 text-sm">FINALIZADO</Badge>
                    )}
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        {viewers} viendo
                    </span>
                    {isLive && (
                        <span className="flex items-center gap-1.5 text-xs text-green-600 font-semibold">
                            <Signal className="w-3.5 h-3.5" />
                            Señal estable
                        </span>
                    )}
                </div>
                {isLive && (
                    <span className="text-sm font-bold text-muted-foreground">
                        Min. <span className="text-primary text-base tabular-nums">{minutoVivo}'</span>
                    </span>
                )}
            </div>

            {/* Grid principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ── Columna izquierda: video + marcador + eventos ───────────────── */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Video player */}
                    <div className="relative bg-black rounded-xl overflow-hidden aspect-video shadow-lg group">

                        {/* Fondo simulado de cancha */}
                        <div className="absolute inset-0 bg-gradient-to-b from-green-900/90 via-green-800/70 to-green-900/90 flex items-center justify-center">
                            <div className="relative w-full h-full">
                                {/* Líneas campo */}
                                <div className="absolute inset-6 border border-white/15 rounded-sm" />
                                <div className="absolute top-1/2 left-6 right-6 h-px bg-white/15 -translate-y-1/2" />
                                <div className="absolute top-1/2 left-1/2 w-20 h-20 border border-white/15 rounded-full -translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute top-1/2 left-6 w-14 h-24 border border-white/10 -translate-y-1/2" />
                                <div className="absolute top-1/2 right-6 w-14 h-24 border border-white/10 -translate-y-1/2" />

                                {/* Centro del player */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                    {isLive ? (
                                        <>
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping" />
                                                <div className="relative w-16 h-16 rounded-full bg-red-600/80 border-2 border-red-400 flex items-center justify-center">
                                                    <Radio className="w-7 h-7 text-white" />
                                                </div>
                                            </div>
                                            <p className="text-white/80 text-sm font-semibold">Transmisión en curso</p>
                                            <p className="text-white/50 text-xs">{match.cancha}</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                                <Play className="w-7 h-7 text-white/60 ml-1" />
                                            </div>
                                            <p className="text-white/60 text-sm">Ver repetición</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Overlay de controles */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="flex items-center gap-3">
                                <button className="text-white/80 hover:text-white"><Play className="w-5 h-5" /></button>
                                <button onClick={() => setMuted((v) => !v)} className="text-white/80 hover:text-white">
                                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                            </div>
                            <button className="text-white/80 hover:text-white"><Maximize2 className="w-5 h-5" /></button>
                        </div>

                        {/* Badge EN VIVO sobre el video */}
                        {isLive && (
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                EN VIVO
                            </div>
                        )}

                        {/* Minuto */}
                        {isLive && (
                            <div className="absolute top-3 right-3 bg-black/60 text-white text-sm font-bold px-2.5 py-1 rounded-md font-mono">
                                {minutoVivo}'
                            </div>
                        )}
                    </div>

                    {/* Marcador compacto */}
                    <Card>
                        <CardContent className="pt-4 pb-4">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <div className="text-center">
                                    <p className="font-black text-sm text-foreground leading-tight line-clamp-2">
                                        {match.equipoA.nombre}
                                    </p>
                                    {isLive && <p className="text-xs text-green-600 font-semibold mt-1">Local</p>}
                                </div>
                                <div className="flex items-center justify-center gap-3">
                                    <span className={`text-4xl font-black tabular-nums ${match.equipoA.goles >= match.equipoB.goles ? "text-primary" : "text-muted-foreground"}`}>
                                        {match.equipoA.goles}
                                    </span>
                                    <span className="text-xl text-muted-foreground font-bold">–</span>
                                    <span className={`text-4xl font-black tabular-nums ${match.equipoB.goles > match.equipoA.goles ? "text-primary" : "text-muted-foreground"}`}>
                                        {match.equipoB.goles}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <p className="font-black text-sm text-foreground leading-tight line-clamp-2">
                                        {match.equipoB.nombre}
                                    </p>
                                    {isLive && <p className="text-xs text-blue-600 font-semibold mt-1">Visitante</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline de eventos */}
                    <Card>
                        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                            <p className="font-bold text-sm text-foreground">Eventos del partido</p>
                            {isLive && (
                                <Badge className="bg-red-50 text-red-600 border border-red-200 text-[11px] flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    Actualizando
                                </Badge>
                            )}
                        </div>
                        <div className="divide-y divide-border">
                            {LIVE_EVENTS.map((ev) => (
                                <div
                                    key={ev.id}
                                    className={`flex items-center gap-4 px-4 py-3 text-sm ${ev.tipo === "gol" ? "bg-amber-50/60" : ""}`}
                                >
                                    <span className="font-mono text-xs text-muted-foreground w-8 text-right flex-shrink-0">
                                        {ev.minuto}'
                                    </span>
                                    <span className="text-base leading-none flex-shrink-0">{EVENT_ICON[ev.tipo]}</span>
                                    <span className={`flex-1 ${ev.tipo === "gol" ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                                        {ev.descripcion}
                                    </span>
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ev.equipo === "A" ? "bg-primary" : "bg-blue-500"}`} />
                                </div>
                            ))}
                            {LIVE_EVENTS.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-6">Sin eventos registrados aún.</p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* ── Chat en vivo ─────────────────────────────────────────────────── */}
                <div className="flex flex-col bg-white rounded-xl border border-border overflow-hidden" style={{ height: "620px" }}>

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="font-bold text-sm text-foreground">Chat en vivo</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{viewers} en sala</span>
                    </div>

                    {/* Mensajes */}
                    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 min-h-0">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-2 ${msg.usuario === "Tú" ? "flex-row-reverse" : ""}`}
                            >
                                {/* Avatar */}
                                {msg.usuario !== "Tú" && (
                                    <span className="text-lg leading-none flex-shrink-0 mt-0.5">{msg.avatar}</span>
                                )}

                                {/* Burbuja */}
                                {msg.tipo === "sistema" ? (
                                    <div className="w-full text-center">
                                        <span className="inline-block text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                                            {msg.texto}
                                        </span>
                                    </div>
                                ) : (
                                    <div className={`
                    max-w-[80%] rounded-2xl px-3 py-2 text-xs
                    ${msg.tipo === "gol"
                                            ? "bg-amber-50 border border-amber-200 text-amber-800 font-semibold"
                                            : msg.usuario === "Tú"
                                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                : "bg-muted text-foreground rounded-tl-sm"}
                  `}>
                                        {msg.usuario !== "Tú" && (
                                            <p className="font-bold text-[10px] mb-0.5 opacity-60">{msg.usuario}</p>
                                        )}
                                        <p className="leading-relaxed">{msg.texto}</p>
                                        <p className="text-[9px] opacity-40 mt-0.5 text-right">{msg.ts}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex-shrink-0 border-t border-border p-3">
                        {isFinished ? (
                            <p className="text-center text-xs text-muted-foreground py-1">
                                El chat cerró al finalizar el partido
                            </p>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Escribe un mensaje..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    maxLength={140}
                                    className="flex-1 text-xs bg-muted rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputText.trim()}
                                    className="p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}