import { useState, useMemo } from "react";
import { Plus, UserPlus, Shield, Check, X, AlertCircle, Info, Trash2, Edit2, Users, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { RecordsUploadModal } from "@/components/records/RecordsUploadModal";

interface Player {
  id: string;
  codigo: string;
  nombres: string;
  apellidos: string;
  facultad: string;
  escuela: string;
  esTitular: boolean;
  validadoDIIA: boolean;
  estadoValidacion: "pendiente" | "aprobado" | "rechazado";
}

interface InscribirEquipoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const FACULTADES_UNAS = [
  "FIA (Ingeniería Agronómica)",
  "FIZ (Zootecnia)",
  "FIIS (Ingeniería en Informática y Sistemas)",
  "FIARN (Recursos Naturales Renovables)",
  "FCA (Ciencias Administrativas)",
  "FCEA (Ciencias Económicas y Administrativas)",
  "FE (Educación)",
];

const DISCIPLINAS = [
  { id: "futbol", name: "Fútbol", cat: ["Varones", "Damas"], min: 11, max: 22 },
  { id: "voley", name: "Vóley", cat: ["Varones", "Damas", "Mixto"], min: 6, max: 12 },
  { id: "basquet", name: "Básquet", cat: ["Varones", "Damas"], min: 5, max: 12 },
  { id: "futsal", name: "Futsal", cat: ["Varones", "Damas"], min: 5, max: 12 },
  { id: "ajedrez", name: "Ajedrez", cat: ["Mixto"], min: 1, max: 2 },
];

export function InscribirEquipoModal({
  isOpen,
  onClose,
  onSubmit,
}: InscribirEquipoModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    facultad: "",
    disciplina: "",
    categoria: "",
  });

  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerCode, setNewPlayerCode] = useState("");
  const [isValidatingDIIA, setIsValidatingDIIA] = useState(false);
  const [recordsData, setRecordsData] = useState<any>(null);
  const [showRecordsModal, setShowRecordsModal] = useState(false);

  const selectedDisc = DISCIPLINAS.find(d => d.id === formData.disciplina);

  const handleAddPlayer = async () => {
    if (newPlayerCode.length !== 10 || !/^\d+$/.test(newPlayerCode)) {
      toast.error("El código debe tener 10 dígitos numéricos");
      return;
    }

    if (players.some(p => p.codigo === newPlayerCode)) {
      toast.error("Este estudiante ya ha sido agregado");
      return;
    }

    setIsValidatingDIIA(true);
    
    // Simular validación DIIA
    setTimeout(() => {
      const isTitular = players.filter(p => p.esTitular).length < (selectedDisc?.min || 11);
      const newPlayer: Player = {
        id: Math.random().toString(36).substr(2, 9),
        codigo: newPlayerCode,
        nombres: "JUAN ALBERTO",
        apellidos: "PÉREZ RODRÍGUEZ",
        facultad: formData.facultad.split(' (')[0],
        escuela: "Ingeniería de Sistemas",
        esTitular: isTitular,
        validadoDIIA: true,
        estadoValidacion: "aprobado",
      };
      
      setPlayers([...players, newPlayer]);
      setNewPlayerCode("");
      setIsValidatingDIIA(false);
      toast.success("Estudiante validado correctamente por DIIA");
    }, 1500);
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const togglePlayerStatus = (id: string) => {
    setPlayers(players.map(p => {
      if (p.id === id) return { ...p, esTitular: !p.esTitular };
      return p;
    }));
  };

  const totals = useMemo(() => {
    return {
      titulares: players.filter(p => p.esTitular).length,
      suplentes: players.filter(p => !p.esTitular).length,
      total: players.length
    };
  }, [players]);

  const canSubmit = useMemo(() => {
    if (!selectedDisc) return false;
    return totals.titulares >= selectedDisc.min && totals.total <= selectedDisc.max;
  }, [totals, selectedDisc]);

  const handleSubmit = () => {
    if (!canSubmit) {
      toast.error("No cumple con el mínimo de jugadores requeridos");
      return;
    }
    if (!recordsData) {
      toast.error("Debes cargar la documentación requerida");
      return;
    }
    onSubmit({
      ...formData,
      players,
      records: recordsData
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Shield className="w-6 h-6" />
            Inscripción de Equipo - UNAS
          </DialogTitle>
          <p className="text-muted-foreground">Gestión de delegados deportivos</p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-6 py-2">
            <div className="flex items-center gap-4 mb-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step === 1 ? "bg-primary text-white" : "bg-primary/20 text-primary"}`}>1</div>
              <Separator className="flex-1" />
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step === 2 ? "bg-primary text-white" : "bg-primary/20 text-primary"}`}>2</div>
              <Separator className="flex-1" />
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step === 3 ? "bg-primary text-white" : "bg-primary/20 text-primary"}`}>3</div>
            </div>
          </div>

          <ScrollArea className="flex-1 px-6">
            {step === 1 ? (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold">Facultad UNAS</Label>
                    <Select onValueChange={(v) => setFormData({...formData, facultad: v})} value={formData.facultad}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar Facultad" />
                      </SelectTrigger>
                      <SelectContent>
                        {FACULTADES_UNAS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Disciplina Deportiva</Label>
                    <Select onValueChange={(v) => setFormData({...formData, disciplina: v})} value={formData.disciplina}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar Disciplina" />
                      </SelectTrigger>
                      <SelectContent>
                        {DISCIPLINAS.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Categoría</Label>
                    <Select onValueChange={(v) => setFormData({...formData, categoria: v})} value={formData.categoria}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar Categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedDisc?.cat.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 space-y-2">
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Requisitos de la Disciplina
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Jugadores mínimos: {selectedDisc?.min || "-"}</li>
                    <li>• Jugadores máximos: {selectedDisc?.max || "-"}</li>
                    <li>• Validación obligatoria vía DIIA (Matrícula vigente)</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-6 py-4">
                <div className="flex flex-col md:flex-row gap-4 items-end bg-muted/30 p-4 rounded-xl border">
                  <div className="flex-1 space-y-2 w-full">
                    <Label className="font-bold">Código Estudiantil (10 dígitos)</Label>
                    <div className="relative">
                      <Input 
                        placeholder="Ej: 0020190123" 
                        value={newPlayerCode}
                        onChange={(e) => setNewPlayerCode(e.target.value)}
                        maxLength={10}
                      />
                      {isValidatingDIIA && <RefreshCw className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-primary" />}
                    </div>
                  </div>
                  <Button 
                    onClick={handleAddPlayer} 
                    disabled={isValidatingDIIA || newPlayerCode.length !== 10}
                    className="gap-2 w-full md:w-auto"
                  >
                    <UserPlus className="w-4 h-4" />
                    Validar con DIIA
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Lista de Jugadores
                    </h3>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-primary/10">Titulares: {totals.titulares}/{selectedDisc?.min}</Badge>
                      <Badge variant="outline">Total: {totals.total}/{selectedDisc?.max}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {players.map(player => (
                      <div key={player.id} className={`flex items-center gap-4 p-3 border rounded-xl transition-all ${player.esTitular ? "bg-white border-primary/30" : "bg-muted/20 border-border"}`}>
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {player.nombres[0]}{player.apellidos[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold truncate text-sm">{player.nombres} {player.apellidos}</p>
                            {player.esTitular ? 
                              <Badge className="bg-primary text-[10px] h-4">TITULAR</Badge> : 
                              <Badge variant="outline" className="text-[10px] h-4">SUPLENTE</Badge>
                            }
                          </div>
                          <p className="text-xs text-muted-foreground">{player.codigo} • {player.escuela}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => togglePlayerStatus(player.id)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removePlayer(player.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <div className="ml-2">
                            <Check className="w-5 h-5 text-green-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                    {players.length === 0 && (
                      <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                        <p className="text-sm text-muted-foreground">No hay jugadores agregados</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-6 py-4">
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 space-y-2 mb-4">
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Gestión de Récords de Documentación
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Carga la documentación requerida para validar la elegibilidad de tus jugadores. Puedes usar carga individual o un folder de Google Drive.
                  </p>
                </div>
                <RecordsUploadModal
                  isOpen={true}
                  onClose={() => {}}
                  onComplete={(data: any) => {
                    setRecordsData(data);
                    toast.success("Documentación cargada correctamente");
                  }}
                  jugadores={players.map(p => ({
                    id: p.id,
                    codigo: p.codigo,
                    nombre: `${p.nombres} ${p.apellidos}`,
                    facultad: p.facultad,
                    escuela: p.escuela,
                  }))}
                  teamInfo={{
                    facultad: formData.facultad,
                    disciplina: formData.disciplina,
                    categoria: formData.categoria,
                  }}
                />
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="p-6 border-t bg-muted/10">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <div className="flex-1" />
          {step === 1 && (
            <Button
              onClick={() => setStep(2)}
              disabled={!formData.facultad || !formData.disciplina || !formData.categoria}
              className="gap-2"
            >
              Siguiente: Agregar Jugadores
            </Button>
          )}
          {step === 2 && (
            <>
              <Button variant="ghost" onClick={() => setStep(1)}>Atrás</Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!canSubmit}
                className="gap-2"
              >
                Siguiente: Cargar Documentación
              </Button>
            </>
          )}
          {step === 3 && (
            <>
              <Button variant="ghost" onClick={() => setStep(2)}>Atrás</Button>
              <Button
                onClick={handleSubmit}
                disabled={!recordsData}
                className="gap-2 bg-primary hover:bg-primary-700"
              >
                <Check className="w-4 h-4" />
                Completar Inscripción
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
