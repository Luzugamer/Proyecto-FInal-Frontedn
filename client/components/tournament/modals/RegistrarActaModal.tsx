import { useState } from "react";
import { X, Plus, Trash2, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RegistrarActaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ActaData) => void;
  match?: {
    homeTeam: string;
    awayTeam: string;
    date: string;
    sport: string;
    location: string;
  };
}

interface ActaData {
  homeScore: number;
  awayScore: number;
  goles: Array<{
    equipo: "home" | "away";
    minuto: number;
    jugador: string;
    asistencia?: string;
  }>;
  tarjetas: Array<{
    equipo: "home" | "away";
    minuto: number;
    jugador: string;
    tipo: "amarilla" | "roja";
  }>;
  observaciones: string;
  arbitro: string;
}

export function RegistrarActaModal({
  isOpen,
  onClose,
  onSubmit,
  match,
}: RegistrarActaModalProps) {
  const [currentStep, setCurrentStep] = useState<
    "resumen" | "goles" | "tarjetas" | "final"
  >("resumen");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [goles, setGoles] = useState<ActaData["goles"]>([]);
  const [tarjetas, setTarjetas] = useState<ActaData["tarjetas"]>([]);
  const [nuevoGol, setNuevoGol] = useState({
    minuto: "",
    jugador: "",
    asistencia: "",
    equipo: "home" as "home" | "away",
  });
  const [nuevaTarjeta, setNuevaTarjeta] = useState({
    minuto: "",
    jugador: "",
    tipo: "amarilla" as "amarilla" | "roja",
    equipo: "home" as "home" | "away",
  });
  const [observaciones, setObservaciones] = useState("");
  const [arbitro, setArbitro] = useState("");

  const handleAddGol = () => {
    if (nuevoGol.minuto && nuevoGol.jugador) {
      const newScore = nuevoGol.equipo === "home" ? homeScore + 1 : homeScore;
      const newAwayScore =
        nuevoGol.equipo === "away" ? awayScore + 1 : awayScore;

      setGoles([
        ...goles,
        {
          equipo: nuevoGol.equipo,
          minuto: parseInt(nuevoGol.minuto),
          jugador: nuevoGol.jugador,
          asistencia: nuevoGol.asistencia || undefined,
        },
      ]);

      if (nuevoGol.equipo === "home") setHomeScore(newScore);
      else setAwayScore(newAwayScore);

      setNuevoGol({ minuto: "", jugador: "", asistencia: "", equipo: "home" });
    }
  };

  const handleAddTarjeta = () => {
    if (nuevaTarjeta.minuto && nuevaTarjeta.jugador) {
      setTarjetas([
        ...tarjetas,
        {
          equipo: nuevaTarjeta.equipo,
          minuto: parseInt(nuevaTarjeta.minuto),
          jugador: nuevaTarjeta.jugador,
          tipo: nuevaTarjeta.tipo,
        },
      ]);

      setNuevaTarjeta({
        minuto: "",
        jugador: "",
        tipo: "amarilla",
        equipo: "home",
      });
    }
  };

  const handleSubmit = () => {
    onSubmit({
      homeScore,
      awayScore,
      goles,
      tarjetas,
      observaciones,
      arbitro,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Registrar Acta Digital
          </DialogTitle>
        </DialogHeader>

        {match && (
          <div className="bg-muted/30 p-4 rounded-lg mb-4">
            <p className="font-bold text-sm mb-1">
              {match.homeTeam} vs {match.awayTeam}
            </p>
            <p className="text-xs text-muted-foreground">
              {match.sport} • {match.location}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(match.date).toLocaleDateString("es-PE")}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          {["resumen", "goles", "tarjetas", "final"].map((step) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step as any)}
              className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${
                currentStep === step
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {step === "resumen" && "Resultado"}
              {step === "goles" && "Goles"}
              {step === "tarjetas" && "Tarjetas"}
              {step === "final" && "Información"}
            </button>
          ))}
        </div>

        {/* Contenido de pasos */}
        {currentStep === "resumen" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-4">
                Resultado Final
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    {match?.homeTeam}
                  </p>
                  <input
                    type="number"
                    value={homeScore}
                    onChange={(e) =>
                      setHomeScore(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-full px-3 py-6 border border-border rounded-lg text-4xl font-bold text-center"
                    min="0"
                  />
                </div>
                <div className="flex items-center justify-center text-3xl font-bold text-muted-foreground">
                  -
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    {match?.awayTeam}
                  </p>
                  <input
                    type="number"
                    value={awayScore}
                    onChange={(e) =>
                      setAwayScore(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-full px-3 py-6 border border-border rounded-lg text-4xl font-bold text-center"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === "goles" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-3">
                Registrar Gol
              </label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Minuto"
                    value={nuevoGol.minuto}
                    onChange={(e) =>
                      setNuevoGol({ ...nuevoGol, minuto: e.target.value })
                    }
                    className="px-3 py-2 border border-border rounded-lg text-sm"
                    min="0"
                    max="120"
                  />
                  <select
                    value={nuevoGol.equipo}
                    onChange={(e) =>
                      setNuevoGol({
                        ...nuevoGol,
                        equipo: e.target.value as "home" | "away",
                      })
                    }
                    className="px-3 py-2 border border-border rounded-lg text-sm"
                  >
                    <option value="home">{match?.homeTeam}</option>
                    <option value="away">{match?.awayTeam}</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Jugador"
                  value={nuevoGol.jugador}
                  onChange={(e) =>
                    setNuevoGol({ ...nuevoGol, jugador: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Asistencia (opcional)"
                  value={nuevoGol.asistencia}
                  onChange={(e) =>
                    setNuevoGol({ ...nuevoGol, asistencia: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                />
                <Button onClick={handleAddGol} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Gol
                </Button>
              </div>
            </div>

            {goles.length > 0 && (
              <div>
                <label className="block text-sm font-bold mb-3">
                  Goles registrados
                </label>
                <div className="space-y-2">
                  {goles.map((gol, idx) => (
                    <div
                      key={idx}
                      className="flex items-between justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="text-sm">
                        <p className="font-bold">
                          {gol.minuto}' - {gol.jugador}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {gol.equipo === "home"
                            ? match?.homeTeam
                            : match?.awayTeam}
                        </p>
                        {gol.asistencia && (
                          <p className="text-xs text-muted-foreground">
                            Asistencia: {gol.asistencia}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          setGoles(goles.filter((_, i) => i !== idx))
                        }
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === "tarjetas" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-3">
                Registrar Tarjeta
              </label>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="Minuto"
                    value={nuevaTarjeta.minuto}
                    onChange={(e) =>
                      setNuevaTarjeta({
                        ...nuevaTarjeta,
                        minuto: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-border rounded-lg text-sm"
                  />
                  <select
                    value={nuevaTarjeta.equipo}
                    onChange={(e) =>
                      setNuevaTarjeta({
                        ...nuevaTarjeta,
                        equipo: e.target.value as "home" | "away",
                      })
                    }
                    className="px-3 py-2 border border-border rounded-lg text-sm"
                  >
                    <option value="home">{match?.homeTeam}</option>
                    <option value="away">{match?.awayTeam}</option>
                  </select>
                  <select
                    value={nuevaTarjeta.tipo}
                    onChange={(e) =>
                      setNuevaTarjeta({
                        ...nuevaTarjeta,
                        tipo: e.target.value as "amarilla" | "roja",
                      })
                    }
                    className="px-3 py-2 border border-border rounded-lg text-sm"
                  >
                    <option value="amarilla">🟨 Amarilla</option>
                    <option value="roja">🟥 Roja</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Jugador"
                  value={nuevaTarjeta.jugador}
                  onChange={(e) =>
                    setNuevaTarjeta({
                      ...nuevaTarjeta,
                      jugador: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                />
                <Button onClick={handleAddTarjeta} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Tarjeta
                </Button>
              </div>
            </div>

            {tarjetas.length > 0 && (
              <div>
                <label className="block text-sm font-bold mb-3">
                  Tarjetas registradas
                </label>
                <div className="space-y-2">
                  {tarjetas.map((tarjeta, idx) => (
                    <div
                      key={idx}
                      className="flex items-between justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="text-sm">
                        <p className="font-bold">
                          {tarjeta.minuto}'{" "}
                          {tarjeta.tipo === "amarilla" ? "🟨" : "🟥"}{" "}
                          {tarjeta.jugador}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tarjeta.equipo === "home"
                            ? match?.homeTeam
                            : match?.awayTeam}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setTarjetas(tarjetas.filter((_, i) => i !== idx))
                        }
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === "final" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Árbitro</label>
              <input
                type="text"
                placeholder="Nombre del árbitro"
                value={arbitro}
                onChange={(e) => setArbitro(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Observaciones
              </label>
              <textarea
                placeholder="Observaciones del partido (opcional)"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm resize-none"
              />
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
              <p className="text-xs text-primary-700">
                <strong>Resumen:</strong> {match?.homeTeam} {homeScore} -{" "}
                {awayScore} {match?.awayTeam}
              </p>
              <p className="text-xs text-primary-600 mt-1">
                Goles: {goles.length} | Tarjetas: {tarjetas.length}
              </p>
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>

          {currentStep !== "resumen" && (
            <Button
              variant="outline"
              onClick={() => {
                const steps: any[] = ["resumen", "goles", "tarjetas", "final"];
                const idx = steps.indexOf(currentStep);
                if (idx > 0) setCurrentStep(steps[idx - 1]);
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
          )}

          {currentStep !== "final" && (
            <Button
              onClick={() => {
                const steps: any[] = ["resumen", "goles", "tarjetas", "final"];
                const idx = steps.indexOf(currentStep);
                if (idx < steps.length - 1) setCurrentStep(steps[idx + 1]);
              }}
            >
              Siguiente →
            </Button>
          )}

          {currentStep === "final" && (
            <Button onClick={handleSubmit} className="flex-1">
              Registrar Acta
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
